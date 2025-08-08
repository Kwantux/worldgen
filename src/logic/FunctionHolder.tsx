import { SEGMENTS } from "../components/terrain/Terrain";
import { Tile } from "./Tile";

export class FunctionHolder {
  // Settings
  private segments = 512;
  private tileUpdateCallbacks: Set<() => void> = new Set();
  private updateCallbacks: Set<() => void> = new Set();

  public setSegments(segments: number): void {
    this.segments = segments;
    this.tiles.forEach(tile => tile.setSegments(segments));
  }

  public getSegments(): number {
    return this.segments;
  }

  // Tile Management
  public tiles: Map<[number, number], Tile> = new Map();

  public addTileUpdateCallback(callback: () => void): void {
    this.tileUpdateCallbacks.add(callback);
  }

  public removeTileUpdateCallback(callback: () => void): void {
    this.tileUpdateCallbacks.delete(callback);
  }

  private notifyTileUpdate(): void {
    console.log("Notifying tile update");
    this.tileUpdateCallbacks.forEach(callback => callback());
    this.updateCallbacks.forEach(callback => callback());
  }

  public forceUpdate(): void {
    this.updateCallbacks.forEach(callback => callback());
  }

  public addUpdateCallback(callback: () => void): void {
    this.updateCallbacks.add(callback);
  }

  public removeUpdateCallback(callback: () => void): void {
    this.updateCallbacks.delete(callback);
  }

  public addTile(position: [number, number], scale_h: number, scale_v: number): void {
    const tile = new Tile(position[0], position[1], scale_h, scale_v, this.segments,
      this.heightPointFunction,
      this.fractalHeightMapGenerator,
      this.heightPostProcessing,
      this.waterGenerator,
      this.sunshineGenerator,
      this.humidityGenerator,
      this.temperatureGenerator,
      this.biomeGenerator,
      this.colorGenerator
    );

    // Add tile to Map
    this.tiles.set(position, tile);

    // Set image consumers
    if (position[0] === 0 && position[1] === 0) {
      console.log("[FH] Setting image consumers");
      tile.setBiomeMapImageConsumer(this.biomeMapImageConsumer);
      tile.setColorMapImageConsumer(this.colorMapImageConsumer);
      tile.setWaterMapImageConsumer(this.waterMapImageConsumer);
      tile.setSunshineMapImageConsumer(this.sunshineMapImageConsumer);
      tile.setTemperatureMapImageConsumer(this.temperatureMapImageConsumer);
      tile.setHumidityMapImageConsumer(this.humidityMapImageConsumer);
      tile.setHeightMapImageConsumer(this.heightMapImageConsumer);
    }

    tile.rebuild();

    // Notify about tile update
    this.notifyTileUpdate();
  }

  public getTiles(): Map<[number, number], Tile> {
    return this.tiles;
  }

  public getTile(x: number, y: number): Tile | undefined {
    return this.tiles.get([x, y]);
  }

  public generateTiles(radius: number): void {
    this.tiles.clear();
    for (let i = Math.ceil(-radius/2); i < Math.ceil(radius/2); i++) {
      for (let j = Math.ceil(-radius/2); j < Math.ceil(radius/2); j++) {
        console.log("Generating tile [" + i + ", " + j + "]");     
        this.addTile([i, j], 1, 1);
      }
    }
    console.log("Generated " + this.tiles.size + " tiles");
    this.notifyTileUpdate();
  } // Function hashes
  private heightPointFunctionHash = "";
  private fractalHeightMapGeneratorHash = "";
  private heightPostProcessingHash = "";
  private waterGeneratorHash = "";
  private sunshineGeneratorHash = "";
  private humidityGeneratorHash = "";
  private temperatureGeneratorHash = "";
  private biomeGeneratorHash = "";
  private colorGeneratorHash = "";


  // Height point function
  private heightPointFunction: (x: number, y: number) => number
    = () => 0;
  public setHeightPointFunction(hash: string, func: (x: number, y: number) => number) {
    if (this.heightPointFunctionHash === hash) return;
    this.heightPointFunctionHash = hash;
    this.heightPointFunction = func;
    this.tiles.forEach(tile => tile.setHeightPointFunction(func));
  }
  
