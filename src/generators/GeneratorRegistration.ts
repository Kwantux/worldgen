import FinalAssembly from "../logic/FinalAssembly";
import Generator from "../logic/Generator";
import { WarpedFBM } from "./height/warpedfbm/WarpedFBM";
import { ClassicFBM } from "./height/classicfbm/ClassicFBM";
import { ColorByHeight } from "./color/colorbyheight/ColorByHeight";
import { PerlinSunshine } from "./perlinsunshine/PerlinSunshine";
import { TemperatureByHeight } from "./temperature/temperaturebyheight/TemperatureByHeight";
import { TemperatureByHeightAndSunshine } from "./temperature/temperaturebysunshineandheight/TemperatureBySunshineAndHeight";
import { TemperatureBySunshine } from "./temperature/temperaturebysunshine/TemperatureBySunshine";

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

    // Register final assembly
    Generator.registerGenerator(FinalAssembly.meta());
}