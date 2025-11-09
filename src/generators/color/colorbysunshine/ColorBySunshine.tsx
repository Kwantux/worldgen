import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { colorBySunshine } from './Functions';

export class ColorBySunshine extends Generator<Float32Array> {
  private static instance: ColorBySunshine;

  private constructor() {
    super(GeneratorType.Color);
  }

  public static getInstance(): ColorBySunshine {
    if (!ColorBySunshine.instance) {
      ColorBySunshine.instance = new ColorBySunshine();
    }
    return ColorBySunshine.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const sunshineMap = Generator.dependencies.get(GeneratorType.Sunshine)?.getTile(coordinates);
    if (!sunshineMap) {
      throw new Error("Sunshine map dependency not met.");
    }
    return colorBySunshine(sunshineMap);
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Color as const,
      name: 'Color: by Sunshine' as const,
      dependencies: [GeneratorType.Sunshine],
      constructor: () => ColorBySunshine.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return ColorBySunshine.meta();
  }

  public settingsPanel(_onUpdate?: () => void) {
    return <></>;
  }
}
