'use strict';

export function warpedMap(heightNoiseFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scaleH: number = 1, scaleV: number = 0.01, rawScaleV: number = 1, rawShift: number = 0 ,exponent: number = 1, octaves: number = 3, lacunarity: number = 2, persistence: number = 0.5, lacunarityScale: number = 1, persistenceScale: number = 1, persistenceIncByHeight: number = 0.15): Float32Array {
  const data = new Float32Array(segments * segments);

  for (let iy = segments * y; iy < segments * (y + 1); iy++) {
    for (let ix = segments * x; ix < segments * (x + 1); ix++) {
      data[ix * segments + iy] = ( octave(heightNoiseFunction, ix / scaleH, iy / scaleH, octaves, lacunarity, persistence, lacunarityScale, persistenceScale, persistenceIncByHeight, rawScaleV, rawShift, exponent)) * scaleV;
    }
  }
  return data;
}

function octave(heightNoiseFunction: (x: number, y: number) => number, x: number, y: number, octaves: number, lacunarity: number, persistence: number, lacunarityScale: number, persistenceScale: number, persistenceIncByHeight: number, rawScaleV: number, rawShift: number, exponent: number) {

  let frequency: number = 1;
  let warp: number = 1 + heightNoiseFunction(x * lacunarity ** octaves, y * lacunarity ** octaves)*persistenceIncByHeight - 2*persistenceIncByHeight;
  let amplitude: number = 1;
  let sum: number = 0;

  // Iterate through each octave and sum their results together
  // Each octave frequency and persistance grow/shrink exponentially
  for (let i = 0; i <= octaves; i++) {
    const raw: number = heightNoiseFunction(x * frequency, y * frequency);
    sum += (((raw+1) * rawScaleV + rawShift) ** exponent) * amplitude;
    frequency *= lacunarity * (lacunarityScale ** i);
    amplitude *= persistence * lerp(warp, 1, i**0.5/octaves**0.5) * (persistenceScale ** i);
  }
  return sum;
}
  
// linear interpolation
function lerp(a: number, b: number, x: number): number {
    return a + x * (b - a);
}
