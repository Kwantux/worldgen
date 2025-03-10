import { useState } from 'react';
import { perlinMap } from './Functions';
import { ConsumerHolder } from '../ConsumerHolder';

export const PerlinGenerator: React.FC<{
  ch: ConsumerHolder;
}> = ({ ch }) => {

  const size = 256;
  
  const [seed, setSeed] = useState(0);
  const [scale, setScale] = useState(0.2);
  const [scaleH, setScaleH] = useState(1);
  const [scaleV, setScaleV] = useState(0.04);
  const [rawScaleV, setRawScaleV] = useState(1);
  const [rawShift, setRawShift] = useState(0);
  const [exponent, setExponent] = useState(3);
  const [octaves, setOctaves] = useState(5);
  const [lacunarity, setLacunarity] = useState(0.3);
  const [persistence, setPersistence] = useState(4);

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.valueAsNumber);
    update();
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.valueAsNumber);
    update();
  };

  const handleScaleHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleH(e.target.valueAsNumber);
    update();
  }
  const handleScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleV(e.target.valueAsNumber);
    update();
  }

  const handleRawScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawScaleV(e.target.valueAsNumber);
    update();
  }

  const handleRawShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawShift(e.target.valueAsNumber);
    update();
  }
  const handleExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExponent(e.target.valueAsNumber);
    update();
  }
  const handleOctavesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOctaves(e.target.valueAsNumber);
    update();
  }
  const handleLacunarityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLacunarity(e.target.valueAsNumber);
    update();
  }
  const handlePersistenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersistence(e.target.valueAsNumber);
    update();
  }
  
  const update = () => {
    console.log("Updating Height Map")
    ch.heightMapConsumer(perlinMap(size, seed, scaleH * scale, scaleV * scale, rawScaleV, rawShift, exponent, octaves, lacunarity, persistence));
  }

  
  return (
    <div>
      <label>Seed:</label>
      <input type="number" value={seed} onChange={handleSeedChange} style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      {/* <label>Size:</label>
      <input type="number" min="16" max="2048" step="1" value={size} onChange={handleSizeChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} /> */}
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