'use strict';

import { SEGMENTS } from "../../components/terrain/Terrain";

export function waterByHeight(heightMap: Float32Array, relativeHeight: number): Float32Array {
  const data = new Float32Array(heightMap.length);
  const max = Math.max(...heightMap);
  const min = Math.min(...heightMap);

  const waterLevel = min + (max-min) * relativeHeight;
  for (let i = 0; i < heightMap.length; i++) {
    const neighbours = [i, i+1, i-1, i+SEGMENTS, i-SEGMENTS, i-SEGMENTS-1, i-SEGMENTS+1, i+SEGMENTS-1, i+SEGMENTS+1, i+2*SEGMENTS, i-2*SEGMENTS, i+2*SEGMENTS+1, i-2*SEGMENTS+1, i+2*SEGMENTS-1, i-2*SEGMENTS-1, i+2, i-2, i+SEGMENTS+2, i-SEGMENTS+2, i+SEGMENTS-2, i-SEGMENTS-2, i+SEGMENTS*2, i-SEGMENTS*2, i+SEGMENTS*2+1, i-SEGMENTS*2+1, i+SEGMENTS*2-1, i-SEGMENTS*2-1];
    let visible = false;
    for (let j = 0; j < neighbours.length; j++) {
      if (neighbours[j] < heightMap.length && neighbours[j] > 0)
        if (waterLevel >= heightMap[neighbours[j]]) visible = true;
    }
    data[i] = visible ? waterLevel : Infinity;
  }
  return data;
}