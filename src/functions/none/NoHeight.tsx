import React from 'react';
import { FunctionHolder } from '../../logic/FunctionHolder';

export const NoHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setHeightPointFunction("none", () => 0);

  return (
    <div>
    </div>
  );
};