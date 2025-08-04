import { colorByHeight } from './Functions';
import { FunctionHolder } from '../../logic/FunctionHolder';

export const ColorByHeight: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  fh.setColorGenerator("colorbyheight", colorByHeight);

  return (
    <div>
    </div>
  );
}