    // Fractal height map generator
  private fractalHeightMapGenerator: (heightPointFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scale_h: number, scale_v: number) => Float32Array 
    = () => new Float32Array(SEGMENTS * SEGMENTS);
  public setFractalHeightMapGenerator(hash: string, func: (heightPointFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scale_h: number, scale_v: number) => Float32Array) {
    if (this.fractalHeightMapGeneratorHash === hash) return;
    this.fractalHeightMapGeneratorHash = hash;
    this.fractalHeightMapGenerator = func;
    this.tiles.forEach(tile => tile.setFractalHeightMapGenerator(func));
  }

  // Post processing
  private heightPostProcessing: (heightMap: Float32Array) => Float32Array
  = (heightMap: Float32Array) => heightMap;
  public setHeightPostProcessing(hash: string, func: (heightMap: Float32Array) => Float32Array) {
    if (this.heightPostProcessingHash === hash) return;
    this.heightPostProcessingHash = hash;
    this.heightPostProcessing = func;
    this.tiles.forEach(tile => tile.setHeightPostProcessing(func));
  }
  
  // Sunshine map generator
  private sunshineGenerator: (segments: number, x: number, y: number) => Float32Array 
  = () => new Float32Array(SEGMENTS * SEGMENTS);
  public setSunshineGenerator(hash: string, func: (segments: number, x: number, y: number) => Float32Array) {
    if (this.sunshineGeneratorHash === hash) return;
    this.sunshineGeneratorHash = hash;
    this.sunshineGenerator = func;
    this.tiles.forEach(tile => tile.setSunshineGenerator(func));
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
    this.tiles.forEach(tile => tile.setWaterGenerator(func)); 
  }

  // Humidity generator
  private humidityGenerator: (heightMap: Float32Array, waterMap: Float32Array, segments: number, x: number, y: number) => Float32Array
  = () => {
    return new Float32Array(SEGMENTS * SEGMENTS);
  };
  public setHumidityGenerator(hash: string, func: (heightMap: Float32Array, waterMap: Float32Array, segments: number, x: number, y: number) => Float32Array) {
    if (this.humidityGeneratorHash === hash) return;
    this.humidityGeneratorHash = hash;
    this.humidityGenerator = func;
    this.tiles.forEach(tile => tile.setHumidityGenerator(func));
  }

  // Temperature generator
  private temperatureGenerator: (heightMap: Float32Array, waterMap: Float32Array, segments: number, x: number, y: number) => Float32Array
  = () => {
    return new Float32Array(SEGMENTS * SEGMENTS);
  };
  public setTemperatureGenerator(hash: string, func: (heightMap: Float32Array, waterMap: Float32Array, segments: number, x: number, y: number) => Float32Array) {
    if (this.temperatureGeneratorHash === hash) return;
    this.temperatureGeneratorHash = hash;
    this.temperatureGenerator = func;
    this.tiles.forEach(tile => tile.setTemperatureGenerator(func));
  }

  // Biome generator
  private biomeGenerator: (heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array) => Int16Array
    = () => new Int16Array(SEGMENTS * SEGMENTS);
  public setBiomeGenerator(hash: string, func: (heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array) => Int16Array) {
    if (this.biomeGeneratorHash === hash) return;
    this.biomeGeneratorHash = hash;
    this.biomeGenerator = func;
    this.tiles.forEach(tile => tile.setBiomeGenerator(func));
  }

  // Color generator
  private colorGenerator: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array
    = () => new Float32Array(SEGMENTS * SEGMENTS * 3);
  public setColorGenerator(hash: string, func: (heightMap: Float32Array, biomeMap: Int16Array) => Float32Array) {
    if (this.colorGeneratorHash === hash) return;
    this.colorGeneratorHash = hash;
    this.colorGenerator = func;
    this.tiles.forEach(tile => tile.setColorGenerator(func));
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

  // Color Map image consumer
  private colorMapImageConsumer: (image: HTMLCanvasElement) => void = () => {
    console.warn("Color map image consumer function called before it was defined!")
  };

  public setColorMapImageConsumer(func: (image: HTMLCanvasElement) => void) {
    this.colorMapImageConsumer = func;
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


  //
  // Proxy to tile [0, 0]
  //

  public getTimes() {
    return this.tiles.get([0, 0])?.getTimes() || {height: 0, sunshine: 0, biome: 0, postProcessing: 0, color: 0, water: 0, humidity: 0, temperature: 0};
  }

  public setTimeUpdateCallback(callback: (times: { [key: string]: number }) => void) {
    this.tiles.get([0, 0])?.setTimeUpdateCallback(callback);
  }

  public updateRightSidebar() {
    this.tiles.get([0, 0])?.updateRightSidebar();
  }
}