// Utility function for generating white noise heightmap
export function generateWhiteNoise(width: number, height: number): Float32Array {
  const size = width * height;
  const data = new Float32Array(size);
  
  for (let i = 0; i < size; i++) {
    data[i] = Math.random() * 10; // Scale factor of 10 for more pronounced heights
  }
  
  return data;
}

export function flat(width: number, height: number): Float32Array {
  const size = width * height;
  const data = new Float32Array(size);
  
  for (let i = 0; i < size; i++) {
    data[i] = i;
  }
  
  return data;
}

function interpolatedNoise2D(x: number, y: number, seed: number): number {
  const integerX = Math.floor(x);
  const fractionalX = x - integerX;
  const integerY = Math.floor(y);
  const fractionalY = y - integerY;

  const v1 = noise2D(integerX, integerY, seed);
  const v2 = noise2D(integerX + 1, integerY, seed);
  const v3 = noise2D(integerX, integerY + 1, seed);
  const v4 = noise2D(integerX + 1, integerY + 1, seed);

  const i1 = interpolate(v1, v2, fractionalX);
  const i2 = interpolate(v3, v4, fractionalX);

  return interpolate(i1, i2, fractionalY);
}

function noise2D(x: number, y: number, seed: number): number {
  return Math.sin((x * 12.9898 + y * 78.233 + seed) * 43758.5453) * 0.5 + 0.5;
}

function interpolate(a: number, b: number, x: number): number {
  const ft = x * 3.1415927;
  const f = (1 - Math.cos(ft)) * 0.5;
  return  a * (1 - f) + b * f;
}

export function perlinMap(w: number, h: number, seed: number): Float32Array {
  const data = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      data[y * w + x] = perlin(x / 50, y / 50, seed);
    }
  }
  return data;
}

function perlin(x: number, y: number, seed: number = 0): number {
    // create a permutation table based on the number of pixels
    // seed is the initial value we want to start with
    // we also use the seed function to get the same set of numbers
    // this helps to keep our Perlin graph smooth

    let ptable: number[] = Array.from({ length: 256 }, (_, i) => i);
  
    // shuffle our numbers in the table
    ptable.sort(() => Math.random() - 0.5);
  
    // create a 2D array and then flatten it
    // so that we can apply our dot product interpolations easily
    ptable = [].concat(...ptable.map(val => [val, val]));
  
    // grid coordinates
    const xi: number = Math.floor(x);
    const yi: number = Math.floor(y);
  
    // distance vector coordinates
    const xg: number = x - xi;
    const yg: number = y - yi;
  
    // apply fade function to distance coordinates
    const xf: number = fade(xg);
    const yf: number = fade(yg);
  
    // the gradient vector coordinates in the top left, top right, bottom left, bottom right
    const n00: number = gradient(ptable[ptable[xi] + yi], xg, yg);
    const n01: number = gradient(ptable[ptable[xi] + yi + 1], xg, yg - 1);
    const n11: number = gradient(ptable[ptable[xi + 1] + yi + 1], xg - 1, yg - 1);
    const n10: number = gradient(ptable[ptable[xi + 1] + yi], xg - 1, yg);
  
    // apply linear interpolation i.e. dot product to calculate average
    const x1: number = lerp(n00, n10, xf);
    const x2: number = lerp(n01, n11, xf);
  
    return lerp(x1, x2, yf);
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