'use strict';

import { PermutationTable } from "../../util/PermutationTable";

export function vectorTectonics(segments: number, x: number, y: number, scaleH: number, scaleV: number, seed: number, centersPerSegment: number = 0.05, radius: number = 50) {
  const data = new Float32Array(segments * segments);

  console.log(">> Starting vector tectonics calculation");
  const startTime = performance.now();
  const vectors = voronoiVectorMap(seed, segments, x, y, scaleH, scaleV, centersPerSegment);
  const endTime = performance.now();
  console.log(endTime - startTime + " ms")
  console.log(">> Vector map generated");

  const vectorMapImage = generateVectorMapImage(vectors);  
  vectorMapImage.style.maxWidth = '196px';
    vectorMapImage.style.maxHeight = '196px';
    if (document.getElementById('vector-map-image')) {
      document.getElementById('vector-map-image')!.innerHTML = "";
      document.getElementById('vector-map-image')!.appendChild(vectorMapImage);
    }
  
  for (let i = 0; i < segments; i++) {

    for (let j = 0; j < segments; j++) {

      let sumXP = 0;
      let sumYP = 0;
      let sumXN = 0;
      let sumYN = 0;
      
      for (let k = 0; k < radius; k++) {
        for (let l = 0; l < radius; l++) {
          const ix = j + x * segments + l;
          const iy = i + y * segments + k;
          const vx = vectors[(ix * segments + iy) * 2];
          const vy = vectors[(ix * segments + iy) * 2 + 1];
          if (k > 0) sumXP += vx;
          if (k < 0) sumXN += vx;
          if (l > 0) sumYP += vy;
          if (l < 0) sumYN += vy;
        }
      }

      const resultX = (sumXP - sumXN) * scaleV;
      const resultY = (sumYP - sumYN) * scaleV;
      const result = Math.sqrt(resultX * resultX + resultY * resultY);
      data[(i * segments + j)] = result;
    }
  }

  console.log(">> Tectonics calculated");
  
  return data;
}

export const generateVectorMapImage = (vectorMap: Float32Array): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const size = Math.sqrt(vectorMap.length/2);
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  let max = 0;
  vectorMap.forEach((x) => {
    if (x>max) max = x;
  })

  // Normalize height values to 0-255 range
  for (let i = 0; i < vectorMap.length/2; i++) {
    const x = vectorMap[2*i] / max;
    const y = vectorMap[2*i+1] / max;
    const pixelIndex = i * 4;
    data[pixelIndex] = x * 127.5 + 127.5;     // Red
    data[pixelIndex + 1] = y * 127.5 + 127.5; // Green
    data[pixelIndex + 2] = 0;                 // Blue
    // data[pixelIndex] = 0;     // Red
    // data[pixelIndex + 1] = x * 255; // Green
    // data[pixelIndex + 2] = -x * 255;                 
    data[pixelIndex + 3] = 255;               // Alpha
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function voronoiVectorMap(seed: number, segments: number, x: number, y: number, scaleH: number = 1, scaleV: number = 0.01, centersPerSegment: number = 0.05): Float32Array {
  // const scaledSegments = segments * scaleH;
  const centerCache = new Map<string, number[][]>();
  
  // Function to get or generate centers for a grid cell
  const getCenters = (cx: number, cy: number) => {
    const key = `${cx},${cy}`;
    if (!centerCache.has(key)) {
      centerCache.set(key, genCenters(seed, segments, cx, cy, centersPerSegment / scaleH));
    }
    return centerCache.get(key)!;
  };

  // Get centers for all relevant grid cells (3x3 grid around the current cell)
  const centers: number[][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      centers.push(...getCenters(x + dx, y + dy));
    }
  }

  console.log(">> Centers generated");
  
  // Create a spatial hash for faster lookup
  const gridSize = Math.max(10, Math.floor(Math.sqrt(centers.length) / 4));
  const spatialHash: Record<string, number[][]> = {};
  
  centers.forEach(center => {
    const gx = Math.floor(center[0] / gridSize);
    const gy = Math.floor(center[1] / gridSize);
    const key = `${gx},${gy}`;
    if (!spatialHash[key]) spatialHash[key] = [];
    spatialHash[key].push(center);
  });

  const data = new Float32Array(segments * segments * 8);
  
  const startTime2 = performance.now();
  
  for (let i = 0; i < segments * 2; i++) {
    for (let j = 0; j < segments * 2; j++) {
      const ix = j + (x - 0.5) * segments;
      const iy = i + (y - 0.5) * segments;
      
      // Find the grid cell for this point
      const gx = Math.floor(ix / gridSize);
      const gy = Math.floor(iy / gridSize);
      
      let nearestDistance = Infinity;
      const nearestVector = [0, 0];
      
      // Only check centers in nearby grid cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = `${gx + dx},${gy + dy}`;
          if (!spatialHash[key]) continue;
          
          for (const c of spatialHash[key]) {
            const dx = ix - c[0];
            const dy = iy - c[1];
            const distance = dx * dx + dy * dy; // Avoid sqrt until necessary
            
            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestVector[0] = c[2];
              nearestVector[1] = c[3];
            }
          }
        }
      }
      
      const idx = (i * segments * 2 + j) * 2;
      data[idx] = nearestVector[0] * scaleV;
      data[idx + 1] = nearestVector[1] * scaleV;
    }
  }
  
  console.log(performance.now() - startTime2 + " ms");
  console.log("Vectors for centers calculated");
  
  return data;
}

