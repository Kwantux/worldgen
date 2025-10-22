import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { classicFbmMap } from './Functions';
import { ScaledCoordinate } from '../../../util/Types';
import { INCREMENT, SEGMENTS } from '../../../components/terrain/Tile';
import { perlin } from '../perlinheight/Functions';

type ClassicFBMState = {
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
};

export class ClassicFBM extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    return this.generate(
      coordinates.coordinate[0],
      coordinates.coordinate[1],
      coordinates.levelOfDetail.scale(),
    );
  }
  
  private state: ClassicFBMState;
  private static instance: ClassicFBM;

  private constructor() {
    super(GeneratorType.Height, new Map());
    this.state = {
      heightNoiseFunction: (x: number, y: number) => perlin(x, y, 1, 1, INCREMENT),
      scale: 1,
      scaleH: 0.5,
      scaleV: 0.04,
      rawScaleV: 1,
      rawShift: 0,
      verticalShift: 0,
      exponent: 4,
      octaves: 5,
      lacunarity: 0.4,
      persistence: 3.5,
      lacunarityScale: 1,
      persistenceScale: 1
    };
  }

  public static getInstance(): ClassicFBM {
    if (!ClassicFBM.instance) {
      ClassicFBM.instance = new ClassicFBM();
    }
    return ClassicFBM.instance;
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Height as const,
      name: 'Height: Classic fBm' as const,
      dependencies: [],
      constructor: () => ClassicFBM.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return ClassicFBM.meta();
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
      persistenceScale
    } = this.state;

    // console.log("GENERATING", this.state);

    return classicFbmMap(
      heightNoiseFunction,
      x,
      y,
      scaleH * scale * stateScaleH,
      scaleV * scale,
      rawScaleV,
      rawShift,
      verticalShift,
      exponent,
      octaves,
      lacunarity,
      persistence,
      lacunarityScale,
      persistenceScale
    );
  }

  private updateState(updates: Partial<ClassicFBMState>, onUpdate?: () => void) {
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
      persistenceScale
    } = this.state;

    return (
      <div className="classic-fbm-settings">
        <div>
          <label>Scale:</label>
          <br/>
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={scale}
            onChange={(e) => this.updateState({ scale: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>
        
        <div>
          <label>Horizontal Scale:</label>
          <br/>
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={scaleH}
            onChange={(e) => this.updateState({ scaleH: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Vertical Scale:</label>
          <br/>
          <input
            type="number"
            min="0.0001"
            max="0.1"
            step="0.0001"
            value={scaleV}
            onChange={(e) => this.updateState({ scaleV: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Raw Scale V:</label>
          <br/>
          <input
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={rawScaleV}
            onChange={(e) => this.updateState({ rawScaleV: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Raw Shift:</label>
          <br/>
          <input
            type="number"
            min="-2"
            max="2"
            step="0.01"
            value={rawShift}
            onChange={(e) => this.updateState({ rawShift: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Vertical Shift:</label>
          <br/>
          <input
            type="number"
            min="-1"
            max="1"
            step="0.01"
            value={verticalShift}
            onChange={(e) => this.updateState({ verticalShift: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Exponent:</label>
          <br/>
          <input
            type="number"
            min="1"
            max="16"
            step="0.1"
            value={exponent}
            onChange={(e) => this.updateState({ exponent: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Octaves:</label>
          <br/>
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            value={octaves}
            onChange={(e) => this.updateState({ octaves: parseInt(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Lacunarity:</label>
          <br/>
          <input
            type="number"
            min="0.1"
            max="2"
            step="0.01"
            value={lacunarity}
            onChange={(e) => this.updateState({ lacunarity: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Persistence:</label>
          <br/>
          <input
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={persistence}
            onChange={(e) => this.updateState({ persistence: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Lacunarity Scale:</label>
          <br/>
          <input
            type="number"
            min="0.1"
            max="2"
            step="0.01"
            value={lacunarityScale}
            onChange={(e) => this.updateState({ lacunarityScale: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>

        <div>
          <label>Persistence Scale:</label>
          <br/>
          <input
            type="number"
            min="0.1"
            max="2"
            step="0.01"
            value={persistenceScale}
            onChange={(e) => this.updateState({ persistenceScale: parseFloat(e.target.value) }, onUpdate)}
          />
        </div>
      </div>
    );
  }
}