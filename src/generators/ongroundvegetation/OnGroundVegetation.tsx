import Generator from '../../logic/Generator';
import { GeneratorType } from '../../logic/Generator';
import { ScaledCoordinate } from '../../util/Types';
import { VegetationTile, createVegetationTile } from './VegetationData';

type OnGroundVegetationState = {
  humidityWeight: number;
  temperatureWeight: number;
  steepnessWeight: number;
  solidityWeight: number;
  optimalTemperature: number;
  optimalHumidity: number;
  maxSteepness: number;
  optimalSolidity: number;
  humidityScale: number;
  temperatureScale: number;
  steepnessScale: number;
  solidityScale: number;
};

export class OnGroundVegetation extends Generator<VegetationTile> {
  protected buildTile(coordinates: ScaledCoordinate): VegetationTile {
    const humidityMap = Generator.dependencies.get(GeneratorType.Humidity)?.getTile(coordinates);
    const temperatureMap = Generator.dependencies.get(GeneratorType.Temperature)?.getTile(coordinates);
    const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);
    const steepnessMap = Generator.dependencies.get(GeneratorType.TerrainSteepness)?.getTile(coordinates);
    const solidityMap = Generator.dependencies.get(GeneratorType.GroundSolidity)?.getTile(coordinates);

    if (!humidityMap || !temperatureMap || !heightMap || !steepnessMap || !solidityMap) {
      throw new Error("Humidity, Temperature, Height, TerrainSteepness, and/or GroundSolidity map dependency not met.");
    }

    const vegetation = createVegetationTile(humidityMap.length);
    const { 
      humidityWeight, temperatureWeight, steepnessWeight, solidityWeight,
      optimalTemperature, optimalHumidity, maxSteepness, optimalSolidity,
      humidityScale, temperatureScale, steepnessScale, solidityScale
    } = this.state;

    const totalWeight = humidityWeight + temperatureWeight + steepnessWeight + solidityWeight;

    for (let i = 0; i < humidityMap.length; i++) {
      // Scale raw values without normalization
      const humidity = Math.max(0, Math.min(1, humidityMap[i] * humidityScale));

      const temperature = Math.max(0, Math.min(1, temperatureMap[i] * temperatureScale));
      const steepness = Math.max(0, Math.min(1, steepnessMap[i] * steepnessScale));
      const solidity = Math.max(0, Math.min(1, solidityMap[i] * solidityScale));

      // Calculate scores based on optimal conditions
      const humidityScore = 1 - Math.abs(humidity - optimalHumidity);
      const temperatureScore = 1 - Math.abs(temperature - optimalTemperature);
      const steepnessScore = steepness <= maxSteepness ? 1 - (steepness / maxSteepness) : 0;
      const solidityScore = 1 - Math.abs(solidity - optimalSolidity);
      const solidityFactor = 1 - Math.pow(solidity, 3);

      // Weighted combination for vegetation potential
      const vegetationPotential = (
        humidityScore * humidityWeight +
        temperatureScore * temperatureWeight +
        steepnessScore * steepnessWeight +
        solidityScore * solidityWeight
      ) * solidityFactor / totalWeight;

      // Height is determined by humidity and solidity (more soil = taller grass)
      vegetation.height[i] = vegetationPotential * (0.3 + solidity * 0.7);

      // Area coverage is determined by overall potential
      vegetation.area[i] = Math.max(0, vegetationPotential);

      // Greenness is determined by humidity (more moisture = more vibrant green)
      vegetation.greenness[i] = humidity;
    }

    return vegetation;
  }

  private state: OnGroundVegetationState;
  private static instance: OnGroundVegetation;

  private constructor() {
    super(GeneratorType.OnGroundVegetation);
    this.state = {
      humidityWeight: 0.25,
      temperatureWeight: 0.25,
      steepnessWeight: 0.25,
      solidityWeight: 0.25,
      optimalTemperature: 0.5,
      optimalHumidity: 0.6,
      maxSteepness: 0.3,
      optimalSolidity: 0.5,
      humidityScale: 1,
      temperatureScale: 1,
      steepnessScale: 1,
      solidityScale: 1
    };
  }

  public static getInstance(): OnGroundVegetation {
    if (!OnGroundVegetation.instance) {
      OnGroundVegetation.instance = new OnGroundVegetation();
    }
    return OnGroundVegetation.instance;
  }

  public static meta() {
    return {
      type: GeneratorType.OnGroundVegetation,
      name: 'OnGroundVegetation: by Humidity, Temperature, Height, Steepness, and Solidity' as const,
      dependencies: [GeneratorType.Humidity, GeneratorType.Temperature, GeneratorType.Height, GeneratorType.TerrainSteepness, GeneratorType.GroundSolidity],
      constructor: () => OnGroundVegetation.getInstance()
    };
  }

  public meta() {
    return OnGroundVegetation.meta();
  }

  private updateState(updates: Partial<OnGroundVegetationState>) {
    this.state = { ...this.state, ...updates };
    this.update();
    this.updateFunction?.();
  }

  private updateFunction?: () => void;

  public settingsPanel(onUpdate?: () => void) {
    const { 
      humidityWeight, temperatureWeight, steepnessWeight, solidityWeight,
      optimalTemperature, optimalHumidity, maxSteepness, optimalSolidity,
      humidityScale, temperatureScale, steepnessScale, solidityScale
    } = this.state;

    this.updateFunction = onUpdate;

    return (
      <div className="on-ground-vegetation-settings">
        <h3>Weights</h3>
        <div>
          <label>Humidity Weight: {humidityWeight.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={humidityWeight}
            onChange={(e) => this.updateState({
              humidityWeight: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Temperature Weight: {temperatureWeight.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={temperatureWeight}
            onChange={(e) => this.updateState({
              temperatureWeight: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Steepness Weight: {steepnessWeight.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={steepnessWeight}
            onChange={(e) => this.updateState({
              steepnessWeight: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Solidity Weight: {solidityWeight.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={solidityWeight}
            onChange={(e) => this.updateState({
              solidityWeight: parseFloat(e.target.value)
            })}
          />
        </div>

        <h3>Optimal Conditions</h3>
        <div>
          <label>Optimal Temperature: {optimalTemperature.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={optimalTemperature}
            onChange={(e) => this.updateState({
              optimalTemperature: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Optimal Humidity: {optimalHumidity.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={optimalHumidity}
            onChange={(e) => this.updateState({
              optimalHumidity: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Max Steepness: {maxSteepness.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={maxSteepness}
            onChange={(e) => this.updateState({
              maxSteepness: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Optimal Solidity: {optimalSolidity.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={optimalSolidity}
            onChange={(e) => this.updateState({
              optimalSolidity: parseFloat(e.target.value)
            })}
          />
        </div>

        <h3>Scaling</h3>
        <div>
          <label>Humidity Scale: {humidityScale.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={humidityScale}
            onChange={(e) => this.updateState({
              humidityScale: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Temperature Scale: {temperatureScale.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={temperatureScale}
            onChange={(e) => this.updateState({
              temperatureScale: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Steepness Scale: {steepnessScale.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={steepnessScale}
            onChange={(e) => this.updateState({
              steepnessScale: parseFloat(e.target.value)
            })}
          />
        </div>

        <div>
          <label>Solidity Scale: {solidityScale.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={solidityScale}
            onChange={(e) => this.updateState({
              solidityScale: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
    );
  }
}
