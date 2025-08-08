'use strict';

import Rand from "rand-seed";

const ptables: Map<number, number[]> = new Map();

// returns value between -1 and 1
export function perlin(x: number, y: number, seed: number, scaleH: number, segments: number): number {

    // get permutation table
    const ptable = genPtable(seed, segments);

    // grid coordinates
    const xi: number = Math.floor(x * scaleH);
    const yi: number = Math.floor(y * scaleH);
  
    // distance vector coordinates
    const xg: number = x * scaleH - xi;
    const yg: number = y * scaleH - yi;
  
    // calculate the gradients to the 4 closest grid points
    const n00: number = gradient(ptl(ptl(xi, ptable) + yi, ptable), xg, yg);
    const n01: number = gradient(ptl(ptl(xi, ptable) + yi + 1, ptable), xg, yg - 1);
    const n11: number = gradient(ptl(ptl((xi + 1), ptable) + yi + 1, ptable), xg - 1, yg - 1);
    const n10: number = gradient(ptl(ptl((xi + 1), ptable) + yi, ptable), xg - 1, yg);

    // apply fade function to distance coordinates
    const xf: number = fade(xg);
    const yf: number = fade(yg);

    // apply linear interpolation between the 4 gradients by the faded distances
    const x1: number = lerp(n00, n10, xf);
    const x2: number = lerp(n01, n11, xf);

    return lerp(x1, x2, yf);
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

// permutation table lookup
function ptl(n: number, ptable: number[]): number {
  return ptable[Math.abs(n) % ptable.length];
}

// generate permutation table
function genPtable(seed: number, segments: number): number[] {
  if (ptables.has(seed) && ptables.get(seed)!.length === segments) return ptables.get(seed)!;
  const rng = new Rand(seed.toString()); // Seeded random number generator
  const array = Array.from({ length: segments }, (_, i) => i).sort(() => rng.next() - 0.5); // Shuffle a 0 - (segments-1) array using the RNG
  ptables.set(seed, array);
  return array;
}