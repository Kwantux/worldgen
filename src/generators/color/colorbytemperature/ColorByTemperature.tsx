import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { colorByTemperature } from './Functions';

export class ColorByTemperature extends Generator<Float32Array> {
  private static instance: ColorByTemperature;

  private constructor() {
    super(GeneratorType.Color);
  }

  public static getInstance(): ColorByTemperature {
    if (!ColorByTemperature.instance) {
      ColorByTemperature.instance = new ColorByTemperature();
    }
    return ColorByTemperature.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const temperatureMap = Generator.dependencies.get(GeneratorType.Temperature)?.getTile(coordinates);
    if (!temperatureMap) {
      throw new Error("Temperature map dependency not met.");
    }
    return colorByTemperature(temperatureMap);
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Color as const,
      name: 'Color: by Temperature' as const,
      dependencies: [GeneratorType.Temperature],
      constructor: () => ColorByTemperature.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return ColorByTemperature.meta();
  }

  public settingsPanel(_onUpdate?: () => void) {
    return <></>;
  }
}
