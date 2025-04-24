import { ConsumerHolder } from "./functions/ConsumerHolder";
import { World } from "./components/World";
import { PerlinGenerator } from "./functions/perlin/PerlinGenerator";
import { BiomeByHeight } from "./functions/biomebyheight/BiomeByHeight";
import { ColorByBiome } from "./functions/colorbybiome/ColorByBiome";

const App = () => {

  const ch = new ConsumerHolder();

  return (
    <div className="bg-gray-900" style={{ display: 'flex', flexDirection: 'row', height: '100vh', color: 'white'}}>
      <div className="overflow-y-auto" style={{ flex: "0 0 260px", backgroundColor: '#202020' }}>
        <div style={{ width: '260px', flexShrink: 0, padding: '16px', backgroundColor: '#101010' }}>

          <div style={{ padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Height Map</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}>
              <option value="perlin">Perlin Noise</option>
            </select>
            <PerlinGenerator ch={ch} />
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Biome</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px' , backgroundColor: '#2b2a33'}}>
              <option value="biomebyheight">Biome by height</option>
            </select>
            <BiomeByHeight ch={ch}/>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Post Processing</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}>
              <option value="none">None</option>
            </select>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Material</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}>
              <option value="colorbybiome">Color by biome</option>
            </select>
            <ColorByBiome ch={ch}/>
          </div>


        </div>
      </div>
      <div className="overflow-hidden" style={{ flex: 1, width: '1000px' }}>
        <World ch={ch} />
      </div>
    </div>
  );
};

export default App;