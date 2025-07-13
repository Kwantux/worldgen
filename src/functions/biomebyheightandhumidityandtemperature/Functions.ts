import { BIOME_DESERT, BIOME_FOREST, BIOME_ICE, BIOME_JUNGLE, BIOME_MOUNTAIN, BIOME_OCEAN, BIOME_PLAINS, BIOME_TUNDRA } from "../colorbybiome/Functions";

export function biomeByHeightAndHumidityAndTemperature(height: number, humidity: number, temperature: number): number {
  if (temperature < 0.2) {
    return BIOME_ICE;
  }
  if (height > 0.7) {
    return BIOME_MOUNTAIN;
  }
  if (height < 0.2) {
    return BIOME_OCEAN;
  }
  if (temperature < 0.4) {
    if (humidity < 0.2) return BIOME_TUNDRA;
    return BIOME_FOREST;
  }
  if (humidity < 0.2) {
    return BIOME_DESERT;
  }
  if (humidity < 0.5) {
    if (temperature < 0.7) return BIOME_PLAINS;
    return BIOME_DESERT;
  }
  if (humidity < 0.8) {
    return BIOME_FOREST;
  }
  return BIOME_JUNGLE;
}

export function biomeByHeightAndHumidityAndTemperatureMap(heightMap: Float32Array, humidityMap: Float32Array, temperatureMap: Float32Array): Int16Array {
  const data = new Int16Array(humidityMap.length);
  const maxHeight = Math.max(...heightMap);
  const minHeight = Math.min(...heightMap);
  const maxHumidity = Math.max(...humidityMap);
  const minHumidity = Math.min(...humidityMap);
  const maxTemperature = Math.max(...temperatureMap);
  const minTemperature = Math.min(...temperatureMap);

  for (let i = 0; i < humidityMap.length; i++) {
    // Get the height as a value between 0 and 1
    const height = (heightMap[i] - minHeight) / (maxHeight - minHeight);
    const temperature = (temperatureMap[i] - minTemperature) / (maxTemperature - minTemperature);
    const humidity = (humidityMap[i] - minHumidity) / (maxHumidity - minHumidity);
    data[i] = biomeByHeightAndHumidityAndTemperature(height, humidity, temperature);
  }
  return data;
}
