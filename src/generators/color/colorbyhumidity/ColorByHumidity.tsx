import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { colorByHumidity } from './Functions';

export class ColorByHumidity extends Generator<Float32Array> {
  private static instance: ColorByHumidity;

  private constructor() {
    super(GeneratorType.Color);
  }

  public static getInstance(): ColorByHumidity {
    if (!ColorByHumidity.instance) {
      ColorByHumidity.instance = new ColorByHumidity();
    }
    return ColorByHumidity.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const humidityMap = Generator.dependencies.get(GeneratorType.Humidity)?.getTile(coordinates);
    if (!humidityMap) {
      throw new Error("Humidity map dependency not met.");
    }
    return colorByHumidity(humidityMap);
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Color as const,
      name: 'Color: by Humidity' as const,
      dependencies: [GeneratorType.Humidity],
      constructor: () => ColorByHumidity.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return ColorByHumidity.meta();
  }

  public settingsPanel(_onUpdate?: () => void) {
    return <></>;
  }
}
