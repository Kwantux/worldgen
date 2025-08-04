import { useState, useCallback } from 'react';
import { perlinMap } from '../perlinsunshine/Functions';
import { FunctionHolder } from '../../logic/FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

export const PerlinHumidity: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  const [seed, setSeed] = useState(-1000);
  const [scale, setScale] = useState(1);
  const [scaleH, setScaleH] = useState(5);
  const [scaleV, setScaleV] = useState(0.04);
  const [rawScaleV, setRawScaleV] = useState(1);
  const [rawShift, setRawShift] = useState(0);
  const [exponent, setExponent] = useState(4);
  const [octaves, setOctaves] = useState(5);
  const [lacunarity, setLacunarity] = useState(0.4);
  const [persistence, setPersistence] = useState(3.5);

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.valueAsNumber);
    updateFunction(e.target.valueAsNumber, scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.valueAsNumber);
    updateFunction(seed, e.target.valueAsNumber, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence);
  };
  
  const handleScaleHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleH(e.target.valueAsNumber);
    updateFunction(seed, scale, e.target.valueAsNumber, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence);
  };
  
  const handleScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleV(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, e.target.valueAsNumber, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence);
  };
  
  const handleRawScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawScaleV(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, e.target.valueAsNumber, rawShift, exponent, octaves, lacunarity, persistence);
  };
  
  const handleRawShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawShift(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, rawScaleV, e.target.valueAsNumber, exponent, octaves, lacunarity, persistence);
  };
  
  const handleExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExponent(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, rawScaleV, rawShift, e.target.valueAsNumber, octaves, lacunarity, persistence);
  };
  
  const handleOctavesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOctaves(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, rawScaleV, rawShift, exponent, e.target.valueAsNumber, lacunarity, persistence);
  };
  
  const handleLacunarityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLacunarity(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, e.target.valueAsNumber, persistence);
  };
  
  const handlePersistenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersistence(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, e.target.valueAsNumber);
  };

  const updateFunction = useCallback((
    seed: number,
    scale: number,
    scaleH: number,
    scaleV: number,
    rawScaleV: number,
    rawShift: number,
    exponent: number,
    octaves: number,
    lacunarity: number,
    persistence: number
  ) => {

    const hash = ('perlinhumidity ' + seed + ' ' + scale + ' ' + scaleH + ' ' + scaleV + ' ' + rawScaleV + ' ' + rawShift + ' ' + exponent + ' ' + octaves + ' ' + lacunarity + ' ' + persistence);

    // Update the generator function
    fh.setHumidityGenerator(hash,
       () => {
      return perlinMap(SEGMENTS, seed, scaleH * scale, scaleV * scale, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence);
    });
  }, [fh]);

  updateFunction(seed, scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence);

  return (
    <div>
      <label>Seed:</label>
      <input type="number" value={seed} onChange={handleSeedChange} style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      {/* <label>SEGMENTS:</label>
      <input type="number" min="16" max="2048" step="1" value={SEGMENTS} onChange={handleSEGMENTSChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} /> */}
      <label>Scale:</label>
      <input type="number" min="0" max="10" step="0.02" value={scale} onChange={handleScaleChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Scale horizontal:</label>
      <input type="number" min="0" max="10" step="0.01" value={scaleH} onChange={handleScaleHChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Scale vertical:</label>
      <input type="number" min="0" max="10" step="0.002" value={scaleV} onChange={handleScaleVChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Raw vertical scale:</label>
      <input type="number" min="0" max="3" step="0.01" value={rawScaleV} onChange={handleRawScaleVChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Raw vertical shift:</label>
      <input type="number" min="0" max="1" step="0.01" value={rawShift} onChange={handleRawShiftChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Exponent:</label>
      <input type="number" min="0" max="10" step="0.1" value={exponent} onChange={handleExponentChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Octaves:</label>
      <input type="number" min="1" max="20" step="1" value={octaves} onChange={handleOctavesChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Lacunarity:</label>
      <input type="number" min="0" max="1" step="0.01" value={lacunarity} onChange={handleLacunarityChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Persistence:</label>
      <input type="number" min="0" max="20" step="0.5" value={persistence} onChange={handlePersistenceChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );
}