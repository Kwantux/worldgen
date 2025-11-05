import Generator from '../../logic/Generator';
import { GeneratorType } from '../../logic/Generator';
import { ScaledCoordinate } from '../../util/Types';

type TerrainSteepnessState = {
  scale: number;
};

export class TerrainSteepness extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);

    if (!heightMap) {
      throw new Error("Height map dependency not met.");
    }

    const data = new Float32Array(heightMap.length);
    const { scale } = this.state;
    const tileSize = Math.sqrt(heightMap.length);

    for (let i = 0; i < heightMap.length; i++) {
      const x = i % tileSize;
      const y = Math.floor(i / tileSize);

      // Calculate gradient using neighboring pixels
      let steepness = 0;
      let count = 0;

      // Check all 8 neighbors
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < tileSize && ny >= 0 && ny < tileSize) {
            const neighborIdx = ny * tileSize + nx;
            const heightDiff = Math.abs(heightMap[i] - heightMap[neighborIdx]);
            const distance = Math.sqrt(dx * dx + dy * dy);
            steepness += heightDiff / distance;
            count++;
          }
        }
      }

      // Average steepness and apply scale
      data[i] = Math.min(1, (steepness / count) * scale);
    }

    return data;
  }

  private state: TerrainSteepnessState;
  private static instance: TerrainSteepness;

  private constructor() {
    super(GeneratorType.TerrainSteepness);
    this.state = {
      scale: 1
    };
  }

  public static getInstance(): TerrainSteepness {
    if (!TerrainSteepness.instance) {
      TerrainSteepness.instance = new TerrainSteepness();
    }
    return TerrainSteepness.instance;
  }

  public static meta() {
    return {
      type: GeneratorType.TerrainSteepness,
      name: 'TerrainSteepness: from Height' as const,
      dependencies: [GeneratorType.Height],
      constructor: () => TerrainSteepness.getInstance()
    };
  }

  public meta() {
    return TerrainSteepness.meta();
  }

  private updateState(updates: Partial<TerrainSteepnessState>) {
    this.state = { ...this.state, ...updates };
    this.update();
    this.updateFunction?.();
  }

  private updateFunction?: () => void;

  public settingsPanel(onUpdate?: () => void) {
    const { scale } = this.state;

    this.updateFunction = onUpdate;

    return (
      <div className="terrain-steepness-settings">
        <div>
          <label>Steepness Scale: {scale.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={scale}
            onChange={(e) => this.updateState({
              scale: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
    );
  }
}
