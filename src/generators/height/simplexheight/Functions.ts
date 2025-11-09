'use strict';

import Rand from "rand-seed";

const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

const p: number[] = [];
const perm: number[] = [];
const permMod12: number[] = [];

// Skewing and unskewing factors for 2D
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

// Initialize the permutation arrays
function initPermutation(seed: number): void {
    const rng = new Rand(seed.toString());
    
    // Fill p array with random values from 0 to 255
    for (let i = 0; i < 256; i++) {
        p[i] = Math.floor(rng.next() * 256);
    }
    
    // Initialize the permutation and permMod12 arrays
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }
}

// 2D Simplex Noise
// Returns value between -1 and 1
export function simplex(xin: number, yin: number, seed: number, scaleH: number, segments: number): number {
    // Initialize permutation if not already done
    if (perm.length === 0) {
        initPermutation(seed);
    }
    
    // Scale the input coordinates
    xin *= scaleH;
    yin *= scaleH;
    
    // Skew the input space to determine which simplex cell we're in
    const s = (xin + yin) * F2; // Hairy factor for 2D
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    
    // Unskew the cell origin back to (x,y) space
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0; // The x,y distances from the cell origin
    const y0 = yin - Y0;
    
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if (x0 > y0) {
        i1 = 1;
        j1 = 0;
    } else {
        i1 = 0;
        j1 = 1;
    }
    
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    const x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
    const y2 = y0 - 1.0 + 2.0 * G2;
    
    // Work out the hashed gradient indices of the three simplex corners
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = permMod12[ii + perm[jj]];
    const gi1 = permMod12[ii + i1 + perm[jj + j1]];
    const gi2 = permMod12[ii + 1 + perm[jj + 1]];
    
    // Calculate the contribution from the three corners
    let n0, n1, n2; // Noise contributions from the three corners
    
    // Calculate the contribution from the first corner
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) {
        n0 = 0.0;
    } else {
        t0 *= t0;
        n0 = t0 * t0 * dot2(grad3[gi0], x0, y0);
    }
    
    // Calculate the contribution from the second corner
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
        n1 = 0.0;
    } else {
        t1 *= t1;
        n1 = t1 * t1 * dot2(grad3[gi1], x1, y1);
    }
    
    // Calculate the contribution from the third corner
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
        n2 = 0.0;
    } else {
        t2 *= t2;
        n2 = t2 * t2 * dot2(grad3[gi2], x2, y2);
    }
    
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70.0 * (n0 + n1 + n2);
}

// 2D dot product
function dot2(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
}

// Fade function (same as Perlin noise)
export function fade(f: number): number {
    return 6 * f ** 5 - 15 * f ** 4 + 10 * f ** 3;
}

// Linear interpolation (same as Perlin noise)
function lerp(a: number, b: number, x: number): number {
    return a + x * (b - a);
}
