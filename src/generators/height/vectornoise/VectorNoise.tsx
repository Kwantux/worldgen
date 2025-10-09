import { useState, useCallback } from 'react';
import { FunctionHolder } from '../../../logic/FunctionHolder';
import { vectorTectonics } from './Functions';

export const VectorTectonics: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  const [seed, setSeed] = useState(-1000);
  const [scale, setScale] = useState(1);
  const [scaleH, setScaleH] = useState(1);
  const [scaleV, setScaleV] = useState(0.04);
  const [centersPerSegment, setCentersPerSegment] = useState(0.05);
  const [radius, setRadius] = useState(5);

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.valueAsNumber);
    updateFunction(e.target.valueAsNumber, scale, scaleH, scaleV, centersPerSegment, radius);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.valueAsNumber);
    updateFunction(seed, e.target.valueAsNumber, scaleH, scaleV, centersPerSegment, radius);
  };
  
  const handleScaleHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleH(e.target.valueAsNumber);
    updateFunction(seed, scale, e.target.valueAsNumber, scaleV, centersPerSegment, radius);
  };
  
  const handleScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleV(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, e.target.valueAsNumber, centersPerSegment, radius);
  };

  const handleCentersPerSegmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCentersPerSegment(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, e.target.valueAsNumber, radius);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(e.target.valueAsNumber);
    updateFunction(seed, scale, scaleH, scaleV, centersPerSegment, e.target.valueAsNumber);
  };

  const updateFunction = useCallback((
    seed: number,
    scale: number,
    scaleH: number,
    scaleV: number,
    centersPerSegment: number,
    radius: number,
  ) => {

    const hash = ('vector ' + seed + ' ' + scale + ' ' + scaleH + ' ' + scaleV + ' ' + centersPerSegment + ' ' + radius);

    // Update the generator function
    fh.setFractalHeightMapGenerator(hash,
       (heightPointFunction: (x: number, y: number) => number, segments: number, x: number, y: number, scale_h: number, scale_v: number) => {
      return vectorTectonics(segments, x, y, scale_h * scale * scaleH, scale_v * scale * scaleV, seed, centersPerSegment, radius);
    });
  }, [fh]);

  updateFunction(seed, scale, scaleH, scaleV, centersPerSegment, radius);

  return (
    <div>
      <label>Seed:</label>
      <input type="number" value={seed} onChange={handleSeedChange} style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Scale:</label>
      <input type="number" min="0" max="10" step="0.02" value={scale} onChange={handleScaleChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Scale horizontal:</label>
      <input type="number" min="0" max="10" step="0.01" value={scaleH} onChange={handleScaleHChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Scale vertical:</label>
      <input type="number" min="0" max="10" step="0.002" value={scaleV} onChange={handleScaleVChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Centers per segment:</label>
      <input type="number" min="0" max="1" step="0.01" value={centersPerSegment} onChange={handleCentersPerSegmentChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Radius:</label>
      <input type="number" min="0" max="100" step="1" value={radius} onChange={handleRadiusChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );
}