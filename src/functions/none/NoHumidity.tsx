import React from 'react';
import { FunctionHolder } from '../FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

const noHumidity = () => {
  return new Float32Array(SEGMENTS * SEGMENTS);
}

export const NoHumidity: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setHumidityGenerator("none", noHumidity);

  return (
    <div>
    </div>
  );
};