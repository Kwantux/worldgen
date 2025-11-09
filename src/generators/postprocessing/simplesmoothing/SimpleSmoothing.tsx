import React from 'react';
import { useCallback, useState } from 'react';
import { FunctionHolder } from '../../../logic/FunctionHolder';
import { SEGMENTS } from '../../../components/terrain/Tile';../components/terrain/Tile';

export const SimpleSmoothing: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [blendRadius, setBlendRadius] = useState(5);

  const smoothMap =(map: Float32Array) => {
    const smoothedMap = new Float32Array(map.length);
    for (let i = 0; i < map.length; i++) {
      const neighbors = [i - 1, i + 1, i - SEGMENTS, i + SEGMENTS];
      let sum = map[i];
      let count = 1;
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < map.length && neighbor % SEGMENTS !== 0 && neighbor % SEGMENTS !== SEGMENTS - 1) {
          sum += map[neighbor];
          count++;
        }
      }
      smoothedMap[i] = sum / count;
    }
    return smoothedMap;
  }

  const updateGenerator = useCallback((blendRadius: number) => {
    const hash = "simplesmoothing " + blendRadius;
    fh.setPostProcessing(hash,
    (heightMap: Float32Array) => {
      let smoothedHeightMap = heightMap;
      for (let i = 0; i < blendRadius; i++) {
        smoothedHeightMap = smoothMap(smoothedHeightMap);
      }
      return smoothedHeightMap;
    }
    );
  }, [fh]);
  
  const handleBlendRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlendRadius(e.target.valueAsNumber);
    updateGenerator(e.target.valueAsNumber);
  };
  
  updateGenerator(blendRadius);


  return (
    <div>
      <label>Blend Radius:</label>
      <input type="number" min="0" max="20" step="1" value={blendRadius} onChange={handleBlendRadiusChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );


};