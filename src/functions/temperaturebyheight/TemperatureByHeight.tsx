import React from 'react';
import { FunctionHolder } from '../FunctionHolder';

export const TemperatureByHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {
  
  fh.setTemperatureGenerator("temperaturebyheight", (heightMap: Float32Array) => {
    const data = new Float32Array(heightMap.length);
    const max = Math.max(...heightMap);
    const min = Math.min(...heightMap);

    for (let i = 0; i < heightMap.length; i++) {
      data[i] = 1-((heightMap[i] - min) / (max - min));
    }
    return data;
  });

  return (
    <div>
    </div>
  );
};