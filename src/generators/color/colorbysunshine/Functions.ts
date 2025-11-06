'use strict';

export function colorBySunshine(sunshineMap: Float32Array): Float32Array {
  const data = new Float32Array(sunshineMap.length * 3);
  
  // Humidity values are typically between 0 and 1
  for (let i = 0; i < sunshineMap.length; i++) {
    // Get the humidity value (0-1)
    const h = sunshineMap[i];

    data[i * 3] = h;
    data[i * 3 + 1] = h;
    data[i * 3 + 2] = 0;
  }
  return data;
}