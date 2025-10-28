import Generator from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';

export class TemperatureBySunshine extends Generator<Float32Array> {
  private static instance: TemperatureBySunshine;

  private constructor() {
    super(GeneratorType.Temperature, new Map([
      [GeneratorType.Sunshine, Generator.availableGenerators.get(GeneratorType.Sunshine)!.get("Sunshine: Perlin")!]
    ]));
  }

  public static getInstance(): TemperatureBySunshine {
    if (!TemperatureBySunshine.instance) {
      TemperatureBySunshine.instance = new TemperatureBySunshine();
    }
    return TemperatureBySunshine.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const sunshineMap = Generator.dependencies.get(GeneratorType.Sunshine)?.getTile(coordinates);
    if (!sunshineMap) {
      throw new Error("Sunshine map dependency not met.");
    }
    return sunshineMap;
  }

  public static meta() {
    return {
      type: GeneratorType.Temperature,
      name: 'Temperature: by Sunshine' as const,
      dependencies: [GeneratorType.Sunshine],
      constructor: () => TemperatureBySunshine.getInstance()
    };
  }

  public meta() {
    return TemperatureBySunshine.meta();
  }

  public settingsPanel(onUpdate?: () => void) {
    return <></>;
  }
}