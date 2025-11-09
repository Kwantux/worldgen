import React from 'react';
import { useCallback, useState } from 'react';
import { FunctionHolder } from '../../logic/FunctionHolder';
import { waterByHeight } from './Functions';

export const WaterByHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [waterLevel, setWaterLevel] = useState(30);

  const updateGenerator = useCallback((waterLevel: number) => {
    const hash = "waterbyheight " + waterLevel;
    fh.setWaterGenerator(hash,
    (heightMap: Float32Array) => {
      return waterByHeight(heightMap, waterLevel);
    }
    );
  }, [fh]);
  
  const handleWaterLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaterLevel(e.target.valueAsNumber);
    updateGenerator(e.target.valueAsNumber);
  };
  
  updateGenerator(waterLevel);


  return (
    <div>
      <label>Water level:</label>
      <input type="number" min="0" max="10000" step="5" value={waterLevel} onChange={handleWaterLevelChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );


};