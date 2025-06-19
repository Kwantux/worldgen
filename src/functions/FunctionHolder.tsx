import { SEGMENTS } from "../components/terrain/Terrain";
import { BIOME_COLORS } from "./colorbybiome/Functions";

export class FunctionHolder {

  // Function hashes
  private heightGeneratorHash = "";
  private waterGeneratorHash = "";
  private temperatureGeneratorHash = "";
  private biomeGeneratorHash = "";
  private postProcessingHash = "";
  private colorGeneratorHash = "";

  // Height map image generation
  private generateHeightMapImage = (heightMap: Float32Array): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const size = Math.sqrt(heightMap.length);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    const max = Math.max(...heightMap);
    const min = Math.min(...heightMap);

    // Normalize height values to 0-255 range
    for (let i = 0; i < heightMap.length; i++) {
      const normalized = ((heightMap[i] - min) / (max - min)) * 255;
      const pixelIndex = i * 4;
      data[pixelIndex] = normalized;      // Red
      data[pixelIndex + 1] = normalized;  // Green
      data[pixelIndex + 2] = normalized;  // Blue
      data[pixelIndex + 3] = 255;         // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  private generateBiomeMapImage = (biomeMap: Int16Array): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const size = Math.sqrt(biomeMap.length);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let i = 0; i < biomeMap.length; i++) {
      const pixelIndex = i * 4;
      data[pixelIndex] = BIOME_COLORS[biomeMap[i]][0]*255;      // Red
      data[pixelIndex + 1] = BIOME_COLORS[biomeMap[i]][1]*255;  // Green
      data[pixelIndex + 2] = BIOME_COLORS[biomeMap[i]][2]*255;  // Blue
      data[pixelIndex + 3] = 255;         // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  private generateColorMapImage = (colorMap: Float32Array): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const size = Math.sqrt(colorMap.length / 3);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let i = 0; i < colorMap.length / 3; i++) {
      const pixelIndex = i * 4;
      const colorMapIndex = i * 3;
      data[pixelIndex] = colorMap[colorMapIndex]*255;          // Red
      data[pixelIndex + 1] = colorMap[colorMapIndex + 1]*255;  // Green
      data[pixelIndex + 2] = colorMap[colorMapIndex + 2]*255;  // Blue
      data[pixelIndex + 3] = 255;                          // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  private generateWaterMapImage = (waterMap: Float32Array): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const size = Math.sqrt(waterMap.length);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    const max = Math.max(...this.processedHeightMap);
    const min = Math.min(...this.processedHeightMap);

    for (let i = 0; i < waterMap.length; i++) {
      const pixelIndex = i * 4;
      data[pixelIndex] = waterMap[i] == Infinity ? 255 : 0;      // Red
      data[pixelIndex + 1] = waterMap[i] == Infinity ? 255 : ((waterMap[i] - min) / (max - min)) * 255;  // Green
      data[pixelIndex + 2] = 255;  // Blue
      data[pixelIndex + 3] = 255;         // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }


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
  public setWaterGenerator(hash: string, func: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array) {
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

  // Height Map image consumer
  private heightMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Height map image consumer function called before it was defined!")
  };

  public setHeightMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.heightMapImageConsumer = func;
  }

  // Biome Map image consumer
  private biomeMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Biome map image consumer function called before it was defined!")
  };

