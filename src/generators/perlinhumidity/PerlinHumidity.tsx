import { useState, useCallback } from 'react';
import { perlinMap } from '../perlinsunshine/Functions';
import { FunctionHolder } from '../../logic/FunctionHolder';

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

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.valueAsNumber);
    updateFunction(e.target.valueAsNumber, scale, scaleH, scaleV, rawScaleV, rawShift, exponent);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.valueAsNumber);
    updateFunction(seed, e.target.valueAsNumber, scaleH, scaleV, rawScaleV, rawShift, exponent);
  };
  
  const handleScaleHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleH(e.target.valueAsNumber);
    updateFunction(seed, scale, e.target.valueAsNumber, scaleV, rawScaleV, rawShift, exponent);
  };
  
  const handleScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleV(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, e.target.valueAsNumber, rawScaleV, rawShift, exponent);
  };
  
  const handleRawScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawScaleV(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, e.target.valueAsNumber, rawShift, exponent);
  };
  
  const handleRawShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawShift(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, rawScaleV, e.target.valueAsNumber, exponent);
  };
  
  const handleExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExponent(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, rawScaleV, rawShift, e.target.valueAsNumber);
  };


  const updateFunction = useCallback((
    seed: number,
    scale: number,
    scaleH: number,
    scaleV: number,
    rawScaleV: number,
    rawShift: number,
    exponent: number,
  ) => {

    const hash = ('perlinhumidity ' + seed + ' ' + scale + ' ' + scaleH + ' ' + scaleV + ' ' + rawScaleV + ' ' + rawShift + ' ' + exponent);

    // Update the generator function
    fh.setHumidityGenerator(hash,
       (heightMap: Float32Array<ArrayBufferLike>, waterMap: Float32Array<ArrayBufferLike>, segments: number, x: number, y: number) => {
      return perlinMap(segments, x, y, seed, scaleH * scale, scaleV * scale);
    });
  }, [fh]);

  updateFunction(seed, scale, scaleH, scaleV, rawScaleV, rawShift, exponent);

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
    </div>
  );
}