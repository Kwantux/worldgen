import { FunctionHolder } from '../FunctionHolder';
import { biomeByHeightAndHumidityAndTemperatureMap } from './Functions';

export const BiomeByHeightAndHumidityAndTemperature: React.FC<{
  fh: FunctionHolder;
}> = ({ fh }) => {
  
  fh.setBiomeGenerator("biomebyheightandhumidityandtemperature", biomeByHeightAndHumidityAndTemperatureMap);
  
  return (
    <div></div>
  );
};
