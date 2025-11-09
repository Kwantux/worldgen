export type VegetationTile = {
  height: Float32Array;    // How tall the plants grow (0-1)
  area: Float32Array;      // Coverage area (0 = no vegetation, 1 = 100% coverage)
  greenness: Float32Array; // Color vibrancy based on humidity (0-1)
};

export function createVegetationTile(size: number): VegetationTile {
  return {
    height: new Float32Array(size),
    area: new Float32Array(size),
    greenness: new Float32Array(size)
  };
}
