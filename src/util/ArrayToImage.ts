import { BIOME_COLORS } from "../functions/colorbybiome/Functions";

export const generateHeightMapImage = (heightMap: Float32Array): HTMLCanvasElement => {
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

export const generateSunshineMapImage = (sunshineMap: Float32Array): HTMLCanvasElement => {
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

export const generateBiomeMapImage = (biomeMap: Int16Array): HTMLCanvasElement => {
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

export const generateColorMapImage = (colorMap: Float32Array): HTMLCanvasElement => {
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

export const generateWaterMapImage = (waterMap: Float32Array, processedHeightMap: Float32Array): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const size = Math.sqrt(waterMap.length); 
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const max = Math.max(...processedHeightMap);
  const min = Math.min(...processedHeightMap);

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

export const generateHumidityMapImage = (humidityMap: Float32Array): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const size = Math.sqrt(humidityMap.length);
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const max = Math.max(...humidityMap);
  const min = Math.min(...humidityMap);

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

export const generateTemperatureMapImage = (temperatureMap: Float32Array): HTMLCanvasElement => {
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