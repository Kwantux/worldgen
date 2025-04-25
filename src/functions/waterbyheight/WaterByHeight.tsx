import React from 'react';
import { useCallback, useState } from 'react';
import { FunctionHolder } from '../FunctionHolder';
import { waterByHeight } from './Functions';

export const WaterByHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [relativeWaterLevel, setRelativeWaterLevel] = useState(0.2);

  const updateGenerator = useCallback((relativeWaterLevel: number) => {
    const hash = "waterbyheight " + relativeWaterLevel;
    fh.setWaterGenerator(hash,
    (heightMap: Float32Array) => {
      return waterByHeight(heightMap, relativeWaterLevel);
    }
    );
  }, [fh]);
  
  const handleWaterLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelativeWaterLevel(e.target.valueAsNumber);
    updateGenerator(e.target.valueAsNumber);
  };
  
  updateGenerator(relativeWaterLevel);


  return (
    <div>
      <label>Relative water level:</label>
      <input type="number" min="0" max="1" step="0.01" value={relativeWaterLevel} onChange={handleWaterLevelChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );


};