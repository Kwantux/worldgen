'use strict';

import Rand from "rand-seed";

const ptables: Map<number, number[]> = new Map();

/**
 * Generates Perlin noise value at coordinates (x,y)
 * @returns Value between -1 and 1
 */
export function perlin(x: number, y: number, seed: number, scaleH: number, segments: number): number {
    // Get or generate the permutation table for this seed
    const ptable = genPtable(seed, segments);

    // Calculate grid cell coordinates and fractional parts
    const xi = Math.floor(x * scaleH);
    const yi = Math.floor(y * scaleH);
    const xg = x * scaleH - xi;  // Position within grid cell (0-1)
    const yg = y * scaleH - yi;

    if (!isFinite(x) || !isFinite(y)) {
        console.error(`[Perlin] Invalid coordinates: x=${x}, y=${y}`);
        return 0;
    }
  
    // Calculate the gradients to the 4 closest grid points
    const n00: number = gradient(ptl(ptl(xi, ptable) + yi, ptable), xg, yg);
    const n01: number = gradient(ptl(ptl(xi, ptable) + yi + 1, ptable), xg, yg - 1);
    const n11: number = gradient(ptl(ptl((xi + 1), ptable) + yi + 1, ptable), xg - 1, yg - 1);
    const n10: number = gradient(ptl(ptl((xi + 1), ptable) + yi, ptable), xg - 1, yg);

    // Apply smoothstep to distance coordinates for smoother transitions
    const xf = fade(xg);
    const yf = fade(yg);

    // apply linear interpolation between the 4 gradients by the faded distances
    const x1: number = lerp(n00, n10, xf);
    const x2: number = lerp(n01, n11, xf);

    return lerp(x1, x2, yf);
}
  
// linear interpolation
function lerp(a: number, b: number, x: number): number {
    return a + x * (b - a);
}
  
/**
 * Smoothstep function for Perlin noise interpolation
 * Only use with values between 0 and 1
 */
export function fade(f: number): number {
    return 6 * f ** 5 - 15 * f ** 4 + 10 * f ** 3;
}

const V = 1/2**0.5; // 1/sqrt(2) This is needed to make the gradients have a length of 1
  
// 8 possible gradient directions for Perlin noise
const GRADIENTS = [
    [0, 1],   // North
    [0, -1],  // South
    [1, 0],   // East
    [-1, 0],  // West
    [V, V],   // Northeast
    [V, -V],  // Southeast
    [-V, V],  // Northwest
    [-V, -V]  // Southwest
] as const;

/**
 * Calculates dot product between gradient and distance vector
 */
function gradient(hash: number, x: number, y: number): number {
    const g = GRADIENTS[hash % GRADIENTS.length];
    return g[0] * x + g[1] * y;
}

/**
 * Permutation table lookup with wrapping
 */
function ptl(index: number, ptable: number[]): number {
    return ptable[Math.abs(index) % ptable.length];
}

/**
 * Generates or retrieves a shuffled permutation table for the given seed
 */
function genPtable(seed: number, size: number): number[] {
    // Return cached table if available
    const cached = ptables.get(seed);
    if (cached && cached.length === size) {
        return cached;
    }
    
    // Create and shuffle a new permutation table
    const rng = new Rand(seed.toString()); // seeded random number generator
    const table = Array.from({length: size}, (_, i) => i)
        .sort(() => rng.next() - 0.5); // shuffle the array
    
    ptables.set(seed, table);
    return table;
}