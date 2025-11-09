import React from 'react';
import * as THREE from 'three';
import { ScaledCoordinate } from '../../util/Types';

export const BASE_MESH_SIZE = 50;
export const INCREMENT = 64;
export const SEGMENTS = INCREMENT + 1;
export const GEOMETRY_SEGMENTS = INCREMENT;

export class Tile {

  private coordinate: ScaledCoordinate;
  private size: number;

  private mesh = React.createRef<THREE.Mesh>();
  private waterMesh = React.createRef<THREE.Mesh>();

  private geometry: THREE.PlaneGeometry;
  private waterGeometry: THREE.PlaneGeometry;

  /**
   * @param coordinate - The coordinates of the tile
   * @param lod - The level of detail of the tile (0 = full detail, 1 = half detail, 2 = quarter detail, etc.)
   */
  constructor(coordinate: ScaledCoordinate) {
    this.coordinate = coordinate;
    this.size = BASE_MESH_SIZE * this.getScale();
    this.geometry = new THREE.PlaneGeometry(this.size, this.size, GEOMETRY_SEGMENTS, GEOMETRY_SEGMENTS);
    this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(GEOMETRY_SEGMENTS * GEOMETRY_SEGMENTS * 3), 3));
    this.waterGeometry = new THREE.PlaneGeometry(this.size, this.size, GEOMETRY_SEGMENTS, GEOMETRY_SEGMENTS);

    this.setWaterMap(new Float32Array(SEGMENTS * SEGMENTS));
  }

  public getScale = (): number => {
    return this.coordinate.levelOfDetail.scale();
  }

  // Public APIs to update maps
  public setHeightMap = (heightMap: Float32Array): void => {
    const geo = this.geometry;
    const vertices = geo.attributes.position.array;
    const x = this.coordinate.coordinate[0] * this.size;
    const y = this.coordinate.coordinate[1] * this.size;
    const segmentSize = this.size / INCREMENT;

    for (let i = 0; i < heightMap.length; i++) {
      const gridX = (i % SEGMENTS) * segmentSize;
      const gridY = Math.floor(i / SEGMENTS) * segmentSize;

      (vertices as any)[i * 3] = x + gridX;
      (vertices as any)[i * 3 + 1] = y + gridY;
      (vertices as any)[i * 3 + 2] = heightMap[i];
    }
    geo.computeVertexNormals();
    geo.attributes.position.needsUpdate = true;
  };

  public setColorMap = (colorMap: Float32Array): void => {
    if (!colorMap) {
      console.error('Color map is null');
      return;
    }
    this.geometry.attributes.color = new THREE.BufferAttribute(colorMap, 3);
    this.geometry.attributes.color.needsUpdate = true;
  };

  public setWaterMap = (heightMap: Float32Array): void => {
    const geo = this.waterGeometry;
    const vertices = geo.attributes.position.array;
    const x = this.coordinate.coordinate[0] * this.size;
    const y = this.coordinate.coordinate[1] * this.size;
    const segmentSize = this.size / INCREMENT;

    for (let i = 0; i < heightMap.length; i++) {
      const gridX = (i % SEGMENTS) * segmentSize;
      const gridY = Math.floor(i / SEGMENTS) * segmentSize;

      (vertices as any)[i * 3] = x + gridX;
      (vertices as any)[i * 3 + 1] = y + gridY;
      (vertices as any)[i * 3 + 2] = heightMap[i];
    }
    geo.computeVertexNormals();
    geo.attributes.position.needsUpdate = true;
  };

  public render = (): JSX.Element => {
    return (
      <React.Fragment key={this.coordinate.coordinate.toString() + " " + this.coordinate.levelOfDetail.lod()}>
        <mesh ref={this.mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <primitive object={this.geometry} attach="geometry" />
          <meshStandardMaterial
            vertexColors={true}
            wireframe={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh ref={this.waterMesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <primitive object={this.waterGeometry} attach="geometry" />
          <meshStandardMaterial
            wireframe={false}
            side={THREE.DoubleSide}
            color="#00aaff"
            transparent={true}
            opacity={0.6}
          />
        </mesh>
      </React.Fragment>
    );
  }
}