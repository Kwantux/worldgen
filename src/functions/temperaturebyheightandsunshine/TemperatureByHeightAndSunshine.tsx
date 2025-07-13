import React, { useState, useCallback } from 'react';
import { FunctionHolder } from '../FunctionHolder';

export const TemperatureByHeightAndSunshine: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [weightHeight, setWeightHeight] = useState(0.5);
  const [weightSunshine, setWeightSunshine] = useState(0.75);

  const handleWeightHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeightHeight(e.target.valueAsNumber);
    setWeightSunshine(1-e.target.valueAsNumber);
    updateFunction(1-e.target.valueAsNumber, e.target.valueAsNumber);
  };

  const handleWeightSunshineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeightSunshine(e.target.valueAsNumber);
    setWeightHeight(1-e.target.valueAsNumber);
    updateFunction(e.target.valueAsNumber, 1-e.target.valueAsNumber);
  };
  
  const updateFunction = useCallback((weightHeight: number, weightSunshine: number) => {
    const hash = "temperaturebyheightandsunshine " + weightHeight + " " + weightSunshine;
    fh.setTemperatureGenerator(hash,
    (heightMap: Float32Array, sunshineMap: Float32Array) => {
      const data = new Float32Array(heightMap.length);
      const maxHeight = Math.max(...heightMap);
      const minHeight = Math.min(...heightMap);
      const maxSunshine = Math.max(...sunshineMap);
      const minSunshine = Math.min(...sunshineMap);
      console.log("SUNSHINE MINMAX")
      console.log(maxSunshine);
      console.log(minSunshine);

      for (let i = 0; i < heightMap.length; i++) {
        data[i] = (1-((heightMap[i] - minHeight) / (maxHeight - minHeight)))*weightHeight + ((sunshineMap[i]-minSunshine) / (maxSunshine - minSunshine))*weightSunshine;
      }
      console.log("TEMP MINMAX")
      console.log(Math.min(...data))
      console.log(Math.max(...data))
      return data;
    }
    );
  }, [fh]);
  
  updateFunction(weightHeight, weightSunshine);
  
  return (
    <div>
      <label>Weight height:</label>
      <input type="range" min="0" max="1" step="0.01" value={weightHeight} onChange={handleWeightHeightChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Weight sunshine:</label>
      <input type="range" min="0" max="1" step="0.01" value={weightSunshine} onChange={handleWeightSunshineChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );
};