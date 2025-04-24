import { SEGMENTS } from "../components/terrain/Terrain";

export class FunctionHolder {

  // Function hashes
  private heightGeneratorHash = "";
  private biomeGeneratorHash = "";
  private postProcessingHash = "";
  private colorGeneratorHash = "";

  // Raw height generator
  private heightGenerator: () => Float32Array 
    = () => new Float32Array(SEGMENTS * SEGMENTS);
  public setHeightGenerator(hash: string, func: () => Float32Array) {
    if (this.heightGeneratorHash === hash) return;
    this.heightGeneratorHash = hash;
    this.heightGenerator = func;
    this.rebuildHeight();
  }

  // Biome generator
  private biomeGenerator: (heightMap: Float32Array) => Int16Array
    = () => new Int16Array(SEGMENTS * SEGMENTS);
  public setBiomeGenerator(hash: string, func: (heightMap: Float32Array) => Int16Array) {
    if (this.biomeGeneratorHash === hash) return;
    this.biomeGeneratorHash = hash;
    this.biomeGenerator = func;
    this.rebuildBiome();
  }

  // Post processing
  private postProcessing: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array
    = (heightMap: Float32Array) => heightMap;
  public setPostProcessing(hash: string, func: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array) {
    if (this.postProcessingHash === hash) return;
    this.postProcessingHash = hash;
    this.postProcessing = func;
    this.rebuildPostProcessing();
  }

  // Color generator
  private colorGenerator: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array
    = () => new Float32Array(SEGMENTS * SEGMENTS * 3);
  public setColorGenerator(hash: string, func: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array) {
    if (this.colorGeneratorHash === hash) return;
    this.colorGeneratorHash = hash;
    this.colorGenerator = func;
    this.rebuildColor();
  }


  // Map consumer
  private mapConsumer: (heightMap: Float32Array, colorMap: Float32Array) => void
    = () => {
      console.warn("Map consumer function called before it was defined!")
    };

  public setMapConsumer(func: (heightMap: Float32Array, colorMap: Float32Array) => void) {
    this.mapConsumer = func;
  }


  // Map caches
  private rawHeightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private biomeMap: Int16Array = new Int16Array(SEGMENTS * SEGMENTS);
  private processedHeightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private colorMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS * 3);


  // Rebuild Terrain function
  private rebuildHeight = () => {
    console.log(" [1] Generating height map")
    this.rawHeightMap = this.heightGenerator();
    this.rebuildBiome();
  }

  private rebuildBiome = () => {
    console.log(" [2] Generating biome map")
    this.biomeMap = this.biomeGenerator(this.rawHeightMap);
    this.rebuildPostProcessing();
  }

  private rebuildPostProcessing = () => {
    console.log(" [3] Post processing map")
    this.processedHeightMap = this.postProcessing(this.rawHeightMap, this.biomeMap);
    this.rebuildColor();
  }

  private rebuildColor = () => {
    console.log(" [4] Coloring map")
    this.colorMap = this.colorGenerator(this.rawHeightMap, this.biomeMap);
    this.mapConsumer(this.processedHeightMap, this.colorMap);
  }

  
}