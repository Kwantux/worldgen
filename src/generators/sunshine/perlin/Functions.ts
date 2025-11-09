'use strict';
import { perlin, fade } from "../../height/perlinheight/Functions";

const cache: Map<string, Float32Array> = new Map();

export function perlinMap(segments: number, x: number, y: number, seed: number = 0, scaleH: number = 1, scaleV: number = 1): Float32Array {
  
  const key = `perlin_${segments}_${x}_${y}_${seed}_${scaleH}_${scaleV}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  if (scaleV === 0 || scaleH === 0) {
    throw new Error("ScaleH and ScaleV must not be 0!");
  }

  const data = new Float32Array(segments * segments);
  
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {

      const nx = (x + j / segments);
      const ny = (y + i / segments);
      
      const rawValue = fade(perlin(nx, ny, seed, scaleH, segments)/2+0.5);
      
      const scaledValue = rawValue * scaleV;
      
      data[i * segments + j] = scaledValue;
    }
  }
  
  cache.set(key, data);
  return data;
}