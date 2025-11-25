'use strict';

import { fade } from "../perlinheight/Functions";

// Generates terrain heightmap using improved fractal Brownian motion
export function improvedMap(
  heightNoiseFunction: (x: number, y: number) => number,
  segments: number,
  x: number,
  y: number,
  scaleH: number = 1,
  scaleV: number = 0.01,
  rawScaleV: number = 1,
  rawShift: number = 0,
  verticalShift: number = 0,
  exponent: number = 1,
  octavesNumber: number = 3,
  lacunarity: number = 2,
  persistence: number = 0.5,
  lacunarityScale: number = 1,
  persistenceScale: number = 1,
  persistenceIncByHeight: number = 0.15,
  plainliness_frequency: number = 0.3,

  // Enable improvements
  largestOctaveExponentOne: boolean = true,
  octaveDependentExponent: boolean = true,
  heightDependentExponent: boolean = true,
  heightDependentScale: boolean = true,
  plainlinessDependentSmoothing: boolean = true,
  plainlinessDependentScale: boolean = true
): Float32Array {
  const data = new Float32Array(segments * segments);
  if (scaleH === 0) {
    console.error("[ImprovedFBM] scaleH must not be 0");
    return data;
  }

  const octaves = generateOctaves(octavesNumber, lacunarity, persistence, lacunarityScale, persistenceScale);

  // Generate height values for each point
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const ix = j + x * (segments - 1);
      const iy = i + y * (segments - 1);
      
      const noise = octave(
        heightNoiseFunction, 
        ix * scaleH, 
        iy * scaleH, 
        octaves, 
        rawScaleV, 
        rawShift, 
        exponent, 
        persistenceIncByHeight,
        plainliness_frequency,
        largestOctaveExponentOne,
        octaveDependentExponent,
        heightDependentExponent,
        heightDependentScale,
        plainlinessDependentSmoothing,
        plainlinessDependentScale
      );
      
      data[i * segments + j] = noise * scaleV + verticalShift;
    }
  }
  return data;
}

// Generate octaves with decreasing frequency and increasing amplitude
function generateOctaves(octavesNumber: number, lacunarity: number, persistence: number, lacunarityScale: number, persistenceScale: number): Octave[] {
  const result: Octave[] = [];
  for (let i = 0; i < octavesNumber; i++) {
    result.push({
      // Higher octaves have more influence but less detail
      frequency: Math.pow(lacunarity*(lacunarityScale ** i), i), 
      amplitude: Math.pow(persistence*(persistenceScale ** i), i)
    });
  }

  // Sort by amplitude for consistent processing
  return result.sort((a, b) => a.amplitude - b.amplitude);
}

// Controls the detail and influence of each noise layer
type Octave = {
  frequency: number;  // Higher = more detail
  amplitude: number;  // Higher = more influence
}


// Combines multiple octaves of noise
function octave(
  heightNoiseFunction: (x: number, y: number) => number, 
  x: number, 
  y: number, 
  octaves: Octave[], 
  rawScaleV: number, 
  rawShift: number, 
  exponent: number, 
  persistenceIncByHeight: number, 
  plainliness_frequency: number,

  // Enable improvements
  largestOctaveExponentOne: boolean = true,
  octaveDependentExponent: boolean = true,
  heightDependentExponent: boolean = true,
  heightDependentScale: boolean = true,
  plainlinessDependentSmoothing: boolean = true,
  plainlinessDependentScale: boolean = true,
) {
  let sum = 0;
  
  // Sample noise at different frequencies for terrain features
  const baseFreq = octaves[octaves.length-1].frequency;
  let roughHeight = 0.5 + heightNoiseFunction(x * baseFreq, y * baseFreq) / 2;  // 0 to 1
  let plainliness = 0.5 + heightNoiseFunction(x * baseFreq*plainliness_frequency, y * baseFreq*plainliness_frequency) / 2;  // 0 to 1

  // Combine all octaves with varying influence
  for (let i = 0; i < octaves.length; i++) {
    // Adjust exponent based on height and octave level
    const exp = (i === octaves.length - 1 || !largestOctaveExponentOne)
      ? 1 // The largest octave won't make spikey mountains, but instead smoothly shift terrain vertically, so that flat lands at different altitudes are possible
      : lerp(1, // Finer octaves are less spikey
        lerp(0, exponent, heightDependentExponent ? roughHeight**3 : 1), // The lower the terrain, the less of an effect the finer octaves have
        octaveDependentExponent ? (i/octaves.length)**3 : 1);
      
    // Sample noise
    const h1 = 0.5 + heightNoiseFunction(x * octaves[i].frequency, y * octaves[i].frequency) / 2; // 0 to 1

    // Smooth height values if plainliness is high
    const h2 = plainlinessDependentSmoothing ? 
      lerp(h1, fade(h1**2), plainliness) * 2 - 1 : // -1 to 1
      h1 * 2 - 1; // just unnormalize the value without transformation

    // Make fine octaves less influential if plainliness is high
    const h3 = plainlinessDependentScale ?
      lerp(h2, 0, plainliness*(1-i/octaves.length)) : // -1 to 1
      h2; // pass through value

    // Apply exponent and octave amplitude
    const h4 = (((h3 + 1) * rawScaleV + rawShift) ** exp) * octaves[i].amplitude;
    
    // Combine with amplitude and persistence adjustments
    const h5 = heightDependentScale ?
      h4 *lerp(1, persistenceIncByHeight * roughHeight, (1 - i/octaves.length)**3) :
      h4; // pass through value

    sum += h5;
  }
  return sum;
}
  
function lerp(a: number, b: number, x: number): number {
    return a + x * (b - a);
}
