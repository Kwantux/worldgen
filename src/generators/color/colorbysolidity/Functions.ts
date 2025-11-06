'use strict';

export function colorByGroundSolidity(solidityMap: Float32Array): Float32Array {
  const data = new Float32Array(solidityMap.length * 3);
  
  // Ground solidity values are between 0 and 1
  // 0 = loose material (sand), 0.5 = soil, 1 = solid rock
  for (let i = 0; i < solidityMap.length; i++) {
    const solidity = Math.min(1, Math.max(0, solidityMap[i]));
    
    // Map solidity to a color gradient:
    // 0.0 (sand) -> yellow (255, 255, 0)
    // 0.5 (soil) -> brown (139, 69, 19)
    // 1.0 (rock) -> dark gray (128, 128, 128)
    let r, g, b;
    
    if (solidity < 0.5) {
      // Blend between sand and soil
      const t = solidity * 2; // 0-1 in the first half
      r = 255 * (1 - t) + 139 * t;
      g = 255 * (1 - t) + 69 * t;
      b = 0 * (1 - t) + 19 * t;
    } else {
      // Blend between soil and rock
      const t = (solidity - 0.5) * 2; // 0-1 in the second half
      r = 139 * (1 - t) + 128 * t;
      g = 69 * (1 - t) + 128 * t;
      b = 19 * (1 - t) + 128 * t;
    }
    
    // Store RGB values (0-1 range)
    data[i * 3] = r / 255;
    data[i * 3 + 1] = g / 255;
    data[i * 3 + 2] = b / 255;
  }
  
  return data;
}
