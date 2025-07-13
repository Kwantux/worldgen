import React from 'react';
import { FunctionHolder } from '../FunctionHolder';

export const NoPostProcessing: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setHeightPostProcessing("nopostprocessing", (heightMap: Float32Array) => heightMap);

  return (
    <div>
    </div>
  );
};