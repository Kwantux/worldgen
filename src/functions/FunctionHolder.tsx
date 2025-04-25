import { SEGMENTS } from "../components/terrain/Terrain";

export class FunctionHolder {

  // Function hashes
  private heightGeneratorHash = "";
  private biomeGeneratorHash = "";
  private postProcessingHash = "";
  private colorGeneratorHash = "";
  private waterGeneratorHash = "";


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

  // Water generator
  private waterGenerator: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array
    = () => {
    return new Float32Array(SEGMENTS * SEGMENTS);
  };
  public setWaterGenerator(hash: string, func: (heightMap: Float32Array) => Float32Array) {
    if (this.waterGeneratorHash === hash) return;
    this.waterGeneratorHash = hash;
    this.waterGenerator = func;
    this.rebuildWater()
  }


  // Height Map consumer
  private heightMapConsumer: (heightMap: Float32Array) => void
    = () => {
      console.warn("Height map consumer function called before it was defined!")
    };

  public setHeightMapConsumer(func: (heightMap: Float32Array) => void) {
    this.heightMapConsumer = func;
  }

  // Color Map consumer
  private colorMapConsumer: (colorMap: Float32Array) => void
    = () => {
      console.warn("Color map consumer function called before it was defined!")
    };

  public setColorMapConsumer(func: (colorMap: Float32Array) => void) {
    this.colorMapConsumer = func;
  }

  // Water Map consumer
  private waterMapConsumer: (waterMap: Float32Array) => void
    = () => {
      console.warn("Water map consumer function called before it was defined!")
    };

  public setWaterMapConsumer(func: (waterMap: Float32Array) => void) {
    this.waterMapConsumer = func;
  }




  // Map caches
  private rawHeightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private biomeMap: Int16Array = new Int16Array(SEGMENTS * SEGMENTS);
  private processedHeightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private colorMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS * 3);
  private waterMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);


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
    this.heightMapConsumer(this.processedHeightMap);
    this.rebuildColor();
    this.rebuildWater();
  }

  private rebuildColor = () => {
    console.log(" [4] Coloring map")
    this.colorMap = this.colorGenerator(this.processedHeightMap, this.biomeMap);
    this.colorMapConsumer(this.colorMap);
  }

  private rebuildWater = () => {
    console.log(" [5] Filling water")
    this.waterMap = this.waterGenerator(this.processedHeightMap, this.biomeMap);
    this.waterMapConsumer(this.waterMap);
  }

  
}