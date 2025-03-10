import { ConsumerHolder } from "./functions/ConsumerHolder";
import { World } from "./components/World";
import { PerlinGenerator } from "./functions/perlin/PerlinGenerator";

const App = () => {

  const ch = new ConsumerHolder();

  return (
    <div className="overflow-hidden bg-gray-900" style={{ display: 'flex', flexShrink: 0, height: '100%', color: 'white'}}>
      <div className="overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, backgroundColor: '#202020' }}>
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
              <option value="perlin">None</option>
            </select>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Post Processing</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}>
              <option value="perlin">None</option>
            </select>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Material</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}>
              <option value="perlin">None</option>
            </select>
          </div>


        </div>
      </div>
      <div className="overflow-none" style={{ flexGrow: 1, width: '1000px' }}>
        <World ch={ch} />
      </div>
    </div>
  );
};

export default App;