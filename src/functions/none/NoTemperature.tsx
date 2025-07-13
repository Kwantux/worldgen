import { FunctionHolder } from '../FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

export const NoTemperature: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {
  
  fh.setTemperatureGenerator("none", () => new Float32Array(SEGMENTS * SEGMENTS));

  return (
    <div>
    </div>
  );
};
