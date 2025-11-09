'use strict';

export function waterByHeight(heightMap: Float32Array, height: number): Float32Array {
  const data = new Float32Array(heightMap.length);

  for (let i = 0; i < heightMap.length; i++) {
    data[i] = height;
  }
  return data;
}