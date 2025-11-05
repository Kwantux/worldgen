import { INCREMENT, SEGMENTS } from '../../components/terrain/Tile';
import Generator from '../../logic/Generator';
import { GeneratorType } from '../../logic/Generator';
import { ScaledCoordinate } from '../../util/Types';

type GroundSolidityState = {
  scale: number;
  offset: number;
};

export class GroundSolidity extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    // Simple Perlin-like noise generation for ground solidity
    // 0 = sand, 0.5 = soil, 1 = rock
    const data = new Float32Array(SEGMENTS*SEGMENTS); // Assuming 16x16 tile
    const { scale, offset } = this.state;
    const [coordX, coordY] = coordinates.coordinate;

    for (let i = 0; i < data.length; i++) {
      // Use coordinate-based pseudo-random generation
      // const x = i % INCREMENT;
      // const y = Math.floor(i / INCREMENT);
      // const seed = coordX * 73856093 ^ coordY * 19349663 ^ (x + y * INCREMENT) * 83492791;
      // const random = Math.sin(seed) * 43758.5453;
      // const value = random - Math.floor(random);

      // data[i] = Math.max(0, Math.min(1, value * scale + offset));
      data[i] = 1;
    }

    return data;
  }

  private state: GroundSolidityState;
  private static instance: GroundSolidity;

  private constructor() {
    super(GeneratorType.GroundSolidity);
    this.state = {
      scale: 1,
      offset: 0.5
    };
  }

  public static getInstance(): GroundSolidity {
    if (!GroundSolidity.instance) {
      GroundSolidity.instance = new GroundSolidity();
    }
    return GroundSolidity.instance;
  }

  public static meta() {
    return {
      type: GeneratorType.GroundSolidity,
      name: 'GroundSolidity: Perlin' as const,
      dependencies: [],
      constructor: () => GroundSolidity.getInstance()
    };
  }

  public meta() {
    return GroundSolidity.meta();
  }

  private updateState(updates: Partial<GroundSolidityState>) {
    this.state = { ...this.state, ...updates };
    this.update();
    this.updateFunction?.();
  }

  private updateFunction?: () => void;

  public settingsPanel(onUpdate?: () => void) {
    const { scale, offset } = this.state;

    this.updateFunction = onUpdate;

    return (
      <div className="ground-solidity-settings">
        <div>
          <label>Scale: {scale.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => this.updateState({
              scale: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Offset: {offset.toFixed(2)}</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={offset}
            onChange={(e) => this.updateState({
              offset: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
    );
  }
}
