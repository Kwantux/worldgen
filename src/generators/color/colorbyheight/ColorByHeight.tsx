import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { colorByHeight } from './Functions';

export class ColorByHeight extends Generator<Float32Array> {
  private static instance: ColorByHeight;

  private constructor() {
    super(GeneratorType.Color);
  }

  public static getInstance(): ColorByHeight {
    if (!ColorByHeight.instance) {
      ColorByHeight.instance = new ColorByHeight();
    }
    return ColorByHeight.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);
    if (!heightMap) {
      throw new Error("Height map dependency not met.");
    }
    return colorByHeight(heightMap);
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Color as const,
      name: 'Color: by Height' as const,
      dependencies: [GeneratorType.Height],
      constructor: () => ColorByHeight.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return ColorByHeight.meta();
  }

  public settingsPanel(onUpdate?: () => void) {
    return <></>;
  }
}