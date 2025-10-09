import { registerGenerators } from "../generators/GeneratorRegistration";
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
  FinalAssembly = "FinalAssembly"
}

export type GeneratorImplementation = "Height: Warped fBm" | "Height: Classic fBm" | "Color: by Biome" | "Color: by Height" | "World Settings";
export type GeneratorMeta = {
  type: GeneratorType;
  name: GeneratorImplementation;
  dependencies: GeneratorType[];
  constructor: () => Generator<any>;
};

// Abstract generic holder class for array data types
export default abstract class Generator<T> {

  protected static availableGenerators = new Map<GeneratorType, Map<GeneratorImplementation, Generator<any>>>();

  static {
    for (const type of Object.values(GeneratorType)) {
      Generator.availableGenerators.set(type, new Map());
    }
  }

  private static reverseDependencies: Map<Generator<any>, Generator<any>[]> = new Map();

  protected readonly type: GeneratorType;
  protected dependencies: Map<GeneratorType, Generator<any>> = new Map();

  protected constructor(type: GeneratorType, defaultDependencies: Map<GeneratorType, Generator<any>>) {
    this.type = type;
    this.dependencies = defaultDependencies;
    this.dependencies.forEach(dependency => {
      console.log("Adding dependency: " + dependency.type + " to " + this.meta().name);
      Generator.reverseDependencies.get(dependency)?.push(this);
    });
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
    generator.dependencies.forEach(dependency => {
      generators.add(dependency);
      Generator.dependenciesOf(dependency).forEach(dependency => {
        generators.add(dependency);
      });
    });
    return generators;
  }

  private static updateDependents(generator: Generator<any>): void {
    Generator.reverseDependencies.get(generator)?.forEach(dependent => {
      dependent.update();
    });
  } 


  
  /**
   * Returns a panel for the settings of this generator including what dependency generators it's using
   */
  public panel(existing_types: GeneratorType[]): JSX.Element {
    return (
      <div style={{ paddingBottom: '10px' }}>
        <div style={{ padding: '10px', marginBottom: '10px', border: '1px solid #404040', borderRadius: '4px', backgroundColor: '#202020' }}>
          <h2 className="text-lg font-bold">{this.meta().name}</h2>
          <br />
          {this.settingsPanel()}
          {this.dependenciesPanel()}
        </div>
        {Array.from(this.dependencies.entries()).map(([type,generator]) => {
          return existing_types.includes(type) ? <div key={type}></div> : <div key={type}>{generator.panel(existing_types.concat(Array.from(this.dependencies.keys())))}</div>;
        })}
      </div>
    );
  }

  /**
   * Returns a panel with the dependency selectors
   */
  private dependenciesPanel(): JSX.Element {
    return this.dependencies.size > 0 ? (
      <div>
        <br />
        <h3 className="text-lg font-bold">Dependencies</h3>
        {this.dependencyTypes().map((dependency, index) => (
          <div key={index}>
            {dependency}
            <select value={this.dependencies.get(dependency)?.type} onChange={(e) => {
              const selectedGenerator = Generator.availableGenerators.get(dependency)?.get(e.target.value as GeneratorImplementation);
              if (selectedGenerator) {
                Generator.reverseDependencies.get(this.dependencies.get(dependency)!)?.filter(generator => generator !== this);
                this.dependencies.set(dependency, selectedGenerator);
                Generator.reverseDependencies.get(selectedGenerator)?.push(this);
                this.update();
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
  protected abstract settingsPanel(): JSX.Element;

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
   * Rebuilds all tiles
   */
  public update(): void {
    this.tileCache.clear();
    this.tileCache.forEach((_, coordinates) => {
      this.buildTile(coordinates);
    });
    Generator.updateDependents(this);
  }
}
