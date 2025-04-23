import { useCallback } from 'react';
import { biomeByHeight } from './Functions';
import { ConsumerHolder } from '../ConsumerHolder';

export const BiomeByHeight: React.FC<{
  ch: ConsumerHolder;
}> = ({ ch }) => {

  const heightConsumer = useCallback((heightMap: Float32Array) => {
    ch.consumeBiome(biomeByHeight(heightMap));
  }, [ch]);

  ch.addHeightConsumer(heightConsumer);
  
  return (
    <div>
    </div>
  );
}