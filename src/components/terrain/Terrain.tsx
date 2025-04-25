import { Fragment, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { FunctionHolder } from '../../functions/FunctionHolder';

export const SEGMENTS = 512;

export const Terrain: React.FC<{ fh: FunctionHolder; onLoad?: () => void }> = ({ fh, onLoad }) => {
  
  const mesh = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = 250;
    const segments = SEGMENTS-1;
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

    fh.setHeightMapConsumer(updateHeight);
    fh.setColorMapConsumer(updateColors);

    return geo;
  }, [fh]);


  const waterMesh = useRef<THREE.Mesh>(null);

  const waterGeometry = useMemo(() => {
    const size = 250;
    const segments = SEGMENTS-1;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);

    const updateHeight = (heightMap: Float32Array) => {
      console.log("Updating water map");
      // const opacity = new Float32Array(heightMap.length);
      const vertices = geo.attributes.position.array;
      for (let i = 0; i < heightMap.length; i++) {
        vertices[i * 3 + 2] = heightMap[i];
        // opacity[i] = heightMap[i] === 0 ? 1 : 0.4;
      }
      // geo.attributes.opacity = new THREE.BufferAttribute(opacity, 1);
      // geo.attributes.opacity.needsUpdate = true;
      geo.computeVertexNormals();
      geo.attributes.position.needsUpdate = true;
    }

    fh.setWaterMapConsumer(updateHeight);

    return geo;
  }, [fh]);

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <Fragment>
      <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <primitive object={geometry} attafh="geometry" />
        <meshStandardMaterial
          vertexColors={true}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={waterMesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <primitive object={waterGeometry} attafh="geometry" />
        <meshStandardMaterial
          // vertexColors={true}
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