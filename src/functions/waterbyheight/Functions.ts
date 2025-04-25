'use strict';

import { SEGMENTS } from "../../components/terrain/Terrain";

export function waterByHeight(heightMap: Float32Array, relativeHeight: number): Float32Array {
  const data = new Float32Array(heightMap.length);
  const max = Math.max(...heightMap);
  const min = Math.min(...heightMap);

  const waterLevel = min + (max-min) * relativeHeight;
  for (let i = 0; i < heightMap.length; i++) {
    const neighbours = [i, i+1, i-1, i+SEGMENTS, i-SEGMENTS, i-SEGMENTS-1, i-SEGMENTS+1, i+SEGMENTS-1, i+SEGMENTS+1];
    let visible = false;
    for (let i = 0; i < 9; i++) {
      if (neighbours[i] < heightMap.length && neighbours[i] > 0)
        if (heightMap[i] > heightMap[neighbours[i]]) visible = true;
    }
    data[i] = visible ? waterLevel : Infinity;
  }
  return data;
}