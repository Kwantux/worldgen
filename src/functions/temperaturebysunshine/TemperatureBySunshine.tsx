import React from 'react';
import { FunctionHolder } from '../../logic/FunctionHolder';

export const TemperatureBySunshine: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setTemperatureGenerator("temperaturebysunshine", (heightMap: Float32Array, sunshineMap: Float32Array) => sunshineMap);

  return (
    <div>
    </div>
  );
};