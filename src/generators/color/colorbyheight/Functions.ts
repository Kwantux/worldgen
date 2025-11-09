'use strict';

export function colorByHeight(heightMap: Float32Array): Float32Array {
  const data = new Float32Array(heightMap.length * 3);
  // const max = Math.max(...heightMap);
  // const min = Math.min(...heightMap);
  const min = 0;
  const max = 100;

  for (let i = 0; i < heightMap.length; i++) {
    // Get the height as a value between 0 and 1
    const h = (heightMap[i]-min)/max;

    data[i * 3] = h;
    data[i * 3 + 1] = 1;
    data[i * 3 + 2] = fade(h);
  }
  return data;
}

// smoothing function
// only to be used for numbers between 0 and 1
function fade(f: number): number {
    return 6 * f ** 5 - 15 * f ** 4 + 10 * f ** 3;
}