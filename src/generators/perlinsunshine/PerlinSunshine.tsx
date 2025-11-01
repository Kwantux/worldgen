import Generator from '../../logic/Generator';
import { GeneratorType } from '../../logic/Generator';
import { perlinMap } from './Functions';
import { ScaledCoordinate } from '../../util/Types';
import { SEGMENTS } from '../../components/terrain/Tile';

type PerlinSunshineState = {
  seed: number;
  scale: number;
  scaleH: number;
  scaleV: number;
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
    super(GeneratorType.Sunshine, new Map());
    this.state = {
      seed: 1000,
      scale: 1,
      scaleH: 10,
      scaleV: 0.04
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
      scale,
      scaleH: stateScaleH,
      scaleV
    } = this.state;

    return perlinMap(
      SEGMENTS,
      x,
      y,
      seed,
      scaleH * scale * stateScaleH,
      scaleV * scale
    );
  }

  private updateState(updates: Partial<PerlinSunshineState>) {
    this.state = { ...this.state, ...updates };
    this.update();
    this.updateFunction?.();
  }

  private updateFunction?: () => void;

  public settingsPanel(onUpdate?: () => void) {

    console.log(this.state); 

    this.updateFunction = onUpdate;
    
    const {
      seed,
      scale,
      scaleH,
      scaleV
    } = this.state;

    return (
      <div className="perlin-sunshine-settings">
        <div>
          <label>Seed: {seed}</label>
          <input
            type="range"
            min="1"
            max="10000"
            step="1"
            value={seed}
            onChange={(e) => this.updateState({ seed: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label>Scale: {scale.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={scale}
            onChange={(e) => this.updateState({ scale: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label>Horizontal Scale: {scaleH.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="50"
            step="0.1"
            value={scaleH}
            onChange={(e) => this.updateState({ scaleH: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label>Vertical Scale: {scaleV.toFixed(4)}</label>
          <input
            type="range"
            min="0.0001"
            max="0.1"
            step="0.0001"
            value={scaleV}
            onChange={(e) => this.updateState({ scaleV: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    );
  }
}