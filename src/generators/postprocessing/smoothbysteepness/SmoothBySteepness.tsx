import React from 'react';
import { useCallback, useState } from 'react';
import { FunctionHolder } from '../../../logic/FunctionHolder';
import { SEGMENTS } from '../../../components/terrain/Tile';../components/terrain/Tile';

export const SmoothBySteepness: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [blendRadius, setBlendRadius] = useState(5);
  const [steepnessShift, setsteepnessShift] = useState(0.01);
  const [steepnessExponent, setSteepnessExponent] = useState(1.3);

  const smoothMap =(map: Float32Array, steepnessShift: number, steepnessExponent: number) => {
    const smoothedMap = new Float32Array(map.length);
    for (let i = 0; i < map.length; i++) {
      const neighbors = [i - 1, i + 1, i - SEGMENTS, i + SEGMENTS];
      let sum = map[i];
      let count = 1;
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < map.length && neighbor % SEGMENTS !== 0 && neighbor % SEGMENTS !== SEGMENTS - 1) {
          const steepness = Math.abs(map[i] - map[neighbor]);
          const weight = Math.pow(1/(steepness+steepnessShift), steepnessExponent);
          sum += map[neighbor] * weight;
          count += weight;
        }
      }
      smoothedMap[i] = sum / count;
    }
    return smoothedMap;
  }

  const updateGenerator = useCallback((blendRadius: number, steepnessShift: number, steepnessExponent: number) => {
    const hash = "smoothbysteepness " + blendRadius + " " + steepnessShift + " " + steepnessExponent;
    fh.setPostProcessing(hash,
    (heightMap: Float32Array) => {
      let smoothedHeightMap = heightMap;
      for (let i = 0; i < blendRadius; i++) {
        smoothedHeightMap = smoothMap(smoothedHeightMap, steepnessShift, steepnessExponent);
      }
      return smoothedHeightMap;
    }
    );
  }, [fh]);
  
  const handleBlendRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlendRadius(e.target.valueAsNumber);
    updateGenerator(e.target.valueAsNumber, steepnessShift, steepnessExponent);
  };

  const handleSteepnessShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsteepnessShift(e.target.valueAsNumber);
    updateGenerator(blendRadius, e.target.valueAsNumber, steepnessExponent);
  };

  const handleSteepnessExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSteepnessExponent(e.target.valueAsNumber);
    updateGenerator(blendRadius, steepnessShift, e.target.valueAsNumber);
  };
  
  updateGenerator(blendRadius, steepnessShift, steepnessExponent);


  return (
    <div>
      <label>Blend Radius:</label>
      <input type="number" min="0" max="20" step="1" value={blendRadius} onChange={handleBlendRadiusChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />

      <label>Steepness Factor:</label>
      <input type="number" min="0.01" max="1" step="0.01" value={steepnessShift} onChange={handleSteepnessShiftChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />

      <label>Steepness Exponent:</label>
      <input type="number" min="0" max="5" step="0.1" value={steepnessExponent} onChange={handleSteepnessExponentChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );


};