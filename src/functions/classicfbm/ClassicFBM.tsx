import { useState, useCallback } from 'react';
import { classicFbmMap } from './Functions';
import { FunctionHolder } from '../../logic/FunctionHolder';

export const ClassicFBMGenerator: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  const [scale, setScale] = useState(1);
  const [scaleH, setScaleH] = useState(2);
  const [scaleV, setScaleV] = useState(0.04);
  const [rawScaleV, setRawScaleV] = useState(1);
  const [rawShift, setRawShift] = useState(0);
  const [exponent, setExponent] = useState(4);
  const [octaves, setOctaves] = useState(5);
  const [lacunarity, setLacunarity] = useState(0.4);
  const [persistence, setPersistence] = useState(3.5);
  const [lacunarityScale, setLacunarityScale] = useState(1);
  const [persistenceScale, setPersistenceScale] = useState(1);

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.valueAsNumber);
    updateFunction(e.target.valueAsNumber, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);
  };
  
  const handleScaleHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleH(e.target.valueAsNumber);
    updateFunction(scale, e.target.valueAsNumber, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);
  };
  
  const handleScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleV(e.target.valueAsNumber);
    updateFunction(scale, scaleH, e.target.valueAsNumber, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);
  };
  
  const handleRawScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawScaleV(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, e.target.valueAsNumber, rawShift, exponent, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);
  };
  
  const handleRawShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawShift(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, e.target.valueAsNumber, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);
  };
  
  const handleExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExponent(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, e.target.valueAsNumber, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);
  };
  
  const handleOctavesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOctaves(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, exponent, e.target.valueAsNumber, lacunarity, persistence, lacunarityScale, persistenceScale);
  };
  
  const handleLacunarityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLacunarity(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, e.target.valueAsNumber, persistence, lacunarityScale, persistenceScale);
  };
  
  const handlePersistenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersistence(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, e.target.valueAsNumber, lacunarityScale, persistenceScale);
  };

  const handleLacunarityScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLacunarityScale(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence, e.target.valueAsNumber, persistenceScale);
  };

  const handlePersistenceScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersistenceScale(e.target.valueAsNumber);
    updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence, lacunarityScale, e.target.valueAsNumber);
  };

  const updateFunction = useCallback((
    scale: number,
    scaleH: number,
    scaleV: number,
    rawScaleV: number,
    rawShift: number,
    exponent: number,
    octaves: number,
    lacunarity: number,
    persistence: number,
    lacunarityScale: number,
    persistenceScale: number
  ) => {

    const hash = ('classicfbm ' + scale + ' ' + scaleH + ' ' + scaleV + ' ' + rawScaleV + ' ' + rawShift + ' ' + exponent + ' ' + octaves + ' ' + lacunarity + ' ' + persistence + ' ' + lacunarityScale + ' ' + persistenceScale);

    // Update the generator function
    fh.setFractalHeightMapGenerator(hash,
       (heightNoiseFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scale_h: number, scale_v: number) => {
      return classicFbmMap(heightNoiseFunction, segments, x, y, scale_h * scale * scaleH, scale_v * scale * scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);
    });
  }, [fh]);

  updateFunction(scale, scaleH, scaleV, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence, lacunarityScale, persistenceScale);

  return (
    <div>
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
      <input type="number" min="1" max="20" step="0.5" value={persistence} onChange={handlePersistenceChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Lacunarity scale:</label>
      <input type="number" min="0" max="10" step="0.01" value={lacunarityScale} onChange={handleLacunarityScaleChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Persistence scale:</label>
      <input type="number" min="0" max="10" step="0.01" value={persistenceScale} onChange={handlePersistenceScaleChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );
}