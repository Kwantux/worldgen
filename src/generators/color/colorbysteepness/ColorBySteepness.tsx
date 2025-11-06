import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { colorBySteepness } from './Functions';

export class ColorBySteepness extends Generator<Float32Array> {
  private static instance: ColorBySteepness;

  private constructor() {
    super(GeneratorType.Color);
  }

  public static getInstance(): ColorBySteepness {
    if (!ColorBySteepness.instance) {
      ColorBySteepness.instance = new ColorBySteepness();
    }
    return ColorBySteepness.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const steepnessMap = Generator.dependencies.get(GeneratorType.TerrainSteepness)?.getTile(coordinates);
    if (!steepnessMap) {
      throw new Error("Terrain steepness map dependency not met.");
    }
    return colorBySteepness(steepnessMap);
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Color as const,
      name: 'Color: by Steepness' as const,
      dependencies: [GeneratorType.TerrainSteepness],
      constructor: () => ColorBySteepness.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return ColorBySteepness.meta();
  }

  public settingsPanel(_onUpdate?: () => void) {
    return <></>;
  }
}
