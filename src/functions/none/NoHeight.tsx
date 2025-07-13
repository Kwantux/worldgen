import React from 'react';
import { FunctionHolder } from '../FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

export const NoHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setRawHeightGenerator("none", () => new Float32Array(SEGMENTS * SEGMENTS));

  return (
    <div>
    </div>
  );
};