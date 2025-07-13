import { SEGMENTS } from "../components/terrain/Terrain";
import { BIOME_COLORS } from "./colorbybiome/Functions";

export class FunctionHolder {

  // Function hashes
  private rawHeightGeneratorHash = "";
  private heightPostProcessingHash = "";
  private waterGeneratorHash = "";
  private sunshineGeneratorHash = "";
  private humidityGeneratorHash = "";
  private temperatureGeneratorHash = "";
  private biomeGeneratorHash = "";
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

  private generateSunshineMapImage = (sunshineMap: Float32Array): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const size = Math.sqrt(sunshineMap.length);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    const max = Math.max(...sunshineMap);
    const min = Math.min(...sunshineMap);

    // Normalize temperature values to 0-255 range
    for (let i = 0; i < sunshineMap.length; i++) {
      const normalized = ((sunshineMap[i] - min) / (max - min)) * 255;
      const pixelIndex = i * 4;
      data[pixelIndex] = normalized;      // Red
      data[pixelIndex + 1] = normalized;  // Green
      data[pixelIndex + 2] = 0;           // Blue
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

  private generateHumidityMapImage = (humidityMap: Float32Array): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const size = Math.sqrt(humidityMap.length);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    const max = Math.max(...this.processedHeightMap);
    const min = Math.min(...this.processedHeightMap);

    for (let i = 0; i < humidityMap.length; i++) {
      const pixelIndex = i * 4;
      const normalized = ((humidityMap[i] - min) / (max - min)) * 255;
      data[pixelIndex] = 0;               // Red
      data[pixelIndex + 1] = normalized;  // Green
      data[pixelIndex + 2] = normalized;  // Blue
      data[pixelIndex + 3] = 255;         // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  private generateTemperatureMapImage(temperatureMap: Float32Array): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const size = Math.sqrt(temperatureMap.length);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    const max = Math.max(...temperatureMap);
    const min = Math.min(...temperatureMap);


    for (let i = 0; i < temperatureMap.length; i++) {
      const pixelIndex = i * 4;
      const normalized = ((temperatureMap[i] - min) / (max - min)) * 255;
      data[pixelIndex] = normalized;               // Red
      data[pixelIndex + 1] = 255-Math.abs(normalized-128)*2;  // Green
      data[pixelIndex + 2] = 255 - normalized;  // Blue
      data[pixelIndex + 3] = 255;         // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }


  // Raw height generator
  private rawHeightGenerator: () => Float32Array 
    = () => new Float32Array(SEGMENTS * SEGMENTS);
  public setRawHeightGenerator(hash: string, func: () => Float32Array) {
    if (this.rawHeightGeneratorHash === hash) return;
    this.rawHeightGeneratorHash = hash;
    this.rawHeightGenerator = func;
    this.rebuildHeight();
  }
  
  // Post processing
  private heightPostProcessing: (heightMap: Float32Array) => Float32Array
  = (heightMap: Float32Array) => heightMap;
  public setHeightPostProcessing(hash: string, func: (heightMap: Float32Array) => Float32Array) {
    if (this.heightPostProcessingHash === hash) return;
    this.heightPostProcessingHash = hash;
    this.heightPostProcessing = func;
    this.rebuildHeightPostProcessing();
  }
  
  // Sunshine generator
  private sunshineGenerator: () => Float32Array 
  = () => new Float32Array(SEGMENTS * SEGMENTS);
  public setSunshineGenerator(hash: string, func: () => Float32Array) {
    if (this.sunshineGeneratorHash === hash) return;
    this.sunshineGeneratorHash = hash;
    this.sunshineGenerator = func;
    this.rebuildSunshine();
  }
  
  // Water generator
  private waterGenerator: (heightMap: Float32Array) => Float32Array
  = () => {
    return new Float32Array(SEGMENTS * SEGMENTS);
  };
  public setWaterGenerator(hash: string, func: (heightMap: Float32Array) => Float32Array) {
    if (this.waterGeneratorHash === hash) return;
    this.waterGeneratorHash = hash;
    this.waterGenerator = func;
    console.log("water generator set")
    this.rebuildWater()
  }

  // Humidity generator
  private humidityGenerator: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array
  = () => {
    return new Float32Array(SEGMENTS * SEGMENTS);
  };
  public setHumidityGenerator(hash: string, func: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array) {
    if (this.humidityGeneratorHash === hash) return;
    this.humidityGeneratorHash = hash;
    this.humidityGenerator = func;
    this.rebuildHumidity()
  }

  // Temperature generator
  private temperatureGenerator: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array
  = () => {
    return new Float32Array(SEGMENTS * SEGMENTS);
  };
  public setTemperatureGenerator(hash: string, func: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array) {
    if (this.temperatureGeneratorHash === hash) return;
    this.temperatureGeneratorHash = hash;
    this.temperatureGenerator = func;
    this.rebuildTemperature()
  }

  // Biome generator
  private biomeGenerator: (heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array) => Int16Array
    = () => new Int16Array(SEGMENTS * SEGMENTS);
  public setBiomeGenerator(hash: string, func: (heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array) => Int16Array) {
    if (this.biomeGeneratorHash === hash) return;
    this.biomeGeneratorHash = hash;
    this.biomeGenerator = func;
    this.rebuildBiome();
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

  // Sunshine Map image consumer
  private sunshineMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Sunshine map image consumer function called before it was defined!")
  };

  public setSunshineMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.sunshineMapImageConsumer = func;
  }

  // Temperature Map image consumer
  private temperatureMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Temperature map image consumer function called before it was defined!")
  };

  public setTemperatureMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.temperatureMapImageConsumer = func;
  }

