import { SEGMENTS } from "../components/terrain/Terrain";

export class FunctionHolder {

  // Function hashes
  private heightGeneratorHash = "";
  private biomeGeneratorHash = "";
  private colorGeneratorHash = "";

  // Generator functions
  private heightGenerator: () => Float32Array 
    = () => new Float32Array(SEGMENTS * SEGMENTS);
  public setHeightGenerator(hash: string, func: () => Float32Array) {
    if (this.heightGeneratorHash === hash) return;
    this.heightGeneratorHash = hash;
    this.heightGenerator = func;
    this.rebuildHeight();
  }

  private biomeGenerator: (heightMap: Float32Array) => Int16Array
    = () => new Int16Array(SEGMENTS * SEGMENTS);
  public setBiomeGenerator(hash: string, func: (heightMap: Float32Array) => Int16Array) {
    if (this.biomeGeneratorHash === hash) return;
    this.biomeGeneratorHash = hash;
    this.biomeGenerator = func;
    this.rebuildBiome();
  }

  private colorGenerator: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array
    = () => new Float32Array(SEGMENTS * SEGMENTS * 3);
  public setColorGenerator(hash: string, func: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array) {
    if (this.colorGeneratorHash === hash) return;
    this.colorGeneratorHash = hash;
    this.colorGenerator = func;
    this.rebuildColor();
  }

  private mapConsumer: (heightMap: Float32Array, colorMap: Float32Array) => void
    = () => {
      console.warn("Map consumer function called before it was defined!")
    };

  public setMapConsumer(func: (heightMap: Float32Array, colorMap: Float32Array) => void) {
    this.mapConsumer = func;
  }

  // Map caches
  private heightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private biomeMap: Int16Array = new Int16Array(SEGMENTS * SEGMENTS);
  private colorMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS * 3);

  // Rebuild Terrain function
  private rebuildHeight = () => {
    console.log("Generating height map")
    this.heightMap = this.heightGenerator();
    this.rebuildBiome();
  }

  private rebuildBiome = () => {
    console.log("Generating biome map")
    this.biomeMap = this.biomeGenerator(this.heightMap);
    this.rebuildColor();
  }

  private rebuildColor = () => {
    console.log("Generating color map")
    this.colorMap = this.colorGenerator(this.heightMap, this.biomeMap);
    this.mapConsumer(this.heightMap, this.colorMap);
  }

  
}