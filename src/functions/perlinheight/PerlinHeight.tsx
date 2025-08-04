import { useState, useCallback } from 'react';
import { perlin } from './Functions';
import { FunctionHolder } from '../../logic/FunctionHolder';

export const PerlinGenerator: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  const [seed, setSeed] = useState(0);
  const [scaleH, setScaleH] = useState(2);

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.valueAsNumber);
    updateFunction(e.target.valueAsNumber, scaleH);
  };
  
  const handleScaleHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleH(e.target.valueAsNumber);
    updateFunction(seed, e.target.valueAsNumber);
  };

  const updateFunction = useCallback((
    seed: number,
    scaleH: number,
  ) => {

    const hash = ('perlin ' + seed + ' ' + scaleH);

    // Update the generator function
    fh.setHeightPointFunction(hash, (x: number, y: number) => perlin(x, y, seed, scaleH, fh.getSegments()));
  }, [fh]);

  updateFunction(seed, scaleH);

  return (
    <div>
      <label>Seed:</label>
      <input type="number" value={seed} onChange={handleSeedChange} style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Scale (horizontal):</label>
      <input type="number" min="0" max="10" step="0.01" value={scaleH} onChange={handleScaleHChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );
}