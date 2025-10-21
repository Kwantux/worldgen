import React from 'react';
import { LevelOfDetail, ScaledCoordinate } from "../util/Types";
import Generator, { GeneratorMeta, GeneratorType } from "./Generator";
import { Tile } from "../components/terrain/Tile";
export type WorldData = [Float32Array, Float32Array];

export default class FinalAssembly extends Generator<WorldData> {

    private static instance: FinalAssembly;

    private tiles: Map<ScaledCoordinate, Tile> = new Map();
    private radius: number = 1;

    private updateFunction?: () => void;

    public setUpdateFunction(updateFunction: () => void): void {
        this.updateFunction = updateFunction;
    }

    protected settingsPanel(onUpdate?: () => void): JSX.Element {
        return (
            <div>
                <label>Radius of World (in Tiles):</label>
                <input
                    type="number"
                    value={this.radius}
                    onChange={(e) => {
                        this.setRadius((e.target as HTMLInputElement).valueAsNumber);
                        onUpdate?.();
                    }}
                    style={{ backgroundColor: '#2b2a33', padding: '4px', width: '100%' }}
                />
            </div>
        );
    }

    protected buildTile(coordinates: ScaledCoordinate): WorldData {
        const heightMap = Generator.dependencies.get(GeneratorType.Height)?.getTile(coordinates);
        const colorMap = Generator.dependencies.get(GeneratorType.Color)?.getTile(coordinates);
        return [heightMap!, colorMap!];
    }

    private constructor() {
        console.log(Generator.availableGenerators);
        super(GeneratorType.FinalAssembly, new Map(
            [
                [GeneratorType.Height, Generator.availableGenerators.get(GeneratorType.Height)!.get("Height: Warped fBm")!],
                [GeneratorType.Color, Generator.availableGenerators.get(GeneratorType.Color)!.get("Color: by Height")!]
            ]
        ));
        this.generateTiles(this.radius);
    }

    public static getInstance(): FinalAssembly {
        if (!FinalAssembly.instance) {
            FinalAssembly.instance = new FinalAssembly();
        }
        return FinalAssembly.instance;
    }
    
    public static meta(): GeneratorMeta {
        return {
            type: GeneratorType.FinalAssembly,
            name: "World Settings",
            dependencies: [GeneratorType.Height, GeneratorType.Color],
            constructor: () => FinalAssembly.getInstance()
        }
    }

    public meta(): GeneratorMeta {
        return FinalAssembly.meta();
    }

    /**
     * Rendering panel for tiles, similar to settingsPanel
     */
    public renderTiles(): JSX.Element {
        return (
            <React.Fragment>
                {Array.from(this.tiles.values()).map((tile) => {
                    return tile.render();
                })}
            </React.Fragment>
        );
    }

    private setRadius(newRadius: number): void {
        if (Number.isNaN(newRadius) || newRadius < 0) {
            return;
        }
        this.radius = newRadius;
        this.generateTiles(this.radius);
        this.update();
    }

    private generateTiles(radius: number): void {
        this.tiles.clear();
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                const coord: ScaledCoordinate = { coordinate: [x, y], levelOfDetail: new LevelOfDetail(0) };
                const tile = new Tile(coord);
                this.tiles.set(coord, tile);
            }
        }
    }

    /**
     * Rebuilds all tiles and pushes data to the rendered Tile components
     */
    public update() {
        console.log("[FinalAssembly] Updating tiles");
        // Rebuild and push data for all known coordinates
        this.tiles.forEach((tile, coordinates) => {
            const [heightMap, colorMap] = this.buildTile(coordinates);
            tile.setHeightMap(heightMap);
            tile.setColorMap(colorMap);
        });

        this.updateFunction?.();
    }
}
        
    
    
