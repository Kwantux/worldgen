import Generator from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { VegetationTile } from '../../ongroundvegetation/VegetationData';

type ColorByTerrainState = {
  steepnessThreshold: number;
  temperatureSnowThreshold: number;
};

type RGB = [number, number, number];

export class ColorByTerrain extends Generator<Float32Array> {
  protected buildTile(coordinates: ScaledCoordinate): Float32Array {

    console.log("Color by terrain buildTile called")
    const solidityMap = Generator.dependencies.get(GeneratorType.GroundSolidity)?.getTile(coordinates);
    const steepnessMap = Generator.dependencies.get(GeneratorType.TerrainSteepness)?.getTile(coordinates);
    const vegetationTile = Generator.dependencies.get(GeneratorType.OnGroundVegetation)?.getTile(coordinates) as VegetationTile;
    const temperatureMap = Generator.dependencies.get(GeneratorType.Temperature)?.getTile(coordinates);

    if (!solidityMap || !steepnessMap || !vegetationTile || !temperatureMap) {
      throw new Error("GroundSolidity, TerrainSteepness, OnGroundVegetation, and/or Temperature map dependency not met.");
    }

    // RGB values stored as [R, G, B, R, G, B, ...] in Float32Array
    const data = new Float32Array(solidityMap.length * 3);
    const { steepnessThreshold, temperatureSnowThreshold } = this.state;

    for (let i = 0; i < solidityMap.length; i++) {
      const solidity = solidityMap[i];
      const steepness = steepnessMap[i];
      const temperature = temperatureMap[i];
      const greenness = vegetationTile.greenness[i];
      const vegetationArea = vegetationTile.area[i];


      // Check if it's snow/ice
      if (steepness <= steepnessThreshold && temperature < temperatureSnowThreshold) {
        // Snow/ice - white
        data[i * 3] = 1.0;
        data[i * 3 + 1] = 1.0;
        data[i * 3 + 2] = 1.0;
      } else {
        // Base color from ground solidity (sand to rock)
        const baseColor = this.getSolidityColor(solidity);

        // Vegetation color (dark green to yellow-brownish)
        const vegetationColor = this.getVegetationColor(greenness);

        // Blend vegetation color onto base color using area as blend factor
        const blendedColor = this.blendColors(baseColor, vegetationColor, vegetationArea);

        // if (isNaN(blendedColor[0])) {
        //   console.log("blendedColor[0] is NaN")
        //   console.log("Solidity: " + solidity)
        //   console.log("Steepness: " + steepness)
        //   console.log("Temperature: " + temperature)
        //   console.log("Greenness: " + greenness)
        //   console.log("Vegetation Area: " + vegetationArea)
        // }

        data[i * 3] = blendedColor[0];
        data[i * 3 + 1] = blendedColor[1];
        data[i * 3 + 2] = blendedColor[2];
      }
    }

    return data;
  }

  private getSolidityColor(solidity: number): RGB {
    // 0 = sand (golden), 1 = rock (gray)
    const sandColor: RGB = [0.9, 0.8, 0.4];      // Golden sand
    const rockColor: RGB = [0.5, 0.5, 0.5];      // Gray rock

    return [
      sandColor[0] + (rockColor[0] - sandColor[0]) * solidity,
      sandColor[1] + (rockColor[1] - sandColor[1]) * solidity,
      sandColor[2] + (rockColor[2] - sandColor[2]) * solidity
    ];
  }

  private getVegetationColor(greenness: number): RGB {
    // greenness 1 = dark green, greenness 0 = yellow-brownish
    const darkGreen: RGB = [0.1, 0.5, 0.1];      // Dark green
    const yellowBrown: RGB = [0.8, 0.7, 0.3];    // Yellow-brownish

    return [
      darkGreen[0] + (yellowBrown[0] - darkGreen[0]) * (1 - greenness),
      darkGreen[1] + (yellowBrown[1] - darkGreen[1]) * (1 - greenness),
      darkGreen[2] + (yellowBrown[2] - darkGreen[2]) * (1 - greenness)
    ];
  }

  private blendColors(base: RGB, overlay: RGB, blendFactor: number): RGB {
    // blendFactor 0 = all base, blendFactor 1 = all overlay
    return [
      base[0] + (overlay[0] - base[0]) * blendFactor,
      base[1] + (overlay[1] - base[1]) * blendFactor,
      base[2] + (overlay[2] - base[2]) * blendFactor
    ];
  }

  private state: ColorByTerrainState;
  private static instance: ColorByTerrain;

  private constructor() {
    super(GeneratorType.Color);
    this.state = {
      steepnessThreshold: 0.3,
      temperatureSnowThreshold: 0.2
    };
  }

  public static getInstance(): ColorByTerrain {
    if (!ColorByTerrain.instance) {
      ColorByTerrain.instance = new ColorByTerrain();
    }
    return ColorByTerrain.instance;
  }

  public static meta() {
    return {
      type: GeneratorType.Color,
      name: 'Color: by Terrain' as const,
      dependencies: [GeneratorType.GroundSolidity, GeneratorType.TerrainSteepness, GeneratorType.OnGroundVegetation, GeneratorType.Temperature],
      constructor: () => ColorByTerrain.getInstance()
    };
  }

  public meta() {
    return ColorByTerrain.meta();
  }

  private updateState(updates: Partial<ColorByTerrainState>) {
    this.state = { ...this.state, ...updates };
    this.update();
    this.updateFunction?.();
  }

  private updateFunction?: () => void;

  public settingsPanel(onUpdate?: () => void) {
    const { steepnessThreshold, temperatureSnowThreshold } = this.state;

    this.updateFunction = onUpdate;

    return (
      <div className="color-by-terrain-settings">
        <div>
          <label>Steepness Threshold for Snow: {steepnessThreshold.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={steepnessThreshold}
            onChange={(e) => this.updateState({
              steepnessThreshold: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Temperature Snow Threshold: {temperatureSnowThreshold.toFixed(2)}</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={temperatureSnowThreshold}
            onChange={(e) => this.updateState({
              temperatureSnowThreshold: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
    );
  }
}
