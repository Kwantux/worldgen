import Generator, { GeneratorType } from "../logic/Generator";
import FinalAssembly from "../logic/FinalAssembly";
import { ImprovedFBM } from "./height/improvedfbm/ImprovedFBM";
import { ClassicFBM } from "./height/classicfbm/ClassicFBM";
import { ColorByHeight } from "./color/colorbyheight/ColorByHeight";
import { ColorByTerrain } from "./color/colorbyterrain/ColorByTerrain";
import { PerlinSunshine } from "./sunshine/perlin/PerlinSunshine";
import { TemperatureByHeight } from "./temperature/temperaturebyheight/TemperatureByHeight";
import { TemperatureBySunshine } from "./temperature/temperaturebysunshine/TemperatureBySunshine";
import { PerlinHumidity } from "./humidity/perlin/PerlinHumidity";
import { TemperatureByHeightAndSunshine } from "./temperature/temperaturebysunshineandheight/TemperatureBySunshineAndHeight";
import { TerrainSteepness } from "./terrainsteepness/TerrainSteepness";
import { GroundSolidity } from "./groundsolidity/GroundSolidity";
import { OnGroundVegetation } from "./ongroundvegetation/OnGroundVegetation";
import { ColorByHumidity } from "./color/colorbyhumidity/ColorByHumidity";
import { ColorBySunshine } from "./color/colorbysunshine/ColorBySunshine";
import { ColorBySteepness } from "./color/colorbysteepness/ColorBySteepness";
import { ColorByGroundSolidity } from "./color/colorbysolidity/ColorByGroundSolidity";
import { ColorByTemperature } from "./color/colorbytemperature/ColorByTemperature";

export const registerGenerators = () => {
    // Register height map generators
    Generator.registerGenerator(ImprovedFBM.meta());
    Generator.registerGenerator(ClassicFBM.meta());

    // Register color map generators
    Generator.registerGenerator(ColorByTerrain.meta());
    Generator.registerGenerator(ColorByHeight.meta());
    Generator.registerGenerator(ColorByHumidity.meta());
    Generator.registerGenerator(ColorByTemperature.meta());
    Generator.registerGenerator(ColorBySunshine.meta());
    Generator.registerGenerator(ColorBySteepness.meta());
    Generator.registerGenerator(ColorByGroundSolidity.meta());

    // Register sunshine generators
    Generator.registerGenerator(PerlinSunshine.meta());

    // Register temperature generators
    Generator.registerGenerator(TemperatureByHeight.meta());
    Generator.registerGenerator(TemperatureByHeightAndSunshine.meta());
    Generator.registerGenerator(TemperatureBySunshine.meta());

    // Register humidity generators
    Generator.registerGenerator(PerlinHumidity.meta());

    // Register terrain steepness processor
    Generator.registerGenerator(TerrainSteepness.meta());

    // Register ground solidity generator
    Generator.registerGenerator(GroundSolidity.meta());

    // Register vegetation generators
    Generator.registerGenerator(OnGroundVegetation.meta());

    // Register final assembly
    Generator.registerGenerator(FinalAssembly.meta());

    // Set default dependencies for all generators
    setDefaultDependencies();
};

const setDefaultDependencies = () => {
    // Set default dependencies - each type should have exactly one default
    Generator.setDefaultDependency(GeneratorType.Height, ImprovedFBM.getInstance());
    Generator.setDefaultDependency(GeneratorType.Sunshine, PerlinSunshine.getInstance());
    Generator.setDefaultDependency(GeneratorType.Temperature, TemperatureByHeightAndSunshine.getInstance());
    Generator.setDefaultDependency(GeneratorType.Humidity, PerlinHumidity.getInstance());
    Generator.setDefaultDependency(GeneratorType.TerrainSteepness, TerrainSteepness.getInstance());
    Generator.setDefaultDependency(GeneratorType.GroundSolidity, GroundSolidity.getInstance());
    Generator.setDefaultDependency(GeneratorType.OnGroundVegetation, OnGroundVegetation.getInstance());
    Generator.setDefaultDependency(GeneratorType.Color, ColorByTerrain.getInstance());

    // Register dependents - which generators depend on which types
    // ColorByTerrain depends on: GroundSolidity, TerrainSteepness, OnGroundVegetation, Temperature
    Generator.registerDependent(ColorByTerrain.getInstance(), GeneratorType.GroundSolidity);
    Generator.registerDependent(ColorByTerrain.getInstance(), GeneratorType.TerrainSteepness);
    Generator.registerDependent(ColorByTerrain.getInstance(), GeneratorType.OnGroundVegetation);
    Generator.registerDependent(ColorByTerrain.getInstance(), GeneratorType.Temperature);

    // TemperatureByHeightAndSunshine depends on: Height, Sunshine
    Generator.registerDependent(TemperatureByHeightAndSunshine.getInstance(), GeneratorType.Height);
    Generator.registerDependent(TemperatureByHeightAndSunshine.getInstance(), GeneratorType.Sunshine);

    // TerrainSteepness depends on: Height
    Generator.registerDependent(TerrainSteepness.getInstance(), GeneratorType.Height);

    // OnGroundVegetation depends on: Humidity, Temperature, Height, TerrainSteepness, GroundSolidity
    Generator.registerDependent(OnGroundVegetation.getInstance(), GeneratorType.Humidity);
    Generator.registerDependent(OnGroundVegetation.getInstance(), GeneratorType.Temperature);
    Generator.registerDependent(OnGroundVegetation.getInstance(), GeneratorType.Height);
    Generator.registerDependent(OnGroundVegetation.getInstance(), GeneratorType.TerrainSteepness);
    Generator.registerDependent(OnGroundVegetation.getInstance(), GeneratorType.GroundSolidity);

    // FinalAssembly depends on: Height, Color, Temperature
    Generator.registerDependent(FinalAssembly.getInstance(), GeneratorType.Height);
    Generator.registerDependent(FinalAssembly.getInstance(), GeneratorType.Color);
    Generator.registerDependent(FinalAssembly.getInstance(), GeneratorType.Temperature);
}