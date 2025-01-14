import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { perlinMap } from '../../utils/noise';

const heightMapFunction = (segments: number, seed: number) => {
  return perlinMap(segments, segments, seed);
};

export function Viewport() {
  
  const mesh = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = 100;
    const segments = 256;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    
    // Generate heightmap using noise function
    const heightMap = heightMapFunction(segments + 1, 0);
    const vertices = geo.attributes.position.array;

    for (let i = 0; i < heightMap.length; i++) {
      vertices[i * 3 + 2] = heightMap[i];
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

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

// class Terrain {
  
//   private mesh = useRef<THREE.Mesh>(null);
  
//   private geometry = useMemo(() => {

//     const geo = new THREE.PlaneGeometry(this.size, this.size, this.size, this.size);
    
//     // Generate heightmap using noise function
//     const heightMap = perlinMap(this.size + 1, this.size + 1, 0);
//     const vertices = geo.attributes.position.array;

//     for (let i = 0; i < heightMap.length; i++) {
//       vertices[i * 3 + 2] = heightMap[i];
//     }
    
//     geo.computeVertexNormals();
//     return geo;
//   }, []);

//   constructor(private size = 128) {}

// }