  public setBiomeMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.biomeMapImageConsumer = func;
  }

  // Color Map consumer
  private colorMapConsumer: (colorMap: Float32Array) => void
    = () => {
      console.warn("Color map consumer function called before it was defined!")
    };

  public setColorMapConsumer(func: (colorMap: Float32Array) => void) {
    this.colorMapConsumer = func;
  }

  // Color Map image consumer
  private colorMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Color map image consumer function called before it was defined!")
  };

  public setColorMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.colorMapImageConsumer = func;
  }

  // Water Map consumer
  private waterMapConsumer: (waterMap: Float32Array) => void
    = () => {
      console.warn("Water map consumer function called before it was defined!")
    };

  public setWaterMapConsumer(func: (waterMap: Float32Array) => void) {
    this.waterMapConsumer = func;
  }

  // Water Map image consumer
  private waterMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Water map image consumer function called before it was defined!")
  };

  public setWaterMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.waterMapImageConsumer = func;
  }




  // Time tracking
  private times: { [key: string]: number } = {
    height: 0,
    biome: 0,
    postProcessing: 0,
    color: 0,
    water: 0
  };
  private timeUpdateCallback: (times: { [key: string]: number }) => void = () => {};

  public setTimeUpdateCallback(callback: (times: { [key: string]: number }) => void) {
    this.timeUpdateCallback = callback;
  }

  public getTimes() {
    return this.times;
  }

  private updateTime(key: string, value: number) {
    this.times[key] = value;
    this.timeUpdateCallback(this.times);
  }

  // Map caches
  private rawHeightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private biomeMap: Int16Array = new Int16Array(SEGMENTS * SEGMENTS);
  private processedHeightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private colorMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS * 3);
  private waterMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);


  // Update right sidebar
  public updateRightSidebar() {
    if (this.heightMapImageConsumer) {
      const image = this.generateHeightMapImage(this.processedHeightMap);
      this.heightMapImageConsumer(image);
    }
    if (this.biomeMapImageConsumer) {
      const image = this.generateBiomeMapImage(this.biomeMap);
      this.biomeMapImageConsumer(image);
    }
    if (this.colorMapImageConsumer) {
      const image = this.generateColorMapImage(this.colorMap);
      this.colorMapImageConsumer(image);
    }
    if (this.waterMapImageConsumer) {
      const image = this.generateWaterMapImage(this.waterMap);
      this.waterMapImageConsumer(image);
    }
  }


  // Rebuild Terrain function
  private rebuildHeight = () => {
    console.log(" [1] Generating height map")
    const startTime = performance.now();
    this.rawHeightMap = this.heightGenerator();
    const endTime = performance.now();
    this.heightMapConsumer(this.rawHeightMap);
    this.updateTime('height', endTime - startTime);
    this.rebuildBiome();
  }

  private rebuildBiome = () => {
    console.log(" [2] Generating biome map")
    const startTime = performance.now();
    this.biomeMap = this.biomeGenerator(this.rawHeightMap);
    const endTime = performance.now();
    this.updateTime('biome', endTime - startTime);

    // Generate biome map image and trigger consumer if present
    if (this.biomeMapImageConsumer) {
      const image = this.generateBiomeMapImage(this.biomeMap);
      this.biomeMapImageConsumer(image);
    }

    this.rebuildPostProcessing();
  }

  private rebuildPostProcessing = () => {
    console.log(" [3] Post processing map")
    const startTime = performance.now();
    this.processedHeightMap = this.postProcessing(this.rawHeightMap, this.biomeMap);
    const endTime = performance.now();
    this.heightMapConsumer(this.processedHeightMap);
    this.updateTime('postProcessing', endTime - startTime);

    // Generate processed height map image and trigger consumer if present
    if (this.heightMapImageConsumer) {
      const image = this.generateHeightMapImage(this.processedHeightMap);
      this.heightMapImageConsumer(image);
    }
    
    this.rebuildColor();
    this.rebuildWater();
  }
  
  private rebuildColor = () => {
    console.log(" [4] Coloring map")
    const startTime = performance.now();
    this.colorMap = this.colorGenerator(this.processedHeightMap, this.biomeMap);
    const endTime = performance.now();
    this.colorMapConsumer(this.colorMap);
    this.updateTime('color', endTime - startTime);
    
    // Generate color map image and trigger consumer if present
    if (this.colorMapImageConsumer) {
      const image = this.generateColorMapImage(this.colorMap);
      this.colorMapImageConsumer(image);
    }
  }
  
  private rebuildWater = () => {
    console.log(" [5] Filling water")
    const startTime = performance.now();
    this.waterMap = this.waterGenerator(this.processedHeightMap, this.biomeMap);
    const endTime = performance.now();
    this.waterMapConsumer(this.waterMap);
    this.updateTime('water', endTime - startTime);
    
    // Generate water map image and trigger consumer if present
    if (this.waterMapImageConsumer) {
      const image = this.generateWaterMapImage(this.waterMap);
      this.waterMapImageConsumer(image);
    }

    // this.rebuildVegetation();
  }
  
}