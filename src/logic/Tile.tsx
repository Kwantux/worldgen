import { generateBiomeMapImage, generateColorMapImage, generateHeightMapImage, generateHumidityMapImage, generateSunshineMapImage, generateTemperatureMapImage, generateWaterMapImage } from "../util/ArrayToImage";

export class Tile {

  // Tile logic

  private x: number;
  private y: number;
  private scale_h: number;
  private scale_v: number;
  private segments: number;

  constructor(x: number, y: number, scale_h: number, scale_v: number, segments: number,
    heightPointFunction: (x: number, y: number) => number,
    fractalHeightMapGenerator: (heightPointFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scale_h: number, scale_v: number) => Float32Array,
    heightPostProcessing: (heightMap: Float32Array, segments: number) => Float32Array,
    waterGenerator: (heightMap: Float32Array) => Float32Array,
    sunshineGenerator: () => Float32Array,
    humidityGenerator: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array,
    temperatureGenerator: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array,
    biomeGenerator: (heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array) => Int16Array,
    colorGenerator: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array
  ) {
    this.x = x;
    this.y = y;
    this.scale_h = scale_h;
    this.scale_v = scale_v;
    this.segments = segments;

    this.heightPointFunction = heightPointFunction;
    this.fractalHeightMapGenerator = fractalHeightMapGenerator;
    this.heightPostProcessing = heightPostProcessing;
    this.waterGenerator = waterGenerator;
    this.sunshineGenerator = sunshineGenerator;
    this.humidityGenerator = humidityGenerator;
    this.temperatureGenerator = temperatureGenerator;
    this.biomeGenerator = biomeGenerator;
    this.colorGenerator = colorGenerator;
    
    // dummy values

    this.rawHeightMap = new Float32Array(this.segments * this.segments);
    this.processedHeightMap = new Float32Array(this.segments * this.segments);
    this.waterMap = new Float32Array(this.segments * this.segments);
    this.sunshineMap = new Float32Array(this.segments * this.segments);
    this.humidityMap = new Float32Array(this.segments * this.segments);
    this.temperatureMap = new Float32Array(this.segments * this.segments);
    this.biomeMap = new Int16Array(this.segments * this.segments);
    this.colorMap = new Float32Array(this.segments * this.segments * 3);

    this.rebuild();
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }
  
  public getSegments() {
    return this.segments;
  }
  
  public getScaleH() {
    return this.scale_h;
  }

  public getScaleV() {
    return this.scale_v;
  }

  public getMeshSize() {
    return this.scale_h * this.segments;
  }

  public setSegments(segments: number) {
    this.segments = segments;
    this.rebuild();
  }


  // Height point function
  private heightPointFunction: (x: number, y: number) => number;
  public setHeightPointFunction(func: (x: number, y: number) => number) {
    this.heightPointFunction = func;
    this.rebuildHeight();
  }
  
    // Fractal height map generator
  private fractalHeightMapGenerator: (heightPointFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scale_h: number, scale_v: number) => Float32Array;
  public setFractalHeightMapGenerator(func: (heightPointFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scale_h: number, scale_v: number) => Float32Array) {
    this.fractalHeightMapGenerator = func;
    this.rebuildHeight();
  }

  // Post processing
  private heightPostProcessing: (heightMap: Float32Array, segments: number) => Float32Array
  = (heightMap: Float32Array) => heightMap;
  public setHeightPostProcessing(func: (heightMap: Float32Array, segments: number) => Float32Array) {
    this.heightPostProcessing = func;
    this.rebuildHeightPostProcessing();
  }
  
  // Sunshine map generator
  private sunshineGenerator: () => Float32Array;
  public setSunshineGenerator(func: () => Float32Array) {
    this.sunshineGenerator = func;
    this.rebuildSunshine();
  }
  
  // Water generator
  private waterGenerator: (heightMap: Float32Array) => Float32Array;
  public setWaterGenerator(func: (heightMap: Float32Array) => Float32Array) {
    this.waterGenerator = func;
    this.rebuildWater()
  }

  // Humidity generator
  private humidityGenerator: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array;
  public setHumidityGenerator(func: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array) {
    this.humidityGenerator = func;
    this.rebuildHumidity()
  }

  // Temperature generator
  private temperatureGenerator: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array;
  public setTemperatureGenerator(func: (heightMap: Float32Array, waterMap: Float32Array) => Float32Array) {
    this.temperatureGenerator = func;
    this.rebuildTemperature()
  }

  // Biome generator
  private biomeGenerator: (heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array) => Int16Array;
  public setBiomeGenerator(func: (heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array) => Int16Array) {
    this.biomeGenerator = func;
    this.rebuildBiome();
  }

  // Color generator
  private colorGenerator: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array;
  public setColorGenerator(func: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array) {
    this.colorGenerator = func;
    this.rebuildColor();
  }



