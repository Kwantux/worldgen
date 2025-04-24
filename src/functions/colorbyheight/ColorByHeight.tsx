import { useCallback } from 'react';
import { colorByHeight } from './Functions';
import { ConsumerHolder } from '../ConsumerHolder';

export const ColorByHeight: React.FC<{
  ch: ConsumerHolder;
}> = ({ ch }) => {

  const heightConsumer = useCallback((height: Float32Array) => {
    ch.consumeColor(colorByHeight(height));
  }, [ch]);

  ch.addHeightConsumer("color", heightConsumer);
  
  return (
    <div>
    </div>
  );
}