'use strict';
import Rand from "rand-seed";

export function perlinMap(size: number, seed: number = 0, scaleH: number = 1, scaleV: number = 1, exponent: number = 1, octaves: number = 3, lacunarity: number = 2, persistence: number = 0.5): Float32Array {
  const data = new Float32Array(size * size);
  
  // create a permutation table based on the number of pixels
  // seed is the initial value we want to start with
  // we also use the seed function to get the same set of numbers
  // this helps to keep our Perlin graph smooth
  // shuffle our numbers in the table  
  // create a 2D array and then flatten it
  // so that we can apply our dot product interpolations easily
  const ptable = genPtable(seed);
  console.log(ptable);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      data[x * size + y] = ( octave(x / scaleH, y / scaleH, ptable, octaves, lacunarity, persistence, exponent)) * scaleV;
    }
  }
  return data;
}

function octave(x: number, y: number, ptable: number[], octaves: number, lacunarity: number, persistence: number, exponent: number) {
  // apply the octaves and lacunarity
  let sum: number = 0;
  let frequency: number = 1;
  let amplitude: number = 1;

  for (let i = 0; i < octaves; i++) {
    sum += (perlin(x * frequency, y * frequency, ptable)) * amplitude;
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
  
    // if (ptable[ptable[xi] + yi] === undefined) {
    //   console.log(xi, ptable[xi] + yi);
    // }
    // if (ptable[ptable[xi] + yi + 1] === undefined) {
    //   console.log(xi, ptable[xi] + yi + 1);
    // }
    // if (ptable[ptable[xi + 1] + yi + 1] === undefined) {
    //   console.log(xi, ptable[xi + 1] + yi + 1);
    // }
    // if (ptable[ptable[xi + 1] + yi] === undefined) {
    //   console.log(xi, ptable[xi + 1] + yi);
    // }
    //console.log(ptable[xi] + yi, ptable[xi] + yi + 1, ptable[xi + 1] + yi + 1, ptable[xi + 1] + yi);         

    // the gradient vector coordinates in the top left, top right, bottom left, bottom right
    // const n00: number = gradient(ptable[(ptable[xi % 256] + yi) % 512], xg, yg);
    // const n01: number = gradient(ptable[(ptable[xi % 256] + yi + 1) % 512], xg, yg - 1);
    // const n11: number = gradient(ptable[(ptable[(xi + 1) % 256] + yi + 1) % 512], xg - 1, yg - 1);
    // const n10: number = gradient(ptable[(ptable[(xi + 1) % 256] + yi) % 512], xg - 1, yg);
  
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

function genPtable(seed: number) {
  const random = new Rand(seed.toString());
  const array = Array.from({ length: 512 }, (_, i) => i).sort(() => random.next() - 0.5);
  return array//[].concat(...array.map(val => [val, val]));
}
