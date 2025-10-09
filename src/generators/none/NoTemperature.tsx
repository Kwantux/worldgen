import { FunctionHolder } from '../../logic/FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Tile';

export const NoTemperature: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {
  
  fh.setTemperatureGenerator("none", () => new Float32Array(SEGMENTS * SEGMENTS));

  return (
    <div>
    </div>
  );
};
