import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { ConsumerHolder } from '../../functions/ConsumerHolder';

export const Terrain: React.FC<{ ch: ConsumerHolder }> = ({ ch }) => {
  
  const mesh = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = 100;
    const segments = 255;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    
    ch.heightMapConsumer = (heightMap: Float32Array) => {
      const vertices = geo.attributes.position.array;
      for (let i = 0; i < heightMap.length; i++) {
        vertices[i * 3 + 2] = heightMap[i];
      }
      geo.computeVertexNormals();
      geo.attributes.position.needsUpdate = true;
    };

    ch.updateFunction();

    return geo;
  }, [ch]);

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#4a9375"
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}