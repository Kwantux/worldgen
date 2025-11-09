import Generator from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { perlinMap } from './Functions';
import { ScaledCoordinate } from '../../../util/Types';
import { SEGMENTS } from '../../../components/terrain/Tile';

type PerlinSunshineState = {
  seed: number;
  scaleH: number;
};

export class PerlinSunshine extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    return this.generate(
      coordinates.coordinate[0],
      coordinates.coordinate[1],
      coordinates.levelOfDetail.scale(),
    );
  }

  private state: PerlinSunshineState;
  private static instance: PerlinSunshine;

  private constructor() {
    super(GeneratorType.Sunshine);
    this.state = {
      seed: -1000,
      scaleH: 0.02,
    };
  }

  public static getInstance(): PerlinSunshine {
    if (!PerlinSunshine.instance) {
      PerlinSunshine.instance = new PerlinSunshine();
    }
    return PerlinSunshine.instance;
  }

  public static meta() {
    return {
      type: GeneratorType.Sunshine,
      name: 'Sunshine: Perlin' as const,
      dependencies: [],
      constructor: () => PerlinSunshine.getInstance()
    };
  }

  public meta() {
    return PerlinSunshine.meta();
  }

  public generate(
    x: number,
    y: number,
    scaleH: number,
  ): Float32Array {
    const {
      seed,
      scaleH: stateScaleH,
    } = this.state;

    return perlinMap(
      SEGMENTS,
      x,
      y,
      seed,
      scaleH  * stateScaleH,
    );
  }

  private updateState(updates: Partial<PerlinSunshineState>) {
    this.state = { ...this.state, ...updates };
    this.update();
    this.updateFunction?.();
  }

  private updateFunction?: () => void;

  public settingsPanel(onUpdate?: () => void) {

    this.updateFunction = onUpdate;
    
    const {
      seed,
      scaleH,
    } = this.state;

    return (
      <div className="perlin-Sunshine-settings">
        <div>
          <label>Seed: {seed}</label>
          <input
            type="number"
            min="1"
            max="10000"
            step="1"
            value={seed}
            onChange={(e) => this.updateState({ seed: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label>Horizontal Scale: {scaleH.toFixed(2)}</label>
          <input
            type="number"
            min="0.1"
            max="50"
            step="0.1"
            value={scaleH}
            onChange={(e) => this.updateState({ scaleH: parseFloat(e.target.value) })}
          />
        </div>

      </div>
    );
  }
}