import { useState } from 'react';
import { perlinMap } from './Functions';
import { ConsumerHolder } from '../ConsumerHolder';

export const PerlinGenerator: React.FC<{
  ch: ConsumerHolder;
}> = ({ ch }) => {
  
  const [seed, setSeed] = useState(0);
  const [size, setSize] = useState(256);
  const [scaleH, setScaleH] = useState(1);
  const [scaleV, setScaleV] = useState(1);
  const [exponent, setExponent] = useState(1);

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.valueAsNumber);
    update();
  };
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.valueAsNumber);
    update();
  }
  const handleScaleHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleH(e.target.valueAsNumber);
    update();
  }
  const handleScaleVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleV(e.target.valueAsNumber);
    update();
  }
  const handleExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExponent(e.target.valueAsNumber);
    update();
  }

  
  const update = () => {
    ch.heightMapConsumer(perlinMap(size, seed, scaleH, scaleV, exponent));
  }

  
  return (
    <div>
      <label>Seed:</label>
      <input type="number" value={seed} onChange={handleSeedChange} style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Size:</label>
      <input type="range" min="16" max="1024" step="16" value={size} onChange={handleSizeChange} />
      <label>Scale horizontal:</label>
      <input type="range" min="0" max="10" step="0.01" value={scaleH} onChange={handleScaleHChange} />
      <label>Scale vertical:</label>
      <input type="range" min="0" max="10" step="0.01" value={scaleV} onChange={handleScaleVChange} />
      <label>Exponent:</label>
      <input type="range" min="0" max="3" step="0.01" value={exponent} onChange={handleExponentChange} />
    </div>
  );
}