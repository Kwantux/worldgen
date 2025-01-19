
export function perlinMap(size: number, seed: number = 0, scaleH: number = 1, scaleV: number = 1, exponent: number = 1): Float32Array {
  const data = new Float32Array(size * size);
  
  const ptable: number[] = shuffle(seed, Array.from({ length: 256 }, (_, i) => i));
  console.log(ptable);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      data[y * size + x] = ( perlin(x / 50 * scaleH, y / 50 * scaleH, ptable) * scaleV ) ** exponent;
    }
  }
  return data;
}

function perlin(x: number, y: number, ptable: number[]): number {
    // create a permutation table based on the number of pixels
    // seed is the initial value we want to start with
    // we also use the seed function to get the same set of numbers
    // this helps to keep our Perlin graph smooth

    
  
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

function shuffle(seed: number, array: number[]) {
  const random = {
    seed: seed,
    next: function() {
      const x = Math.sin(this.seed++) * 10000;
      return x - Math.floor(x);
    }
  };

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random.next() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}