'use strict';

export function warpedMap(heightNoiseFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scaleH: number = 1, scaleV: number = 0.01, rawScaleV: number = 1, rawShift: number = 0 ,exponent: number = 1, octavesNumber: number = 3, lacunarity: number = 2, persistence: number = 0.5, lacunarityScale: number = 1, persistenceScale: number = 1, persistenceIncByHeight: number = 0.15): Float32Array {
  const data = new Float32Array(segments * segments);
  if (scaleH == 0) console.error("[WarpedFBM] scaleH must not be 0");

  const octaves = generateOctaves(octavesNumber, lacunarity, persistence, lacunarityScale, persistenceScale);

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const ix = j + x * segments;
      const iy = i + y * segments;
      data[i * segments + j] = ( octave(heightNoiseFunction, ix / scaleH, iy / scaleH, octaves, rawScaleV, rawShift, exponent, persistenceIncByHeight)) * scaleV;
    }
  }
  return data;
}

function generateOctaves(octavesNumber: number, lacunarity: number, persistence: number, lacunarityScale: number, persistenceScale: number): Octave[] {
  const result: Octave[] = [];
  for (let i = 0; i < octavesNumber; i++) {
    result.push({
      frequency: Math.pow(lacunarity*(lacunarityScale ** i), i), 
      amplitude: Math.pow(persistence*(persistenceScale ** i), i)
    });
  }
  console.log(result);
  return result.sort((a, b) => a.amplitude - b.amplitude);
}

type Octave = {
  frequency: number;
  amplitude: number;
}


function octave(heightNoiseFunction: (x: number, y: number) => number, x: number, y: number, octaves: Octave[], rawScaleV: number, rawShift: number, exponent: number, persistenceIncByHeight: number) {

  let sum: number = 0;
  let roughHeight = 0.5+heightNoiseFunction(x * octaves[octaves.length-1].frequency, y * octaves[octaves.length-1].frequency)/2;


  // Iterate through each octave and sum their results together
  // Each octave frequency and persistance grow/shrink exponentially
  for (let i = 0; i < octaves.length; i++) {
    const exp = i==octaves.length-1 ? 1: lerp(1, exponent, roughHeight**3);
    const raw: number = heightNoiseFunction(x * octaves[i].frequency, y * octaves[i].frequency);
    sum += (((raw+1) * rawScaleV + rawShift) ** exp) * octaves[i].amplitude * lerp(1, persistenceIncByHeight, roughHeight);
  }
  return sum;
}
  
// linear interpolation
function lerp(a: number, b: number, x: number): number {
    return a + x * (b - a);
}
