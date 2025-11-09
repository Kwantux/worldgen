import Rand from "rand-seed";

const ptables = new Map<[number, number], number[]>();

export class PermutationTable {

  private table: number[];

  constructor(seed: number, private segments: number) {
    if (ptables.has([seed,segments]) && ptables.get([seed,segments])!.length === segments) {
      this.table = ptables.get([seed,segments])!;
      return;
    }
    console.log(">> Starting Ptable generation")
    const rng = new Rand(seed.toString()); // Seeded random number generator
    const array = Array.from({ length: segments }, (_, i) => i).sort(() => rng.next() - 0.5); // Shuffle a 0 - (segments-1) array using the RNG
    ptables.set([seed,segments], array);
    console.log(">> Ptable generated")
    this.table = array;
  }

  // permutation table lookup
  public lookup(n: number): number {
    return this.table[Math.abs(n) % this.table.length];
  }

  // alias
  public l(n: number): number {
    return this.lookup(n);
  }

}