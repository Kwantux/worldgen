export class GeneratorHolder {
  public heightMapGenerator: (x: number, y: number, scale: number, octaves: number, lacunarity: number, persistence: number)  => Float32Array;

  constructor() {
    this.heightMapGenerator = (x: number, y: number, scale: number, octaves: number, lacunarity: number, persistence: number)  => new Float32Array;
  }
}