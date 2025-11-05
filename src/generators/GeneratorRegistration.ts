import Generator, { GeneratorType } from "../logic/Generator";
import FinalAssembly from "../logic/FinalAssembly";
import { WarpedFBM } from "./height/warpedfbm/WarpedFBM";
import { ClassicFBM } from "./height/classicfbm/ClassicFBM";
import { ColorByHeight } from "./color/colorbyheight/ColorByHeight";
import { ColorByTerrain } from "./color/colorbyterrain/ColorByTerrain";
import { PerlinSunshine } from "./perlinsunshine/PerlinSunshine";
import { TemperatureByHeight } from "./temperature/temperaturebyheight/TemperatureByHeight";
import { TemperatureBySunshine } from "./temperature/temperaturebysunshine/TemperatureBySunshine";
import { PerlinHumidity } from "./humidity/perlin/PerlinHumidity";
import { TemperatureByHeightAndSunshine } from "./temperature/temperaturebysunshineandheight/TemperatureBySunshineAndHeight";
import { TerrainSteepness } from "./terrainsteepness/TerrainSteepness";
import { GroundSolidity } from "./groundsolidity/GroundSolidity";
import { OnGroundVegetation } from "./ongroundvegetation/OnGroundVegetation";

export const registerGenerators = () => {
    // Register height map generators
    Generator.registerGenerator(WarpedFBM.meta());
    Generator.registerGenerator(ClassicFBM.meta());

    // Register color map generators
    Generator.registerGenerator(ColorByHeight.meta());
    Generator.registerGenerator(ColorByTerrain.meta());

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
    Generator.setDependency(GeneratorType.Height, WarpedFBM.getInstance());
    Generator.setDependency(GeneratorType.Sunshine, PerlinSunshine.getInstance());
    Generator.setDependency(GeneratorType.Temperature, TemperatureByHeightAndSunshine.getInstance());
    Generator.setDependency(GeneratorType.Humidity, PerlinHumidity.getInstance());
    Generator.setDependency(GeneratorType.TerrainSteepness, TerrainSteepness.getInstance());
    Generator.setDependency(GeneratorType.GroundSolidity, GroundSolidity.getInstance());
    Generator.setDependency(GeneratorType.OnGroundVegetation, OnGroundVegetation.getInstance());
    Generator.setDependency(GeneratorType.Color, ColorByTerrain.getInstance());

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