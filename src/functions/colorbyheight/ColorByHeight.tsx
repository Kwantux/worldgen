import { colorByHeight } from './Functions';
import { FunctionHolder } from '../FunctionHolder';

export const ColorByHeight: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {

  fh.setColorGenerator("colorbyheight", colorByHeight);

  return (
    <div>
    </div>
  );
}