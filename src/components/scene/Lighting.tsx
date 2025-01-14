import React from 'react';

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[50, 50, -50]}
        castShadow
        intensity={1}
        shadow-mapSize={2048}
      />
    </>
  );
}