'use strict';

import { PermutationTable } from "../../../util/PermutationTable";

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

  const vectorAt = (x: number, y: number) => {
    const ix1 = Math.floor(x);
    const iy1 = Math.floor(y);
    const ix2 = Math.floor(ix1 / 2);
    const iy2 = Math.floor(iy1 / 2);
    const vx1 = vectors[(ix1 * segments + iy1) * 2];
    const vy1 = vectors[(ix1 * segments + iy1) * 2 + 1];
    const vx2 = vectors[(ix2 * segments + iy2) * 2];
    const vy2 = vectors[(ix2 * segments + iy2) * 2 + 1];

    // console.log(vx1, vy1, vx2, vy2);
    return [vx1 + vx2*2, vy1 + vy2*2];
    return [vx1, vy1];
  }
  
  for (let i = 0; i < segments; i++) {

    for (let j = 0; j < segments; j++) {

      let sumXP = 0;
      let sumYP = 0;
      let sumXN = 0;
      let sumYN = 0;
      
      for (let k = 0; k < radius; k++) {
        for (let l = 0; l < radius; l++) {
          const [vx, vy] = vectorAt(j + x * segments + l, i + y * segments + k);
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
  const amountCenters = Math.round((pt.l(pt.l(Math.round(x)) + pt.l(Math.round(y)) % segments)*centersPerSegment + segments*centersPerSegment));

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