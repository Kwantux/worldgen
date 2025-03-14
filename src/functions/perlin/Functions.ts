'use strict';
import Rand from "rand-seed";

const SIZE = 256;

export function perlinMapFunction(seed: number, scaleH: number, scaleV: number, rawScaleV: number, rawShift: number, exponent: number) {
  return (x: number, y: number, scale: number, octaves: number, lacunarity: number, persistence: number) => { 
    return perlinMap(x, y, seed, scale * scaleH, scale * scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence);
  }
}
export function perlinMap(x_tile: number, y_tile: number, seed: number = 0, scaleH: number = 1, scaleV: number = 0.01, rawScaleV: number = 1, rawShift: number = 0 ,exponent: number = 1, octaves: number = 3, lacunarity: number = 2, persistence: number = 0.5): Float32Array {
  const data = new Float32Array(SIZE * SIZE);
  
  // create a permutation table based on the number of pixels
  // seed is the initial value we want to start with
  // we also use the seed function to get the same set of numbers
  // this helps to keep our Perlin graph smooth
  // shuffle our numbers in the table  
  // create a 2D array and then flatten it
  // so that we can apply our dot product interpolations easily
  const ptable = genPtable(seed);
  console.log(ptable);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      data[x * SIZE + y] = ( octave((x+SIZE*x_tile) / scaleH, (y+SIZE*y_tile) / scaleH, ptable, octaves, lacunarity, persistence, rawScaleV, rawShift, exponent)) * scaleV;
    }
  }
  return data;
}

function octave(x: number, y: number, ptable: number[], octaves: number, lacunarity: number, persistence: number, rawScaleV: number, rawShift: number, exponent: number) {
  // apply the octaves and lacunarity
  let sum: number = 0;
  let frequency: number = 1;
  let amplitude: number = 1;

  for (let i = 0; i < octaves; i++) {
    const v: number = perlin(x * frequency, y * frequency, ptable);
    if (v < 0) console.log(v);
    if (v > 2) console.log(v);
    sum += ((v * rawScaleV + rawShift) ** exponent) * amplitude;
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
  
    // apply fade function to distance coordinates
    const xf: number = fade(xg);
    const yf: number = fade(yg);
  
    const n00: number = gradient(ptable[(ptable[xi % 512] + yi) % 512], xg, yg);
    const n01: number = gradient(ptable[(ptable[xi % 512] + yi + 1) % 512], xg, yg - 1);
    const n11: number = gradient(ptable[(ptable[(xi + 1) % 512] + yi + 1) % 512], xg - 1, yg - 1);
    const n10: number = gradient(ptable[(ptable[(xi + 1) % 512] + yi) % 512], xg - 1, yg);

    // apply linear interpolation i.e. dot product to calculate average
    const x1: number = lerp(n00, n10, xf);
    const x2: number = lerp(n01, n11, xf);
  
    return lerp(x1, x2, yf) + 1;
}
  
function lerp(a: number, b: number, x: number): number {
    // linear interpolation i.e. dot product
    return a + x * (b - a);
}
  
// smoothing function,
// the first derivative and second are both zero for this function
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
  const random = new Rand(seed.toString());
  const array = Array.from({ length: 512 }, (_, i) => i).sort(() => random.next() - 0.5);
  return array;
}
