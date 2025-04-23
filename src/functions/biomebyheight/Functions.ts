'use strict';

import { BIOME_ICE, BIOME_MOUNTAIN, BIOME_OCEAN, BIOME_PLAINS } from "../colorbybiome/Functions";

export function biomeByHeight(heightMap: Float32Array): Int16Array {
  const data = new Int16Array(heightMap.length);
  const max = Math.max(...heightMap);
  const min = Math.min(...heightMap);

  for (let i = 0; i < heightMap.length; i++) {
    data[i] = biomeByRelativeHeight((heightMap[i]-min)/max);
  }
  return data;
}

function biomeByRelativeHeight(height: number): number {
  if (height < 0.2) {
    return BIOME_OCEAN;
  }
  if (height < 0.6) {
    return BIOME_PLAINS;
  }
  if (height < 0.8) {
    return BIOME_MOUNTAIN;
  }
  return BIOME_ICE;
}