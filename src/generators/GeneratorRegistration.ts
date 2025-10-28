import Generator from "../logic/Generator";
import FinalAssembly from "../logic/FinalAssembly";
import { WarpedFBM } from "./height/warpedfbm/WarpedFBM";
import { ClassicFBM } from "./height/classicfbm/ClassicFBM";
import { ColorByHeight } from "./color/colorbyheight/ColorByHeight";
import { PerlinSunshine } from "./perlinsunshine/PerlinSunshine";
import { TemperatureByHeight } from "./temperature/temperaturebyheight/TemperatureByHeight";
import { TemperatureBySunshine } from "./temperature/temperaturebysunshine/TemperatureBySunshine";
import { PerlinHumidity } from "./humidity/perlin/PerlinHumidity";
import { TemperatureByHeightAndSunshine } from "./temperature/temperaturebysunshineandheight/TemperatureBySunshineAndHeight";

export const registerGenerators = () => {
    // Register height map generators
    Generator.registerGenerator(WarpedFBM.meta());

    Generator.registerGenerator(ClassicFBM.meta());

    // Register color map generators
    Generator.registerGenerator(ColorByHeight.meta());

    // Register sunshine generators
    Generator.registerGenerator(PerlinSunshine.meta());

    // Register temperature generators
    Generator.registerGenerator(TemperatureByHeight.meta());
    Generator.registerGenerator(TemperatureByHeightAndSunshine.meta());
    Generator.registerGenerator(TemperatureBySunshine.meta());

    // Register humidity generators
    Generator.registerGenerator(PerlinHumidity.meta());

    // Register final assembly
    Generator.registerGenerator(FinalAssembly.meta());
}