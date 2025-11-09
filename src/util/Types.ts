export type Coordinate = [number, number];
export class LevelOfDetail {
    levelOfDetail: number;
    constructor(levelOfDetail: number) {
        this.levelOfDetail = levelOfDetail;
    }
    scale(): number {
        return Math.pow(2, this.levelOfDetail);
    }
    lod(): number {
        return this.levelOfDetail;
    }
}
export type ScaledCoordinate = {
    coordinate: Coordinate;
    levelOfDetail: LevelOfDetail;
};

export type HeightMap = Float32Array;
export type ColorMap = Float32Array;
export type WaterMap = Float32Array;
export type SunshineMap = Float32Array;
export type WindMap = Float32Array;
export type PrecipitationMap = Float32Array;
export type TemperatureMap = Float32Array;
export type HumidityMap = Float32Array;
export type BiomeMap = Int16Array;