  // Height Map consumer
  private heightMapConsumer: (heightMap: Float32Array) => void = () => {};

  public setHeightMapConsumer(func: (heightMap: Float32Array) => void) {
    this.heightMapConsumer = func;
    func(this.processedHeightMap);
  }

  // Height Map image consumer
  private heightMapImageConsumer: (image: HTMLCanvasElement) => void = () => {};

  public setHeightMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.heightMapImageConsumer = func;
    func(generateHeightMapImage(this.processedHeightMap));
  }

  // Biome Map image consumer
  private biomeMapImageConsumer: (image: HTMLCanvasElement) => void = () => {};

  public setBiomeMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.biomeMapImageConsumer = func;
    func(generateBiomeMapImage(this.biomeMap));
  }

  // Color Map consumer
  private colorMapConsumer: (colorMap: Float32Array) => void = () => {};

  public setColorMapConsumer(func: (colorMap: Float32Array) => void) {
    this.colorMapConsumer = func;
    func(this.colorMap);
  }

  // Color Map image consumer
  private colorMapImageConsumer: (image: HTMLCanvasElement) => void = () => {};

  public setColorMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.colorMapImageConsumer = func;
    func(generateColorMapImage(this.colorMap));
  }

  // Water Map consumer
  private waterMapConsumer: (waterMap: Float32Array) => void = () => {};

  public setWaterMapConsumer(func: (waterMap: Float32Array) => void) {
    this.waterMapConsumer = func;
    func(this.waterMap);
  }

  // Water Map image consumer
  private waterMapImageConsumer: (image: HTMLCanvasElement) => void = () => {};

  public setWaterMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.waterMapImageConsumer = func;
    func(generateWaterMapImage(this.waterMap, this.processedHeightMap));
  }

  // Sunshine Map image consumer
  private sunshineMapImageConsumer: (image: HTMLCanvasElement) => void = () => {};

  public setSunshineMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.sunshineMapImageConsumer = func;
    func(generateSunshineMapImage(this.sunshineMap));
  }

  // Temperature Map image consumer
  private temperatureMapImageConsumer: (image: HTMLCanvasElement) => void = () => {};

  public setTemperatureMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.temperatureMapImageConsumer = func;
    func(generateTemperatureMapImage(this.temperatureMap));
  }

  // Humidity Map image consumer
  private humidityMapImageConsumer: (image: HTMLCanvasElement) => void = () => {};

  public setHumidityMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.humidityMapImageConsumer = func;
    func(generateHumidityMapImage(this.humidityMap));
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
  private rawHeightMap: Float32Array;
  private processedHeightMap: Float32Array;
  private waterMap: Float32Array;
  private sunshineMap: Float32Array;
  private humidityMap: Float32Array;
  private temperatureMap: Float32Array;
  private biomeMap: Int16Array;
  private colorMap: Float32Array;


  // Update right sidebar
  public updateRightSidebar() {
    if (this.heightMapImageConsumer) {
      const image = generateHeightMapImage(this.processedHeightMap);
      this.heightMapImageConsumer(image);
    }
    if (this.sunshineMapImageConsumer) {
      const image = generateSunshineMapImage(this.sunshineMap);
      this.sunshineMapImageConsumer(image);
    }
    if (this.temperatureMapImageConsumer) {
      const image = generateTemperatureMapImage(this.temperatureMap);
      this.temperatureMapImageConsumer(image);
    }
    if (this.humidityMapImageConsumer) {
      const image = generateHumidityMapImage(this.humidityMap);
      this.humidityMapImageConsumer(image);
    }
    if (this.biomeMapImageConsumer) {
      const image = generateBiomeMapImage(this.biomeMap);
      this.biomeMapImageConsumer(image);
    }
    if (this.colorMapImageConsumer) {
      const image = generateColorMapImage(this.colorMap);
      this.colorMapImageConsumer(image);
    }
    if (this.waterMapImageConsumer) {
      const image = generateWaterMapImage(this.waterMap, this.processedHeightMap);
      this.waterMapImageConsumer(image);
    }
  }


  // Rebuild Terrain functions

  private rebuild = () => {
    this.rebuildOnlyHeight();
    this.rebuildOnlySunshine();
    this.rebuildOnlyHeightPostProcessing();
    this.rebuildOnlyWater();
    this.rebuildOnlyHumidity();
    this.rebuildOnlyTemperature();
    this.rebuildOnlyBiome();
    this.rebuildOnlyColor();
  }

  private rebuildOnlyHeight = () => {
    console.log(" [1A] Generating raw height map")
    const startTime = performance.now();
    this.rawHeightMap = this.fractalHeightMapGenerator(this.heightPointFunction, this.segments, this.x, this.y, this.scale_h, this.scale_v);
    const endTime = performance.now();
    this.heightMapConsumer(this.rawHeightMap);
    this.updateTime('height', endTime - startTime);
  }

  private rebuildHeight = () => {
    this.rebuildOnlyHeight();
    this.rebuildHeightPostProcessing();
  }

  private rebuildOnlySunshine = () => {
    console.log(" [1B] Generating sunshine map")
    const startTime = performance.now();
    this.sunshineMap = this.sunshineGenerator();
    const endTime = performance.now();
    this.updateTime('sunshine', endTime - startTime);

    // Generate sunshine map image and trigger consumer if present
    if (this.sunshineMapImageConsumer) {
      const image = generateSunshineMapImage(this.sunshineMap);
      this.sunshineMapImageConsumer(image);
    }
  }

  private rebuildSunshine = () => {
    this.rebuildOnlySunshine();
    this.rebuildTemperature();
  }

  private rebuildOnlyHeightPostProcessing = () => {
    console.log(" [2] Post processing height map")
    const startTime = performance.now();
    this.processedHeightMap = this.heightPostProcessing(this.rawHeightMap, this.segments);
    const endTime = performance.now();
    this.heightMapConsumer(this.processedHeightMap);
    this.updateTime('postProcessing', endTime - startTime);

    // Generate processed height map image and trigger consumer if present
    if (this.heightMapImageConsumer) {
      const image = generateHeightMapImage(this.processedHeightMap);
      this.heightMapImageConsumer(image);
    }
  }

  private rebuildHeightPostProcessing = () => {
    this.rebuildOnlyHeightPostProcessing();
    this.rebuildWater();
    //this.rebuildVegetation();
  }

  private rebuildOnlyWater = () => {
    console.log(" [3] Filling water")
    const startTime = performance.now();
    this.waterMap = this.waterGenerator(this.processedHeightMap);
    const endTime = performance.now();
    this.waterMapConsumer(this.waterMap);
    this.updateTime('water', endTime - startTime);
    
    // Generate water map image and trigger consumer if present
    if (this.waterMapImageConsumer) {
      const image = generateWaterMapImage(this.waterMap, this.processedHeightMap);
      this.waterMapImageConsumer(image);
    }
  }

  private rebuildWater = () => {
    this.rebuildOnlyWater();
    this.rebuildHumidity();
  }
  
  private rebuildOnlyHumidity = () => {
    console.log(" [4] Generating humidity map")
    const startTime = performance.now();
    this.humidityMap = this.humidityGenerator(this.processedHeightMap, this.waterMap);
    const endTime = performance.now();
    this.updateTime('humidity', endTime - startTime);
    
    // Generate humidity map image and trigger consumer if present
    if (this.humidityMapImageConsumer) {
      const image = generateHumidityMapImage(this.humidityMap);
      this.humidityMapImageConsumer(image);
    }
  }

  private rebuildHumidity = () => {
    this.rebuildOnlyHumidity();
    this.rebuildTemperature();
  }
  
  private rebuildOnlyTemperature = () => {
    console.log(" [5] Generating temperature map")
    const startTime = performance.now();
    this.temperatureMap = this.temperatureGenerator(this.processedHeightMap, this.sunshineMap);
    const endTime = performance.now();
    this.updateTime('temperature', endTime - startTime);
    
    // Generate temperature map image and trigger consumer if present
    if (this.temperatureMapImageConsumer) {
      const image = generateTemperatureMapImage(this.temperatureMap);
      this.temperatureMapImageConsumer(image);
    }
  }

  private rebuildTemperature = () => {
    this.rebuildOnlyTemperature();
    this.rebuildBiome();
  }

  private rebuildOnlyBiome = () => {
    console.log(" [6] Generating biome map")
    const startTime = performance.now();
    this.biomeMap = this.biomeGenerator(this.rawHeightMap, this.humidityMap, this.temperatureMap);
    const endTime = performance.now();
    this.updateTime('biome', endTime - startTime);

    // Generate biome map image and trigger consumer if present
    if (this.biomeMapImageConsumer) {
      const image = generateBiomeMapImage(this.biomeMap);
      this.biomeMapImageConsumer(image);
    }
  }

  private rebuildBiome = () => {
    this.rebuildOnlyBiome();
    this.rebuildColor();
  }

  private rebuildOnlyColor = () => {
    console.log(" [7] Coloring map")
    const startTime = performance.now();
    this.colorMap = this.colorGenerator(this.processedHeightMap, this.biomeMap);
    const endTime = performance.now();
    this.colorMapConsumer(this.colorMap);
    this.updateTime('color', endTime - startTime);
    
    // Generate color map image and trigger consumer if present
    if (this.colorMapImageConsumer) {
      const image = generateColorMapImage(this.colorMap);
      this.colorMapImageConsumer(image);
    }
  }

  private rebuildColor = () => {
    this.rebuildOnlyColor();
    // this.rebuildVegetation();
  }    
}