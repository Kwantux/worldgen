import React from 'react';
import { useCallback, useState } from 'react';
import { FunctionHolder } from '../FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

export const SmoothByHeight: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [blendRadius, setBlendRadius] = useState(5);
  const [heightShift, setHeightShift] = useState(0);
  const [heightExponent, setHeightExponent] = useState(3);

  const smoothMap =(map: Float32Array, heightShift: number, heightExponent: number) => {
    const max = Math.max(...map);
    const min = Math.min(...map);

    const smoothedMap = new Float32Array(map.length);
    for (let i = 0; i < map.length; i++) {
      const neighbors = [i - 1, i + 1, i - SEGMENTS, i + SEGMENTS];
      let sum = map[i];
      let count = 1;
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < map.length && neighbor % SEGMENTS !== 0 && neighbor % SEGMENTS !== SEGMENTS - 1) {
          const weight = Math.pow(1 - (map[neighbor] - min) / (max - min) + heightShift, heightExponent); // Inverted relative height
          sum += map[neighbor] * weight;
          count += weight;
        }
      }
      smoothedMap[i] = sum / count;
    }
    return smoothedMap;
  }

  const updateGenerator = useCallback((blendRadius: number, heightShift: number, heightExponent: number) => {
    const hash = "smoothbyheight " + blendRadius + " " + heightShift + " " + heightExponent;
    fh.setPostProcessing(hash,
    (heightMap: Float32Array) => {
      let smoothedHeightMap = heightMap;
      for (let i = 0; i < blendRadius; i++) {
        smoothedHeightMap = smoothMap(smoothedHeightMap, heightShift, heightExponent);
      }
      return smoothedHeightMap;
    }
    );
  }, [fh]);
  
  const handleBlendRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlendRadius(e.target.valueAsNumber);
    updateGenerator(e.target.valueAsNumber, heightShift, heightExponent);
  };

  const handleHeightShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightShift(e.target.valueAsNumber);
    updateGenerator(blendRadius, e.target.valueAsNumber, heightExponent);
  };

  const handleHeightExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightExponent(e.target.valueAsNumber);
    updateGenerator(blendRadius, heightShift, e.target.valueAsNumber);
  };
  
  updateGenerator(blendRadius, heightShift, heightExponent);


  return (
    <div>
      <label>Blend Radius:</label>
      <input type="number" min="0" max="20" step="1" value={blendRadius} onChange={handleBlendRadiusChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />

      <label>Height Shift:</label>
      <input type="number" min="0" max="1" step="0.01" value={heightShift} onChange={handleHeightShiftChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />

      <label>Height Exponent:</label>
      <input type="number" min="1" max="5" step="0.1" value={heightExponent} onChange={handleHeightExponentChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );


};