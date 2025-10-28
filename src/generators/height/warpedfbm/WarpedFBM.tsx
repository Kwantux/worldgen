import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { warpedMap } from './Functions';
import { ScaledCoordinate } from '../../../util/Types';
import { SEGMENTS } from '../../../components/terrain/Tile';
import { perlin } from '../perlinheight/Functions';

type WarpedFBMState = {
  heightNoiseFunction: (x: number, y: number) => number;
  scale: number;
  scaleH: number;
  scaleV: number;
  rawScaleV: number;
  rawShift: number;
  verticalShift: number;
  exponent: number;
  octaves: number;
  lacunarity: number;
  persistence: number;
  lacunarityScale: number;
  persistenceScale: number;
  persistenceIncByHeight: number;
};

export class WarpedFBM extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    return this.generate(
      coordinates.coordinate[0],
      coordinates.coordinate[1],
      coordinates.levelOfDetail.scale(),
    );
  }
  private state: WarpedFBMState;
  private static instance: WarpedFBM;

  private constructor() {
    super(GeneratorType.Height, new Map());
    this.state = {
      heightNoiseFunction: (x: number, y: number) => perlin(x, y, 1, 1, SEGMENTS),
      scale: 1,
      scaleH: 2,
      scaleV: 0.04,
      rawScaleV: 0.7,
      rawShift: 0.22,
      verticalShift: -250,
      exponent: 10,
      octaves: 7,
      lacunarity: 0.34,
      persistence: 3.3,
      lacunarityScale: 0.96,
      persistenceScale: 1.06,
      persistenceIncByHeight: 1
    };
  }

  public static getInstance(): WarpedFBM {
    if (!WarpedFBM.instance) {
      WarpedFBM.instance = new WarpedFBM();
    }
    return WarpedFBM.instance;
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Height as const,
      name: 'Height: Warped fBm' as const,
      dependencies: [],
      constructor: () => WarpedFBM.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return WarpedFBM.meta();
  }

  public generate(
    x: number,
    y: number,
    scaleH: number,
  ): Float32Array {
    const {
      heightNoiseFunction,
      scale, 
      scaleH: stateScaleH, 
      scaleV, 
      rawScaleV, 
      rawShift,
      verticalShift,
      exponent, 
      octaves, 
      lacunarity, 
      persistence, 
      lacunarityScale, 
      persistenceScale, 
      persistenceIncByHeight 
    } = this.state;

    // console.log("GENERATING", this.state);

    return warpedMap(
      heightNoiseFunction,
      SEGMENTS,
      x,
      y,
      scaleH * scale * stateScaleH,
      scaleV / scale,
      rawScaleV,
      rawShift,
      verticalShift,
      exponent,
      octaves,
      lacunarity,
      persistence,
      lacunarityScale,
      persistenceScale,
      persistenceIncByHeight
    );
  }

  private updateState(updates: Partial<WarpedFBMState>, onUpdate?: () => void) {
    console.log(updates);
    this.state = { ...this.state, ...updates };
    this.update();
    onUpdate?.();
  }

  public settingsPanel(onUpdate?: () => void) {
    const { 
      scale, 
      scaleH, 
      scaleV, 
      rawScaleV, 
      rawShift, 
      verticalShift,
      exponent, 
      octaves, 
      lacunarity, 
      persistence, 
      lacunarityScale, 
      persistenceScale, 
      persistenceIncByHeight 
    } = this.state;

    return (
      <div className="warped-fbm-settings">
        <div>
          <label>Scale:</label>
          <input
            type="number"
            step="0.1"
            value={scale}
            onChange={(e) => this.updateState({ scale: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>
        
        <div>
          <label>Horizontal Scale:</label>
          <input
            type="number"
            step="0.1"
            value={scaleH}
            onChange={(e) => this.updateState({ scaleH: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Vertical Scale:</label>
          <input
            type="number"
            step="0.0001"
            value={scaleV}
            onChange={(e) => this.updateState({ scaleV: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Raw Scale V:</label>
          <input
            type="number"
            step="0.1"
            value={rawScaleV}
            onChange={(e) => this.updateState({ rawScaleV: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Raw Shift:</label>
          <input
            type="number"
            step="0.01"
            value={rawShift}
            onChange={(e) => this.updateState({ rawShift: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Vertical Shift:</label>
          <input
            type="number"
            step="0.01"
            value={verticalShift}
            onChange={(e) => this.updateState({ verticalShift: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Exponent:</label>
          <input
            type="number"
            step="0.1"
            value={exponent}
            onChange={(e) => this.updateState({ exponent: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Octaves:</label>
          <input
            type="number"
            step="1"
            value={octaves}
            onChange={(e) => this.updateState({ octaves: parseInt(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Lacunarity:</label>
          <input
            type="number"
            step="0.01"
            value={lacunarity}
            onChange={(e) => this.updateState({ lacunarity: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Persistence:</label>
          <input
            type="number"
            step="0.1"
            value={persistence}
            onChange={(e) => this.updateState({ persistence: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Lacunarity Scale:</label>
          <input
            type="number"
            step="0.01"
            value={lacunarityScale}
            onChange={(e) => this.updateState({ lacunarityScale: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Persistence Scale: </label>
          <input
            type="number"
            step="0.01"
            value={persistenceScale}
            onChange={(e) => this.updateState({ persistenceScale: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Persistence Inc By Height:</label>
          <input
            type="number"
            step="0.01"
            value={persistenceIncByHeight}
            onChange={(e) => this.updateState({ persistenceIncByHeight: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>
      </div>
    );
  }
}
