import { useState, useRef, useCallback } from 'react';
import { colorByBiome } from './Functions';
import { ConsumerHolder } from '../ConsumerHolder';

export const ColorByBiome: React.FC<{
  ch: ConsumerHolder;
}> = ({ ch }) => {

  const [blendRadius, setBlendRadius] = useState(5);
  
  const biomeMapCachedRef = useRef(new Int16Array(512 * 512));

  const biomeConsumerDirect = useCallback((biomeMap: Int16Array, blendRadius: number) => {
    ch.consumeColor(colorByBiome(biomeMap, blendRadius));
  }, [ch]);

  const biomeConsumer = useCallback((biomeMap: Int16Array) => {
    biomeMapCachedRef.current = biomeMap as Int16Array<ArrayBuffer>;
    biomeConsumerDirect(biomeMap, blendRadius);
  }, [biomeConsumerDirect, blendRadius]);
  
  const handleBlendRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlendRadius(e.target.valueAsNumber);
    biomeConsumerDirect(biomeMapCachedRef.current, e.target.valueAsNumber);
  };

  ch.addBiomeConsumer("color", biomeConsumer);
  
  return (
    <div>
      <label>Blend Radius:</label>
      <input type="number" min="0" max="20" step="1" value={blendRadius} onChange={handleBlendRadiusChange}  style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );
}