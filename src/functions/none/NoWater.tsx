import React from 'react';
import { FunctionHolder } from '../../logic/FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

const noWater = () => {
  const data = new Float32Array(SEGMENTS * SEGMENTS);
  for (let i = 0; i < SEGMENTS * SEGMENTS; i++) {
    data[i] = Infinity;
  }
  return data;
}

export const NoWater: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setWaterGenerator("none", noWater);

  return (
    <div>
    </div>
  );
};