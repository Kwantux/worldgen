import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Viewport } from './terrain/Terrain';
import { FlyingCamera } from './controls/FlyingCamera';
import { ControlsOverlay } from './ui/ControlsOverlay';
import { Lighting } from './scene/Lighting';
import { perlinMap } from '../utils/noise';

/**
 * The root component for the 3D world.
 *
 * This component is a wrapper around the Three.js canvas element,
 * containing the scene, camera, and controls.
 *
 * Props:
 * - None
 *
 * @returns The rendered world component
 */
/**
 * The root component for the 3D world.
 *
 * This component is a wrapper around the Three.js canvas element,
 * containing the scene, camera, and controls.
 *
 * Props:
 * - None
 *
 * @returns The rendered world component
 */
export default function World() {

  const hmf = (size: number, seed: number) => {
    return perlinMap(size, size, seed);
  };

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
        <Viewport segments={100} seed={0} heightMapFunction={hmf} />
        {/* <fog attach="fog" args={['#17171b', 30, 100]} /> */}
      </Canvas>
      <ControlsOverlay />
    </div>
  );
}