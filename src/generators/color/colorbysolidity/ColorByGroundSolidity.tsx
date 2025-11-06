import Generator, { GeneratorMeta } from '../../../logic/Generator';
import { GeneratorType } from '../../../logic/Generator';
import { ScaledCoordinate } from '../../../util/Types';
import { colorByGroundSolidity } from './Functions';

export class ColorByGroundSolidity extends Generator<Float32Array> {
  private static instance: ColorByGroundSolidity;

  private constructor() {
    super(GeneratorType.Color);
  }

  public static getInstance(): ColorByGroundSolidity {
    if (!ColorByGroundSolidity.instance) {
      ColorByGroundSolidity.instance = new ColorByGroundSolidity();
    }
    return ColorByGroundSolidity.instance;
  }

  protected buildTile(coordinates: ScaledCoordinate): Float32Array {
    const solidityMap = Generator.dependencies.get(GeneratorType.GroundSolidity)?.getTile(coordinates);
    if (!solidityMap) {
      throw new Error("Ground solidity map dependency not met.");
    }
    return colorByGroundSolidity(solidityMap);
  }

  public static meta(): GeneratorMeta {
    return {
      type: GeneratorType.Color as const,
      name: 'Color: by Ground Solidity' as const,
      dependencies: [GeneratorType.GroundSolidity],
      constructor: () => ColorByGroundSolidity.getInstance()
    };
  }

  public meta(): GeneratorMeta {
    return ColorByGroundSolidity.meta();
  }

  public settingsPanel(_onUpdate?: () => void) {
    return <></>;
  }
}
