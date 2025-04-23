'use strict';

export function colorByBiome(biomeMap: Int16Array): Float32Array {
  const data = new Float32Array(biomeMap.length * 3);

  for (let i = 0; i < biomeMap.length; i++) {
    const col = biomeColor(biomeMap[i]);
    data[i * 3] = col[0];
    data[i * 3 + 1] = col[1];
    data[i * 3 + 2] = col[2];
  }
  return data;
}


export const BIOME_PLAINS = 1;
export const BIOME_FOREST = 2;
export const BIOME_DESERT = 3;
export const BIOME_TUNDRA = 4;
export const BIOME_MOUNTAIN = 5;
export const BIOME_OCEAN = 6;
export const BIOME_ICE = 7;

export const BIOME_UNKNOWN = 0;

export const BIOME_COLORS = {
  1: [0.5, 0.9, 0.3], // Plains
  2: [0.2, 0.6, 0.2], // Forest
  3: [0.9, 0.7, 0.1], // Desert
  4: [0.5, 0.7, 0.9], // Tundra
  5: [0.4, 0.4, 0.6], // Mountain
  6: [0.1, 0.3, 0.8], // Ocean
  7: [0.8, 0.9, 1.0], // Ice

  0: [1.0, 0.4, 0.8]  // Unknown
};

function biomeColor(biome: number): number[] {
  const col = BIOME_COLORS[biome as keyof typeof BIOME_COLORS];
  if (col) {
    return col;
  }
  return BIOME_COLORS[BIOME_UNKNOWN];
}