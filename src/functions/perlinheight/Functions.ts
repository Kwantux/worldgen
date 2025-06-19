'use strict';
import Rand from "rand-seed";

export function perlinMap(size: number, seed: number = 0, scaleH: number = 1, scaleV: number = 0.01, rawScaleV: number = 1, rawShift: number = 0 ,exponent: number = 1, octaves: number = 3, lacunarity: number = 2, persistence: number = 0.5): Float32Array {
  const data = new Float32Array(size * size);
  
  // create a permutation table
  // seed is the initial value we want to start with
  const ptable = genPtable(seed);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      data[x * size + y] = ( octave(x / scaleH, y / scaleH, ptable, octaves, lacunarity, persistence, rawScaleV, rawShift, exponent)) * scaleV;
    }
  }
  return data;
}

function octave(x: number, y: number, ptable: number[], octaves: number, lacunarity: number, persistence: number, rawScaleV: number, rawShift: number, exponent: number) {

  let sum: number = 0;
  let frequency: number = 1;
  let amplitude: number = 1;

  // Iterate through each octave and sum their results together
  // Each octave frequency and persistance grow/shrink exponentially
  for (let i = 0; i <= octaves; i++) {
    const raw: number = perlin(x * frequency, y * frequency, ptable);
    sum += ((raw * rawScaleV + rawShift) ** exponent) * amplitude;
    frequency *= lacunarity;
    amplitude *= persistence;
  }
  return sum;
}

function perlin(x: number, y: number, ptable: number[]): number {

    // grid coordinates
    const xi: number = Math.floor(x);
    const yi: number = Math.floor(y);
  
    // distance vector coordinates
    const xg: number = x - xi;
    const yg: number = y - yi;
  
    // calculate the gradients to the 4 closest grid points
    const n00: number = gradient(ptable[(ptable[xi % 512] + yi) % 512], xg, yg);
    const n01: number = gradient(ptable[(ptable[xi % 512] + yi + 1) % 512], xg, yg - 1);
    const n11: number = gradient(ptable[(ptable[(xi + 1) % 512] + yi + 1) % 512], xg - 1, yg - 1);
    const n10: number = gradient(ptable[(ptable[(xi + 1) % 512] + yi) % 512], xg - 1, yg);
    
    // apply fade function to distance coordinates
    const xf: number = fade(xg);
    const yf: number = fade(yg);

    // apply linear interpolation between the 4 gradients by the faded distances
    const x1: number = lerp(n00, n10, xf);
    const x2: number = lerp(n01, n11, xf);
    return lerp(x1, x2, yf) + 1;
}
  
// linear interpolation
function lerp(a: number, b: number, x: number): number {
    return a + x * (b - a);
}
  
// smoothing function
// only to be used for numbers between 0 and 1
function fade(f: number): number {
    return 6 * f ** 5 - 15 * f ** 4 + 10 * f ** 3;
}
  
// calculate the gradient vectors and dot product
function gradient(c: number, x: number, y: number): number {
    const vectors: number[][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const gradient_co: number[] = vectors[c % 4];
    return gradient_co[0] * x + gradient_co[1] * y;
}

// generate permutation table
function genPtable(seed: number) {
  const rng = new Rand(seed.toString()); // Seeded random number generator
  const array = Array.from({ length: 512 }, (_, i) => i).sort(() => rng.next() - 0.5); // Shuffle a 0-511 array using the RNG
  return array;
}
