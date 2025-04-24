import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { ConsumerHolder } from '../../functions/ConsumerHolder';

export const Terrain: React.FC<{ ch: ConsumerHolder }> = ({ ch }) => {
  
  const mesh = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = 250;
    const segments = 511;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);

    ch.addHeightConsumer("terrain", (heightMap: Float32Array) => {
      const vertices = geo.attributes.position.array;
      for (let i = 0; i < heightMap.length; i++) {
        vertices[i * 3 + 2] = heightMap[i];
      }
      geo.computeVertexNormals();
      geo.attributes.position.needsUpdate = true;
    });

    ch.addColorConsumer("terrain", (colors: Float32Array) => {
      geo.attributes.color = new THREE.BufferAttribute(colors, 3);
    });
// Consumer Function Arrays
  // private heightConsumers: Set<(values: Float32Array) => void> = new Set();
  // private biomeConsumers: Set<(values: Int16Array) => void> = new Set();
  // private colorConsumers: Set<(values: Float32Array) => void> = new Set();

  // private updateFunctions: Set<() => void> = new Set();


  // // Add Consumer Functions
  // public addHeightConsumer(func: (values: Float32Array) => void) {
  //   this.heightConsumers.add(func);
  //   console.log("-- Height consumer registered --")
  //   console.log(func)
  //   console.log(this.heightConsumers.size + " height consumers in total")
  // }
  // public addBiomeConsumer(func: (values: Int16Array) => void) {
  //   this.biomeConsumers.add(func);
  //   console.log("-- Biome consumer registered --")
  //   console.log(this.biomeConsumers.size + " biome consumers in total")
  // }
  // public addColorConsumer(func: (values: Float32Array) => void) {
  //   this.colorConsumers.add(func);
  //   console.log("-- Color consumer registered --")
  //   console.log(this.colorConsumers.size + " color consumers in total")
  // }

  // public addUpdateFunction(func: () => void) {
  //   this.updateFunctions.add(func);
  //   console.log("-- Update function registered --")
  //   console.log(func)
  //   console.log(this.updateFunctions.size + " update functions in total")
  // }


  // // Call Consumer Functions
  // public consumeHeight = (values: Float32Array) => {
  //   console.log("Updating height map")
  //   for (const func of this.heightConsumers) {
  //     func(values);
  //   }
  // };
  // public consumeBiome = (values: Int16Array) => {
  //   console.log("Updating biome map")
  //   for (const func of this.biomeConsumers) {
  //     func(values);
  //   }
  // };
  // public consumeColor = (values: Float32Array) => {
  //   console.log("Updating color map")
  //   for (const func of this.colorConsumers) {
  //     func(values);
  //   }
  // };

  // public update = () => {
  //   console.log("Updating everything...")
  //   for (const func of this.updateFunctions) {
  //     func();
  //   }
  // };

    ch.update();

    return geo;
  }, [ch]);

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        vertexColors={true}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}