import { biomeByHeight } from './Functions';
import { FunctionHolder } from '../FunctionHolder';

export const BiomeByHeight: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  fh.setBiomeGenerator("biomebyheight", biomeByHeight);
  
  return (
    <div>
    </div>
  );
}