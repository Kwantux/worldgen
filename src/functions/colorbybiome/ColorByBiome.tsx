import { useCallback } from 'react';
import { colorByBiome } from './Functions';
import { ConsumerHolder } from '../ConsumerHolder';

export const ColorByBiome: React.FC<{
  ch: ConsumerHolder;
}> = ({ ch }) => {

  const biomeConsumer = useCallback((biomeMap: Int16Array) => {
    ch.consumeColor(colorByBiome(biomeMap));
  }, [ch]);

  ch.addBiomeConsumer(biomeConsumer);
  
  return (
    <div>
    </div>
  );
}