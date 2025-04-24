import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Terrain } from './terrain/Terrain';
import { FlyingCamera } from './controls/FlyingCamera';
import { Lighting } from './scene/Lighting';
import { FunctionHolder } from '../functions/FunctionHolder';

export const World: React.FC<{ fh: FunctionHolder; onLoad?: () => void }> = ({ fh, onLoad }) => {

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
        <Terrain fh={fh} onLoad={onLoad} />
        {/* <fog attafh="fog" args={['#17171b', 30, 100]} /> */}
      </Canvas>
      {/* <ControlsOverlay /> */}
    </div>
  );
}