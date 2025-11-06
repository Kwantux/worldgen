import { INCREMENT, SEGMENTS } from '../../components/terrain/Tile';
import Generator from '../../logic/Generator';
import { GeneratorType } from '../../logic/Generator';
import { ScaledCoordinate } from '../../util/Types';

type GroundSolidityState = {
  scale: number;
  offset: number;
  heightFactor: number;
  maxHeight: number;
  steepnessFactor: number;
  humidityFactor: number;
};

export class GroundSolidity extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    // Simple Perlin-like noise generation for ground solidity
    // 0 = sand, 0.5 = soil, 1 = rock
    const data = new Float32Array(SEGMENTS*SEGMENTS); // Assuming 16x16 tile
    const { scale, offset, heightFactor, maxHeight, steepnessFactor, humidityFactor } = this.state;
    const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);
    const terrainSteepnessMap = Generator.dependencies.get(GeneratorType.TerrainSteepness)?.getTile(coordinates);
    const humidityMap = Generator.dependencies.get(GeneratorType.Humidity)?.getTile(coordinates);

    for (let i = 0; i < data.length; i++) {
      // Calculate ground solidity based on height, steepness, and humidity
      const heightValue = Math.min(1, heightMap ? heightMap[i] / maxHeight * heightFactor : 0);
      const steepnessValue = Math.min(1, terrainSteepnessMap ? terrainSteepnessMap[i] * steepnessFactor : 0);
      const humidityValue = Math.min(1, humidityMap ? humidityMap[i] * humidityFactor : 0);
      const value = Math.max(0, Math.min(1, (heightValue + steepnessValue + humidityValue) * scale + offset));

      data[i] = value;
    }

    return data;
  }

  private state: GroundSolidityState;
  private static instance: GroundSolidity;

  private constructor() {
    super(GeneratorType.GroundSolidity);
    this.state = {
      scale: 1,
      offset: 0.5,
      heightFactor: 0.2,
      maxHeight: 200,
      steepnessFactor: 0.3,
      humidityFactor: 0.1
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
      dependencies: [GeneratorType.Height, GeneratorType.TerrainSteepness, GeneratorType.Humidity],
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
    const { scale, offset, heightFactor, maxHeight, steepnessFactor, humidityFactor } = this.state;

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

        <div>
          <label>Max Height: {maxHeight.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={maxHeight}
            onChange={(e) => this.updateState({
              maxHeight: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Height Factor: {heightFactor.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={heightFactor}
            onChange={(e) => this.updateState({
              heightFactor: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Steepness Factor: {steepnessFactor.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={steepnessFactor}
            onChange={(e) => this.updateState({
              steepnessFactor: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>humidity Factor: {humidityFactor.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={humidityFactor}
            onChange={(e) => this.updateState({
              humidityFactor: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
    );
  }
}
