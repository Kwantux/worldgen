import { Fragment, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Tile } from '../../logic/Tile';

export const TileMesh: React.FC<{ tile: Tile }> = ({ tile }) => {
  
  const mesh = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = tile.getMeshSize();
    const segments = tile.getSegments()-1;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);

    const updateHeight = (heightMap: Float32Array) => {
      console.log("Updating height map");
      const vertices = geo.attributes.position.array;
      for (let i = 0; i < heightMap.length; i++) {
        vertices[i * 3 + 2] = heightMap[i];
      }
      geo.computeVertexNormals();
      geo.attributes.position.needsUpdate = true;
    }

    const updateColors = (colorMap: Float32Array) => {
      console.log("Updating color map");
      geo.attributes.color = new THREE.BufferAttribute(colorMap, 3);
      geo.attributes.color.needsUpdate = true;
    }

    tile.setHeightMapConsumer(updateHeight);
    tile.setColorMapConsumer(updateColors);

    return geo;
  }, [tile]);


  const waterMesh = useRef<THREE.Mesh>(null);

  const waterGeometry = useMemo(() => {
    const size = tile.getMeshSize();
    const segments = tile.getSegments()-1;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);

    const updateHeight = (heightMap: Float32Array) => {
      console.log("Updating water map");
      const vertices = geo.attributes.position.array;
      for (let i = 0; i < heightMap.length; i++) {
        vertices[i * 3 + 2] = heightMap[i];
      }
      geo.computeVertexNormals();
      geo.attributes.position.needsUpdate = true;
    }

    tile.setWaterMapConsumer(updateHeight);

    return geo;
  }, [tile]);

  return (
    <Fragment>
      <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial
          vertexColors={true}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={waterMesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <primitive object={waterGeometry} attach="geometry" />
        <meshStandardMaterial
          wireframe={false}
          side={THREE.DoubleSide}
          color="#00aaff"
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </Fragment>
  );
}