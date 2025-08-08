'use strict';

export function waterByHeight(heightMap: Float32Array, relativeHeight: number): Float32Array {
  const data = new Float32Array(heightMap.length);
  const max = Math.max(...heightMap);
  const min = Math.min(...heightMap);
  const waterLevel = min + (max-min) * relativeHeight;

  for (let i = 0; i < heightMap.length; i++) {
    data[i] = waterLevel;
  }
  return data;
}