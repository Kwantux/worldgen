import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FlyingCamera } from './controls/FlyingCamera';
import { Lighting } from './scene/Lighting';
import FinalAssembly from '../logic/FinalAssembly';

export const World: React.FC<{ finalAssembly: FinalAssembly }> = ({ finalAssembly }) => {

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
        {/* <fog attafh="fog" args={['#17171b', 30, 100]} /> */}
      </Canvas>
      {/* <ControlsOverlay /> */}
    </div>
  );
}