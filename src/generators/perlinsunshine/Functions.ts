'use strict';
import { perlin } from "../height/perlinheight/Functions";

const cache: Map<string, Float32Array> = new Map();

// Normalize coordinates to avoid large numbers that can cause precision issues
const NORMALIZATION_FACTOR = 1000;

export function perlinMap(segments: number, x: number, y: number, seed: number = 0, scaleH: number = 1, scaleV: number = 0.01): Float32Array {
  console.log("perlinMap called with:", { segments, x, y, seed, scaleH, scaleV });
  
  const key = `perlin_${segments}_${x}_${y}_${seed}_${scaleH}_${scaleV}`;
  if (cache.has(key)) {
    console.log("Found in cache");
    return cache.get(key)!;
  }

  if (scaleV === 0 || scaleH === 0) {
    throw new Error("ScaleH and ScaleV must not be 0!");
  }

  const data = new Float32Array(segments * segments);
  let min = Infinity;
  let max = -Infinity;
  let zeroCount = 0;
  const permutationTableSize = 256; // Fixed size for better noise quality
  
  // Pre-calculate the normalization factor based on the scale
  const effectiveScale = scaleH / NORMALIZATION_FACTOR;

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      // Use normalized coordinates to avoid precision issues with large numbers
      const nx = (x + j / segments) * effectiveScale;
      const ny = (y + i / segments) * effectiveScale;
      
      // Get raw perlin value (using a fixed permutation table size)
      const rawValue = perlin(nx, ny, seed, 1, permutationTableSize)/2+0.5;
      
      // Apply vertical scaling
      const scaledValue = rawValue * scaleV;
      
      // Track min/max for debugging
      if (scaledValue < min) min = scaledValue;
      if (scaledValue > max) max = scaledValue;
      if (Math.abs(scaledValue) < 0.0001) zeroCount++;
      
      // Store the value
      data[i * segments + j] = scaledValue;
    }
  }

  console.log(`Perlin noise stats - Min: ${min.toFixed(6)}, Max: ${max.toFixed(6)}, Zeros: ${zeroCount}/${data.length}`);
  if (zeroCount === data.length) {
    console.warn("WARNING: All values are zero! Check the noise generation parameters.");
  } else {
    console.log("First few non-zero values:", 
      Array.from(data).filter(v => Math.abs(v) > 0.0001).slice(0, 5).map(v => v.toFixed(6))
    );
  }
  
  cache.set(key, data);
  return data;
}