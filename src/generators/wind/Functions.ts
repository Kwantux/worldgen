export function windByTemperatureAndHeight(heightMap: Float32Array, temperatureMap: Float32Array, windLevel: number): Float32Array {
  const data = new Float32Array(heightMap.length);
  const max = Math.max(...heightMap);
  const min = Math.min(...heightMap);

  for (let i = 0; i < heightMap.length; i++) {
    data[i] = 1-((heightMap[i] - min) / (max - min));
  }
  return data;
}