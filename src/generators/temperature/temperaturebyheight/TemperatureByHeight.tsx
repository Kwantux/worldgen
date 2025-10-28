import Generator from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';

export class TemperatureByHeight extends Generator<Float32Array> {
  private static instance: TemperatureByHeight;

  private constructor() {
    super(GeneratorType.Temperature, new Map([
      [GeneratorType.Height, Generator.availableGenerators.get(GeneratorType.Height)!.get("Height: Classic fBm")!]
    ]));
  }

  public static getInstance(): TemperatureByHeight {
    if (!TemperatureByHeight.instance) {
      TemperatureByHeight.instance = new TemperatureByHeight();
    }
    return TemperatureByHeight.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);
    if (!heightMap) {
      throw new Error("Height map dependency not met.");
    }

    const data = new Float32Array(heightMap.length);
    const max = Math.max(...heightMap);
    const min = Math.min(...heightMap);

    for (let i = 0; i < heightMap.length; i++) {
      data[i] = 1 - ((heightMap[i] - min) / (max - min));
    }
    return data;
  }

  public static meta() {
    return {
      type: GeneratorType.Temperature,
      name: 'Temperature: by Height' as const,
      dependencies: [GeneratorType.Height],
      constructor: () => TemperatureByHeight.getInstance()
    };
  }

  public meta() {
    return TemperatureByHeight.meta();
  }

  public settingsPanel(onUpdate?: () => void) {
    return <></>;
  }
}