'use strict';
import { perlin } from "../height/perlinheight/Functions";

const cache: Map<string, Float32Array> = new Map();

export function perlinMap(segments: number, x: number, y: number, seed: number = 0, scaleH: number = 1, scaleV: number = 0.01): Float32Array {
  const key = "perlin " + segments + " " + seed + " " + scaleH + " " + scaleV;
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const data = new Float32Array(segments * segments);

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const ix = j + x * segments;
      const iy = i + y * segments;
      data[i * segments + j] = ( perlin(ix / scaleH, iy / scaleH, seed, scaleH, segments)) * scaleV;
    }
  }

  cache.set(key, data);
  return data;
}