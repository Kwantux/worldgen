import Generator from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { perlinMap } from '../../perlinsunshine/Functions';
import { SEGMENTS } from '../../../components/terrain/Tile';

type PerlinHumidityState = {
  seed: number;
  scale: number;
  scaleH: number;
  scaleV: number;
  rawScaleV: number;
  rawShift: number;
  exponent: number;
};

export class PerlinHumidity extends Generator<Float32Array> {
  private static instance: PerlinHumidity;
  private state: PerlinHumidityState;

  private constructor() {
    super(GeneratorType.Humidity, new Map());
    this.state = {
      seed: -1000,
      scale: 1,
      scaleH: 5,
      scaleV: 0.04,
      rawScaleV: 1,
      rawShift: 0,
      exponent: 4
    };
  }

  public static getInstance(): PerlinHumidity {
    if (!PerlinHumidity.instance) {
      PerlinHumidity.instance = new PerlinHumidity();
    }
    return PerlinHumidity.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const { seed, scale, scaleH, scaleV } = this.state;
    const x = coordinates.coordinate[0];
    const y = coordinates.coordinate[1];
    
    return perlinMap(SEGMENTS, x, y, seed, scaleH * scale, scaleV * scale);
  }

  public static meta() {
    return {
      type: GeneratorType.Humidity,
      name: 'Humidity: Perlin' as const,
      dependencies: [],
      constructor: () => PerlinHumidity.getInstance()
    };
  }

  public meta() {
    return PerlinHumidity.meta();
  }

  private updateState(updates: Partial<PerlinHumidityState>) {
    this.state = { ...this.state, ...updates };
    this.update();
  }

  public settingsPanel(onUpdate?: () => void) {
    const { 
      seed, 
      scale, 
      scaleH, 
      scaleV, 
      rawScaleV, 
      rawShift, 
      exponent 
    } = this.state;

    return (
      <div className="perlin-humidity-settings">
        <div>
          <label>Seed: {seed}</label>
          <input
            type="range"
            min="-10000"
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
            min="0"
            max="10"
            step="0.02"
            value={scale}
            onChange={(e) => this.updateState({ scale: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label>Horizontal Scale: {scaleH.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.01"
            value={scaleH}
            onChange={(e) => this.updateState({ scaleH: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label>Vertical Scale: {scaleV.toFixed(4)}</label>
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.001"
            value={scaleV}
            onChange={(e) => this.updateState({ scaleV: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label>Raw Vertical Scale: {rawScaleV.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.01"
            value={rawScaleV}
            onChange={(e) => this.updateState({ rawScaleV: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label>Raw Vertical Shift: {rawShift.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={rawShift}
            onChange={(e) => this.updateState({ rawShift: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label>Exponent: {exponent.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={exponent}
            onChange={(e) => this.updateState({ exponent: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    );
  }
}
