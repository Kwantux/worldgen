import React from 'react';
import { useCallback, useState } from 'react';
import { FunctionHolder } from '../../logic/FunctionHolder';
import { windByTemperatureAndHeight } from './Functions';

export const WindByTemperatureAndHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [windLevel, setWindLevel] = useState(30);

  const updateGenerator = useCallback((windLevel: number) => {
    const hash = "windbytemperatureandheight " + windLevel;
    fh.setWindGenerator(hash,
    (heightMap: Float32Array) => {
      return windByTemperatureAndHeight(heightMap, windLevel);
    }
    );
  }, [fh]);
  
  const handleWindLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindLevel(e.target.valueAsNumber);
    updateGenerator(e.target.valueAsNumber);
  };
  
  updateGenerator(windLevel);


  return (
    <div>
      <label>Wind level:</label>
      <input type="number" min="0" max="10000" step="5" value={windLevel} onChange={handleWindLevelChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );


};