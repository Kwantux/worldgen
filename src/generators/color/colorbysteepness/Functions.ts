'use strict';

export function colorBySteepness(steepnessMap: Float32Array): Float32Array {
  const data = new Float32Array(steepnessMap.length * 3);
  
  // Steepness values are typically between 0 and 1
  for (let i = 0; i < steepnessMap.length; i++) {
    // Get the steepness value (0-1)
    const steepness = Math.min(1, Math.max(0, steepnessMap[i]));
    
    // Map steepness to a color gradient from green (flat) to red (steep)
    // Using HSL color space for smooth transitions
    // Hue: 120 (green) to 0 (red)
    // Saturation: 70% to 90%
    // Lightness: 40% to 50%
    const hue = 120 * (1 - steepness); // Green (120) to Red (0)
    const saturation = 70 + 20 * steepness; // More saturated as steepness increases
    const lightness = 50 - 10 * steepness; // Slightly darker for steeper areas
    
    // Convert HSL to RGB
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    
    // Store RGB values (0-1 range)
    data[i * 3] = r / 255;
    data[i * 3 + 1] = g / 255;
    data[i * 3 + 2] = b / 255;
  }
  return data;
}

// Helper function to convert HSL to RGB
// Input: h in [0, 360], s in [0, 100], l in [0, 100]
// Output: r, g, b in [0, 255]
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
