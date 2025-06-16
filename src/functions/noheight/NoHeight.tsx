import React from 'react';
import { FunctionHolder } from '../FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

export const NoHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setHeightGenerator("noheight", () => new Float32Array(SEGMENTS * SEGMENTS));

  return (
    <div>
    </div>
  );
};