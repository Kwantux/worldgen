'use strict';

export function colorByBiome(biomeMap: Int16Array, blend_radius: number): Float32Array {
  const data = new Float32Array(biomeMap.length * 3);

  for (let i = 0; i < biomeMap.length; i++) {
    const col = biomeColor(biomeMap[i]);
    for (let j = i - blend_radius; j <= i + blend_radius; j++) {
      if (j < 0 || j >= biomeMap.length) continue;
      const col2 = biomeColor(biomeMap[j]);
      col[0] += col2[0];
      col[1] += col2[1];
      col[2] += col2[2];
    }
    col[0] /= (blend_radius * 2 + 1);
    col[1] /= (blend_radius * 2 + 1);
    col[2] /= (blend_radius * 2 + 1);

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
export const BIOME_JUNGLE = 8;

export const BIOME_UNKNOWN = 0;

export const BIOME_COLORS: number[][] = [
  [1.0, 0.4, 0.8], // Unknown
  [0.5, 0.9, 0.3], // Plains
  [0.2, 0.6, 0.2], // Forest
  [0.9, 0.7, 0.1], // Desert
  [0.5, 0.7, 0.9], // Tundra
  [0.4, 0.4, 0.6], // Mountain
  [0.9, 0.9, 0.4], // Ocean
  [0.8, 0.9, 1.0], // Ice
  [0.2, 1.0, 0.3]  // Jungle
];

function biomeColor(biome: number): number[] {
  return [BIOME_COLORS[biome][0], BIOME_COLORS[biome][1], BIOME_COLORS[biome][2]];
}