  // Humidity Map image consumer
  private humidityMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Humidity map image consumer function called before it was defined!")
  };

  public setHumidityMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.humidityMapImageConsumer = func;
  }




  // Time tracking
  private times: { [key: string]: number } = {
    height: 0,
    sunshine: 0,
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
  private processedHeightMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private waterMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private sunshineMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private humidityMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private temperatureMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS);
  private biomeMap: Int16Array = new Int16Array(SEGMENTS * SEGMENTS);
  private colorMap: Float32Array = new Float32Array(SEGMENTS * SEGMENTS * 3);


  // Update right sidebar
  public updateRightSidebar() {
    if (this.heightMapImageConsumer) {
      const image = this.generateHeightMapImage(this.processedHeightMap);
      this.heightMapImageConsumer(image);
    }
    if (this.sunshineMapImageConsumer) {
      const image = this.generateSunshineMapImage(this.sunshineMap);
      this.sunshineMapImageConsumer(image);
    }
    if (this.temperatureMapImageConsumer) {
      const image = this.generateTemperatureMapImage(this.temperatureMap);
      this.temperatureMapImageConsumer(image);
    }
    if (this.humidityMapImageConsumer) {
      const image = this.generateHumidityMapImage(this.humidityMap);
      this.humidityMapImageConsumer(image);
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


  // Rebuild Terrain functions

  private rebuildHeight = () => {
    console.log(" [1A] Generating raw height map")
    const startTime = performance.now();
    this.rawHeightMap = this.rawHeightGenerator();
    const endTime = performance.now();
    this.heightMapConsumer(this.rawHeightMap);
    this.updateTime('height', endTime - startTime);
    this.rebuildHeightPostProcessing();
  }

  private rebuildSunshine = () => {
    console.log(" [1B] Generating sunshine map")
    const startTime = performance.now();
    this.sunshineMap = this.sunshineGenerator();
    const endTime = performance.now();
    this.updateTime('sunshine', endTime - startTime);

    // Generate sunshine map image and trigger consumer if present
    if (this.sunshineMapImageConsumer) {
      const image = this.generateSunshineMapImage(this.sunshineMap);
      this.sunshineMapImageConsumer(image);
    }

    this.rebuildTemperature();
  }

  private rebuildHeightPostProcessing = () => {
    console.log(" [2] Post processing height map")
    const startTime = performance.now();
    this.processedHeightMap = this.heightPostProcessing(this.rawHeightMap);
    const endTime = performance.now();
    this.heightMapConsumer(this.processedHeightMap);
    this.updateTime('postProcessing', endTime - startTime);

    // Generate processed height map image and trigger consumer if present
    if (this.heightMapImageConsumer) {
      const image = this.generateHeightMapImage(this.processedHeightMap);
      this.heightMapImageConsumer(image);
    }
    
    this.rebuildWater();
    //this.rebuildVegetation();
  }

  private rebuildWater = () => {
    console.log(" [3] Filling water")
    const startTime = performance.now();
    this.waterMap = this.waterGenerator(this.processedHeightMap);
    const endTime = performance.now();
    this.waterMapConsumer(this.waterMap);
    this.updateTime('water', endTime - startTime);
    
    // Generate water map image and trigger consumer if present
    if (this.waterMapImageConsumer) {
      const image = this.generateWaterMapImage(this.waterMap);
      this.waterMapImageConsumer(image);
    }

    this.rebuildHumidity();
  }
  
    private rebuildHumidity() {
      console.log(" [4] Generating humidity map")
      const startTime = performance.now();
      this.humidityMap = this.humidityGenerator(this.processedHeightMap, this.waterMap);
      const endTime = performance.now();
      this.updateTime('humidity', endTime - startTime);
      
      // Generate humidity map image and trigger consumer if present
      if (this.humidityMapImageConsumer) {
        const image = this.generateHumidityMapImage(this.humidityMap);
        this.humidityMapImageConsumer(image);
      }
  
      this.rebuildTemperature();
    }
  
  private rebuildTemperature = () => {
    console.log(" [5] Generating temperature map")
    const startTime = performance.now();
    this.temperatureMap = this.temperatureGenerator(this.processedHeightMap, this.sunshineMap);
    const endTime = performance.now();
    this.updateTime('temperature', endTime - startTime);
    
    // Generate temperature map image and trigger consumer if present
    if (this.temperatureMapImageConsumer) {
      const image = this.generateTemperatureMapImage(this.temperatureMap);
      this.temperatureMapImageConsumer(image);
    }

    this.rebuildBiome();
  }

  private rebuildBiome = () => {
    console.log(" [6] Generating biome map")
    const startTime = performance.now();
    this.biomeMap = this.biomeGenerator(this.rawHeightMap, this.humidityMap, this.temperatureMap);
    const endTime = performance.now();
    this.updateTime('biome', endTime - startTime);

    // Generate biome map image and trigger consumer if present
    if (this.biomeMapImageConsumer) {
      const image = this.generateBiomeMapImage(this.biomeMap);
      this.biomeMapImageConsumer(image);
    }

    this.rebuildColor();
  }

  
  private rebuildColor = () => {
    console.log(" [7] Coloring map")
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
  
  
}