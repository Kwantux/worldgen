import React, { useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FlyingCamera } from './controls/FlyingCamera';
import { Lighting } from './scene/Lighting';
import FinalAssembly from '../logic/FinalAssembly';

export const World: React.FC<{ finalAssembly: FinalAssembly}> = ({ finalAssembly }) => {

  const [_, updateTrigger] = useState({});

  const triggerUpdate = () => {
    updateTrigger({});
  };

  finalAssembly.setUpdateFunction(triggerUpdate);

  const waterMesh = React.createRef<THREE.Mesh>();
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
  

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 20, 50], fov: 75 }}
        className="bg-gray-900"
      >
        <Lighting />
        <FlyingCamera />
        <OrbitControls enableZoom={true} enablePan={true} />
        {finalAssembly.renderTiles()}
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
        
        {/* <fog attafh="fog" args={['#17171b', 30, 100]} /> */}
      </Canvas>
      {/* <ControlsOverlay /> */}
    </div>
  );
}