import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { FunctionHolder } from '../../functions/FunctionHolder';

export const SEGMENTS = 512;

export const Terrain: React.FC<{ fh: FunctionHolder; onLoad?: () => void }> = ({ fh, onLoad }) => {
  
  const mesh = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = 250;
    const segments = SEGMENTS-1;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);

    const updateTerrain = (heightMap: Float32Array, colorMap: Float32Array) => {

      console.log("Updating mesh")

      // Put heights
      const vertices = geo.attributes.position.array;
      for (let i = 0; i < heightMap.length; i++) {
        vertices[i * 3 + 2] = heightMap[i];
      }
      geo.computeVertexNormals();
      geo.attributes.position.needsUpdate = true;
      
      // Put colors
      geo.attributes.color = new THREE.BufferAttribute(colorMap, 3);
    }

    fh.setMapConsumer(updateTerrain);

    return geo;
  }, [fh]);

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} attafh="geometry" />
      <meshStandardMaterial
        vertexColors={true}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}