'use strict';

import { INCREMENT, SEGMENTS } from "../../../components/terrain/Tile";

const cache: Map<string, Float32Array> = new Map();

export function classicFbmMap(heightNoiseFunction: (x: number, y: number) => number, x: number, y: number, scaleH: number = 1, scaleV: number = 0.01, rawScaleV: number = 1, rawShift: number = 0 , verticalShift: number = 0, exponent: number = 1, octaves: number = 3, lacunarity: number = 2, persistence: number = 0.5, lacunarityScale: number = 1, persistenceScale: number = 1): Float32Array {
  const key = "classicfbm " + x + " " + y + " " + scaleH + " " + scaleV + " " + rawScaleV + " " + rawShift + " " + verticalShift + " " + exponent + " " + octaves + " " + lacunarity + " " + persistence + " " + lacunarityScale + " " + persistenceScale;
  if (scaleH == 0) console.error("[ClassicFBM] scaleH must not be 0");
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const data = new Float32Array(SEGMENTS * SEGMENTS);

  for (let i = 0; i < SEGMENTS; i++) {
    for (let j = 0; j < SEGMENTS; j++) {
      const ix = j + x * INCREMENT;
      const iy = i + y * INCREMENT;
      data[i * SEGMENTS + j] = ( octave(heightNoiseFunction, ix * scaleH, iy * scaleH, octaves, lacunarity, persistence, lacunarityScale, persistenceScale, rawScaleV, rawShift, exponent)) * scaleV + verticalShift;
    }
  }

  cache.set(key, data);
  return data;
}


function octave(heightNoiseFunction: (x: number, y: number) => number, x: number, y: number, octaves: number, lacunarity: number, persistence: number, lacunarityScale: number, persistenceScale: number, rawScaleV: number, rawShift: number, exponent: number) {

  let frequency: number = 1;
  let amplitude: number = 1;
  let sum: number = 0;

  // Iterate through each octave and sum their results together
  // Each octave frequency and persistance grow/shrink exponentially
  for (let i = 0; i <= octaves; i++) {
    const raw: number = heightNoiseFunction(x * frequency, y * frequency);
    sum += (((raw+1) * rawScaleV + rawShift) ** exponent) * amplitude;
    frequency *= lacunarity * (lacunarityScale ** i);
    amplitude *= persistence * (persistenceScale ** i);
  }

  return sum;
}