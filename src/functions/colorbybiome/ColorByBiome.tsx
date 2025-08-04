import { useState, useCallback } from 'react';
import { colorByBiome } from './Functions';
import { FunctionHolder } from '../../logic/FunctionHolder';

export const ColorByBiome: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  const [blendRadius, setBlendRadius] = useState(5);

  const updateGenerator = useCallback((blendRadius: number) => {
    const hash = "colorbybiome " + blendRadius;
    fh.setColorGenerator(hash,
    (heightMap: Float32Array, biomeMap: Int16Array) => {
      return colorByBiome(biomeMap, blendRadius);
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
}