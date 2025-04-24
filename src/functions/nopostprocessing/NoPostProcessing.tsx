import React from 'react';
import { FunctionHolder } from '../FunctionHolder';

export const NoPostProcessing: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setPostProcessing("nopostprocessing", (heightMap: Float32Array) => heightMap);

  return (
    <div>
      {/* Add UI elements to control the post-processing algorithm if needed */}
    </div>
  );
};