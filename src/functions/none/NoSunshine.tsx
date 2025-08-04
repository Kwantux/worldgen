import { FunctionHolder } from '../../logic/FunctionHolder';
import { SEGMENTS } from '../../components/terrain/Terrain';

export const NoSunshine: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {
  
  fh.setSunshineGenerator("none", () => new Float32Array(SEGMENTS * SEGMENTS));

  return (
    <div>
    </div>
  );
};
