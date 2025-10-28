import Generator from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';

type TemperatureByHeightAndSunshineState = {
  weightHeight: number;
  weightSunshine: number;
};

export class TemperatureByHeightAndSunshine extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);
    const sunshineMap = Generator.dependencies.get(GeneratorType.Sunshine)?.getTile(coordinates);

    if (!heightMap || !sunshineMap) {
      throw new Error("Height and/or sunshine map dependency not met.");
    }

    const data = new Float32Array(heightMap.length);
    const maxHeight = Math.max(...heightMap);
    const minHeight = Math.min(...heightMap);
    const maxSunshine = Math.max(...sunshineMap);
    const minSunshine = Math.min(...sunshineMap);

    const { weightHeight, weightSunshine } = this.state;

    for (let i = 0; i < heightMap.length; i++) {
      data[i] = (1 - ((heightMap[i] - minHeight) / (maxHeight - minHeight))) * weightHeight +
                ((sunshineMap[i] - minSunshine) / (maxSunshine - minSunshine)) * weightSunshine;
    }
    return data;
  }

  private state: TemperatureByHeightAndSunshineState;
  private static instance: TemperatureByHeightAndSunshine;

  private constructor() {
    super(GeneratorType.Temperature, new Map([
      [GeneratorType.Height, Generator.availableGenerators.get(GeneratorType.Height)!.get("Height: Classic fBm")!],
      [GeneratorType.Sunshine, Generator.availableGenerators.get(GeneratorType.Sunshine)!.get("Sunshine: Perlin")!]
    ]));
    this.state = {
      weightHeight: 0.5,
      weightSunshine: 0.5
    };
  }

  public static getInstance(): TemperatureByHeightAndSunshine {
    if (!TemperatureByHeightAndSunshine.instance) {
      TemperatureByHeightAndSunshine.instance = new TemperatureByHeightAndSunshine();
    }
    return TemperatureByHeightAndSunshine.instance;
  }

  public static meta() {
    return {
      type: GeneratorType.Temperature,
      name: 'Temperature: by Sunshine and Height' as const,
      dependencies: [GeneratorType.Height, GeneratorType.Sunshine],
      constructor: () => TemperatureByHeightAndSunshine.getInstance()
    };
  }

  public meta() {
    return TemperatureByHeightAndSunshine.meta();
  }

  private updateState(updates: Partial<TemperatureByHeightAndSunshineState>) {
    this.state = { ...this.state, ...updates };
    this.update();
    this.updateFunction?.();
  }

  private updateFunction?: () => void;

  public settingsPanel(onUpdate?: () => void) {
    const { weightHeight, weightSunshine } = this.state;

    this.updateFunction = onUpdate;

    return (
      <div className="temperature-by-height-and-sunshine-settings">
        <div>
          <label>Weight Height: {weightHeight.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weightHeight}
            onChange={(e) => this.updateState({
              weightHeight: parseFloat(e.target.value),
              weightSunshine: 1 - parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Weight Sunshine: {weightSunshine.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weightSunshine}
            onChange={(e) => this.updateState({
              weightSunshine: parseFloat(e.target.value),
              weightHeight: 1 - parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
    );
  }
}