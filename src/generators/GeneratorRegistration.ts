import FinalAssembly from "../logic/FinalAssembly";
import Generator from "../logic/Generator";
import { WarpedFBM } from "./height/warpedfbm/WarpedFBM";
import { ClassicFBM } from "./height/classicfbm/ClassicFBM";
import { ColorByHeight } from "./color/colorbyheight/ColorByHeight";

export const registerGenerators = () => {
    // Register height map generators
    Generator.registerGenerator(WarpedFBM.meta());

    Generator.registerGenerator(ClassicFBM.meta());

    // Register color map generators
    Generator.registerGenerator(ColorByHeight.meta());

    // Register final assembly
    Generator.registerGenerator(FinalAssembly.meta());
}