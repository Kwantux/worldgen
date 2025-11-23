'use strict';

export function colorByTemperature(temperatureMap: Float32Array): Float32Array {
  const data = new Float32Array(temperatureMap.length * 3);
  
  // Temperature ranges (in normalized 0-1)
  const freezingPoint = 0; // 0°C in normalized temperature
  const boilingPoint = 1;  // 100°C in normalized temperature
  
  for (let i = 0; i < temperatureMap.length; i++) {
    const temp = temperatureMap[i]; // 0-1 normalized temperature
    let r, g, b;
    
    if (temp <= freezingPoint) {
      // Below freezing: purple to cyan gradient
      // At temp = 0: deep purple (0.5, 0, 0.5)
      // At temp = 0.5: cyan (0, 1, 1)
      const t = temp / freezingPoint; // 0 to 1
      r = 0.5 * (1 - t);
      g = t;
      b = 0.5 * (1 - t) + t;
    } else {
      // Above freezing: green to red gradient
      // At temp = 0.5: green (0, 1, 0)
      // At temp = 1.0: red (1, 0, 0)
      const t = (temp - freezingPoint) / (1 - freezingPoint); // 0 to 1
      r = t;
      g = 1 - t;
      b = 0;
    }
    
    // Store RGB values (0-1 range)
    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }
  
  return data;
}
