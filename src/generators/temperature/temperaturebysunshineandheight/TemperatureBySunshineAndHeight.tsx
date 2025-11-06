import Generator from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';

type TemperatureByHeightAndSunshineState = {
  weightHeight: number;
  weightSunshine: number;
  maxHeight: number;
  maxSunshine: number;
};

export class TemperatureByHeightAndSunshine extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);
    const sunshineMap = Generator.dependencies.get(GeneratorType.Sunshine)?.getTile(coordinates);

    if (!heightMap || !sunshineMap) {
      throw new Error("Height and/or sunshine map dependency not met.");
    }

    const data = new Float32Array(heightMap.length);
    const { weightHeight, weightSunshine, maxHeight, maxSunshine } = this.state;

    for (let i = 0; i < heightMap.length; i++) {
      const normalizedHeight = Math.max(0, Math.min(1, heightMap[i] / maxHeight));
      const normalizedSunshine = Math.max(0, Math.min(1, sunshineMap[i] / maxSunshine));
      
      // Higher height = lower temperature, higher sunshine = higher temperature
      data[i] = (1 - normalizedHeight) * weightHeight + normalizedSunshine * weightSunshine;
    }

    return data;
  }

  private state: TemperatureByHeightAndSunshineState;
  private static instance: TemperatureByHeightAndSunshine;

  private constructor() {
    super(GeneratorType.Temperature);
    this.state = {
      weightHeight: 0.5,
      weightSunshine: 0.5,
      maxHeight: 500,
      maxSunshine: 1
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
      name: 'Temperature: by Height and Sunshine' as const,
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
    const { weightHeight, weightSunshine, maxHeight, maxSunshine } = this.state;

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

        <div>
          <label>Max Height: {maxHeight.toFixed(0)}</label>
          <input
            type="range"
            min="1"
            max="1000"
            step="10"
            value={maxHeight}
            onChange={(e) => this.updateState({
              maxHeight: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Max Sunshine: {maxSunshine.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={maxSunshine}
            onChange={(e) => this.updateState({
              maxSunshine: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
    );
  }
}