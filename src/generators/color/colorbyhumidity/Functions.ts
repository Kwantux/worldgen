'use strict';

export function colorByHumidity(humidityMap: Float32Array): Float32Array {
  const data = new Float32Array(humidityMap.length * 3);
  
  // Humidity values are typically between 0 and 1
  for (let i = 0; i < humidityMap.length; i++) {
    // Get the humidity value (0-1)
    const h = humidityMap[i];

    data[i * 3] = 1-h;
    data[i * 3 + 1] = 1;
    data[i * 3 + 2] = h;
  }
  return data;
}