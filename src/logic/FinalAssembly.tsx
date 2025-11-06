import React from 'react';
import { LevelOfDetail, ScaledCoordinate } from "../util/Types";
import Generator, { GeneratorMeta, GeneratorType } from "./Generator";
import { Tile } from "../components/terrain/Tile";
export type WorldData = [Float32Array, Float32Array];

export default class FinalAssembly extends Generator<WorldData> {

    private static instance: FinalAssembly;

    private tiles: Map<ScaledCoordinate, Tile> = new Map();
    private ringSize: number = 4;
    private levelsOfDetail = 1;

    private updateFunction?: () => void;

    public setUpdateFunction(updateFunction: () => void): void {
        this.updateFunction = updateFunction;
    }

    protected settingsPanel(onUpdate?: () => void): JSX.Element {
        return (
            <div>
                <label>Ring Size:</label>
                <input
                    type="number"
                    value={this.ringSize}
                    onChange={(e) => {
                        this.setRingSize((e.target as HTMLInputElement).valueAsNumber);
                        onUpdate?.();
                    }}
                    style={{ backgroundColor: '#2b2a33', padding: '4px', width: '100%' }}
                />
                <label>Levels of Detail:</label>
                <input
                    type="number"
                    value={this.levelsOfDetail}
                    onChange={(e) => {
                        this.setLevelsOfDetail((e.target as HTMLInputElement).valueAsNumber);
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
        super(GeneratorType.FinalAssembly);
        this.generateTiles(this.ringSize, this.levelsOfDetail);
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
            dependencies: [GeneratorType.Height, GeneratorType.Color, GeneratorType.Temperature],
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

    private setRingSize(newRingSize: number): void {
        if (Number.isNaN(newRingSize) || newRingSize < 0) {
            return;
        }
        this.ringSize = newRingSize;
        this.generateTiles(this.ringSize, this.levelsOfDetail);
        this.update();
    }

    private setLevelsOfDetail(newLevelsOfDetail: number): void {
        if (Number.isNaN(newLevelsOfDetail) || newLevelsOfDetail < 0) {
            return;
        }
        this.levelsOfDetail = newLevelsOfDetail;
        this.generateTiles(this.ringSize, this.levelsOfDetail);
        this.update();
    }

    private generateTiles(ringSize: number, levelsOfDetail: number): void {
        this.tiles.clear();
        for (let i = 0; i < levelsOfDetail; i++) {
            const upperBoundry = 2*ringSize -1
            const lowerBoundry = -2*ringSize
            for (let y = lowerBoundry; y <= upperBoundry; y++) {
                for (let x = lowerBoundry; x <= upperBoundry; x++) {
                    if (i > 0 && x > -ringSize-1 && x < ringSize && y > -ringSize-1 && y < ringSize) {
                        continue;
                    }
                    const coord: ScaledCoordinate = { coordinate: [x, y], levelOfDetail: new LevelOfDetail(i) };
                    const tile = new Tile(coord);
                    this.tiles.set(coord, tile);
                }
            }
        }
    }

    /**
     * Rebuilds all tiles and pushes data to the rendered Tile components
     */
    public update() {
        // Rebuild and push data for all known coordinates
        this.tiles.forEach((tile, coordinates) => {
            const [heightMap, colorMap] = this.buildTile(coordinates);
            tile.setHeightMap(heightMap);
            tile.setColorMap(colorMap);
        });

        this.updateFunction?.();
    }
}
        
    
    
