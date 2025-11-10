import { ScaledCoordinate } from "../util/Types";

export enum GeneratorType {
  Height = "Height",
  Water = "Water",
  Sunshine = "Sunshine",
  Wind = "Wind",
  Humidity = "Humidity",
  Temperature = "Temperature",
  Biome = "Biome",
  Color = "Color",
  TerrainSteepness = "TerrainSteepness",
  GroundSolidity = "GroundSolidity",
  OnGroundVegetation = "OnGroundVegetation",
  FinalAssembly = "FinalAssembly"
}

export type GeneratorImplementation = 
  | "Height: Improved fBm" 
  | "Height: Classic fBm" 
  | "Color: by Biome" 
  | "Color: by Height" 
  | "Color: by Humidity"
  | "Color: by Steepness"
  | "Color: by Ground Solidity"
  | "Color: by Sunshine"
  | "Color: by Temperature"
  | "Color: by Terrain"
  | "Sunshine: Perlin" 
  | "Temperature: by Height" 
  | "Temperature: by Height and Sunshine" 
  | "Temperature: by Sunshine" 
  | "Humidity: Perlin"
  | "TerrainSteepness: from Height"
  | "GroundSolidity: Perlin"
  | "OnGroundVegetation: by Humidity, Temperature, Height, Steepness, and Solidity"
  | "World Settings";

export type GeneratorMeta = {
  type: GeneratorType;
  name: GeneratorImplementation;
  dependencies: GeneratorType[];
  constructor: () => Generator<any>;
};

// Abstract generic holder class for array data types
export default abstract class Generator<T> {

  protected static availableGenerators = new Map<GeneratorType, Map<GeneratorImplementation, Generator<any>>>();
  private static dependentGenerators: Map<GeneratorType, Generator<any>[]> = new Map();
  protected static dependencies: Map<GeneratorType, Generator<any>> = new Map();

  static {
    for (const type of Object.values(GeneratorType)) {
      Generator.availableGenerators.set(type, new Map());
      Generator.dependentGenerators.set(type, []);
    }
  }


  protected readonly type: GeneratorType;

  protected constructor(type: GeneratorType) {
    this.type = type;
  }

  public static setDependency(dependencyType: GeneratorType, generator: Generator<any>) {
    Generator.dependencies.set(dependencyType, generator);
    console.log("Setting dependency: " + dependencyType + " to " + generator.meta().name);
  }

  public static setDefaultDependency(dependencyType: GeneratorType, generator: Generator<any>) {
    if (Generator.dependencies.has(dependencyType)) {
      return;
    }
    Generator.dependencies.set(dependencyType, generator);
    console.log("Setting default dependency: " + dependencyType + " to " + generator.meta().name);
  }

  public static registerDependent(dependentGenerator: Generator<any>, dependencyType: GeneratorType) {
    const dependents = Generator.dependentGenerators.get(dependencyType);
    if (dependents && !dependents.includes(dependentGenerator)) {
      dependents.push(dependentGenerator);
    }
  }

  public abstract meta(): GeneratorMeta;
  public dependencyTypes(): GeneratorType[] {
    return this.meta().dependencies;
  }

  public static registerGenerator(generatorMeta: GeneratorMeta) {
    if (Generator.availableGenerators.get(generatorMeta.type)?.has(generatorMeta.name)) {
      return;
    }
    Generator.availableGenerators.get(generatorMeta.type)?.set(generatorMeta.name, generatorMeta.constructor());
  }

  public static dependenciesOf(generator: Generator<any>): Set<Generator<any>> {
    let generators: Set<Generator<any>> = new Set();
    generator.dependencyTypes().forEach(dependencyType => {
      const dependency = Generator.dependencies.get(dependencyType);
      if (!dependency) {
        throw new Error("Dependency " + dependencyType + " not found");
      }
      generators.add(dependency);
      // Generator.dependenciesOf(dependency).forEach(dependency => {
      //   generators.add(dependency);
      // });
    });
    return generators;
  }

  public dependencies(): Set<Generator<any>> {
    return Generator.dependenciesOf(this);
  }

  private static updateDependents(generator: Generator<any>): void {
    Generator.dependentGenerators.get(generator.type)?.forEach((dependent: Generator<any>) => {
      dependent.update();
    });
  } 


  
  /**
   * Returns a panel for the settings of this generator including what dependency generators it's using
   */
  public panel(existing_types: GeneratorType[], onUpdate?: () => void): JSX.Element {
    return (
      <div style={{ paddingBottom: '10px' }}>
        <div style={{ padding: '10px', marginBottom: '10px', border: '1px solid #404040', borderRadius: '4px', backgroundColor: '#202020' }}>
          <h2 className="text-lg font-bold">{this.meta().name}</h2>
          <br />
          {this.settingsPanel(onUpdate)}
          {this.dependenciesPanel(onUpdate)}
        </div>
        {Array.from(this.dependencies().values()).map((generator) => {
          return existing_types.includes(generator.type) ? <div key={generator.type}></div> : <div key={generator.type}>{generator.panel(existing_types.concat(this.dependencyTypes()), onUpdate)}</div>;
        })}
      </div>
    );
  }

  /**
   * Returns a panel with the dependency selectors
   */
  private dependenciesPanel(onUpdate?: () => void): JSX.Element {
    return this.dependencyTypes().length > 0 ? (
      <div>
        <br />
        <h3 className="text-lg font-bold">Dependencies</h3>
        {this.dependencyTypes().map((dependency, index) => (
          <div key={index}>
            {dependency}
            <select value={Generator.dependencies.get(dependency)?.meta().name} onChange={(e) => {
              const selectedGenerator = Generator.availableGenerators.get(dependency)?.get(e.target.value as GeneratorImplementation);
              if (selectedGenerator) {
                Generator.dependencies.set(dependency, selectedGenerator);
                this.update();
                onUpdate?.();
              }
              else {
                console.log("Selected generator not found: " + e.target.value);
              }
            }}
            style={{
              backgroundColor: '#202020',
              color: 'white',
              border: '1px solid #404040',
              borderRadius: '4px',
              padding: '4px',
              width: '100%'
            }}>
              {Array.from(Generator.availableGenerators.get(dependency)!.keys()).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    ) : <div></div>;
  }

  /**
   * Returns a panel with only the settings for this generator, without the dependency selectors
   */
  protected abstract settingsPanel(onUpdate?: () => void): JSX.Element;

  /**
   * The function that builds the map this generator is responsible for
   * <br />
   * To actually get the built tiles, use getTile instead
   * @param coordinates The coordinates of the tile to build
   */
  protected abstract buildTile(coordinates: ScaledCoordinate): T;

  private tileCache: Map<ScaledCoordinate, T> = new Map();

  /**
   * Returns the tile at the given coordinates
   * <br />
   * This will build the tile if it hasn't been built yet
   * @param coordinates The coordinates of the tile to get
   */
  public getTile(coordinates: ScaledCoordinate): T {
    if (this.tileCache.has(coordinates)) {
      return this.tileCache.get(coordinates)!;
    }
    const tile = this.buildTile(coordinates);
    this.tileCache.set(coordinates, tile);
    return tile;
  }

  /**
   * Rebuilds this tile
   */
  public update(): void {
    this.tileCache.forEach((_, coordinates) => {
      this.tileCache.set(coordinates, this.buildTile(coordinates));
    });
    Generator.updateDependents(this);
  }

}