function genCenters(seed: number, segments: number, x: number, y: number, centersPerSegment: number): number[][] {
  const pt = new PermutationTable(seed, segments);
  const amountCenters = Math.round((pt.l(pt.l(Math.round(x)) + pt.l(Math.round(y)) % segments)*centersPerSegment + segments*centersPerSegment);

  const centers: number[][] = new Array<number[]>(amountCenters);

  for (let i = 0; i < amountCenters; i++) {
    centers[i] = new Array<number>(4);
    let last = pt.l(i + pt.l(x + pt.l(y)));
    for (let j = 0; j < 4; j++) {
      last = pt.l(last);
      centers[i][j] = last;
    }
    centers[i][0] += x * segments;
    centers[i][1] += y * segments;
  }

  return centers;
}

function genCenter(x: number, y: number, seed: number, segments: number): number[] {
  const pt = new PermutationTable(seed, segments);
  const result = new Array<number>(4);
  let last = pt.l(x + pt.l(y));
  for (let j = 0; j < 4; j++) {
    last = pt.l(last);
    result[j] = last;
  }
  result[0] += x * segments;
  result[1] += y * segments;
  return result;
} 

export function perlinVectorMap(seed: number, segments: number, x: number, y: number, scaleH: number = 1, scaleV: number = 0.01, rawScaleV: number = 1, rawShift: number = 0 ,exponent: number = 1, octaves: number = 3, lacunarity: number = 2, persistence: number = 0.5, lacunarityScale: number = 1, persistenceScale: number = 1): Float32Array {

  const data = new Float32Array(segments * segments * 8); // grid with (segments*2)^2 vectors and 2 values per vector
  
  
  for (let i = 0; i < segments*2; i++) {
    for (let j = 0; j < segments*2; j++) {
      const ix = j + (x-0.5) * segments;
      const iy = i + (y-0.5) * segments;
      const v = vectorOctave(ix / scaleH, iy / scaleH, seed, segments, octaves, lacunarity, persistence, lacunarityScale, persistenceScale, rawScaleV, rawShift, exponent);
      data[(i * segments * 2 + j) * 2] = v[0] * scaleV;
      data[(i * segments * 2 + j) * 2 + 1] = v[1] * scaleV;
    }
  }
  
  return data;
}

function vectorOctave(x: number, y: number, seed: number, segments: number, octaves: number, lacunarity: number, persistence: number, lacunarityScale: number, persistenceScale: number, rawScaleV: number, rawShift: number, exponent: number) {

  let frequency: number = 1;
  let amplitude: number = 1;
  let sumX: number = 0;
  let sumY: number = 0;

  // Iterate through each octave and sum their results together
  // Each octave frequency and persistance grow/shrink exponentially
  for (let i = 0; i <= octaves; i++) {
    const raw: number[] = vector(x * frequency, y * frequency, seed, segments);
    sumX += (((raw[0]+1) * rawScaleV + rawShift) ** exponent) * amplitude;
    sumY += (((raw[1]+1) * rawScaleV + rawShift) ** exponent) * amplitude;
    frequency *= lacunarity * (lacunarityScale ** i);
    amplitude *= persistence * (persistenceScale ** i);
  }

  return [sumX, sumY];
}


// const ptables: Map<number, number[]> = new Map();

// // returns value between -1 and 1
// export function vector(x: number, y: number, seed: number, segments: number) {

//     // get permutation table
//     const ptable = genPtable(seed, segments);

//     // grid coordinates
//     const xi: number = Math.floor(x);
//     const yi: number = Math.floor(y);
  
//     // distance vector coordinates
//     const xg: number = x - xi;
//     const yg: number = y - yi;
  
//     // calculate the gradients to the 4 closest grid points
//     const nx00: number = gradient(ptl(ptl(xi, ptable) + yi, ptable), xg, yg);
//     const nx01: number = gradient(ptl(ptl(xi, ptable) + yi + 1, ptable), xg, yg - 1);
//     const nx11: number = gradient(ptl(ptl((xi + 1), ptable) + yi + 1, ptable), xg - 1, yg - 1);
//     const nx10: number = gradient(ptl(ptl((xi + 1), ptable) + yi, ptable), xg - 1, yg);

//     const ny00: number = gradient(ptl(ptl(ptl(xi, ptable) + yi, ptable), ptable), xg, yg);
//     const ny01: number = gradient(ptl(ptl(ptl(xi, ptable) + yi + 1, ptable), ptable), xg, yg - 1);
//     const ny11: number = gradient(ptl(ptl(ptl((xi + 1), ptable) + yi + 1, ptable), ptable), xg - 1, yg - 1);
//     const ny10: number = gradient(ptl(ptl(ptl((xi + 1), ptable) + yi, ptable), ptable), xg - 1, yg);

//     // apply fade function to distance coordinates
//     const xf: number = fade(xg);
//     const yf: number = fade(yg);

//     // apply linear interpolation between the 4 gradients by the faded distances
//     const xx1: number = lerp(nx00, nx10, xf);
//     const xx2: number = lerp(nx01, nx11, xf);

//     const xy1: number = lerp(ny00, ny10, xf);
//     const xy2: number = lerp(ny01, ny11, xf);

//     const vx: number = lerp(xx1, xx2, yf);
//     const vy: number = lerp(xy1, xy2, yf);

//     return [vx, vy];
// }
  
// // linear interpolation
// function lerp(a: number, b: number, x: number): number {
//     return a + x * (b - a);
// }
  
// // smoothing function
// // only to be used for numbers between 0 and 1
// function fade(f: number): number {
//     return 6 * f ** 5 - 15 * f ** 4 + 10 * f ** 3;
// }
  
// // calculate the gradient vectors and dot product
// function gradient(c: number, x: number, y: number): number {
//   const vectors: number[][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
//   const gradient_co: number[] = vectors[c % 4];
//   return gradient_co[0] * x + gradient_co[1] * y;
// }