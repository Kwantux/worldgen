import { ConsumerHolder } from "./functions/ConsumerHolder";
import { World } from "./components/World";
import { PerlinGenerator } from "./functions/perlin/PerlinGenerator";

const App = () => {

  const ch = new ConsumerHolder();

  return (
    <div style={{ display: 'flex', height: '100vh', color: 'white' }}>
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
      <div style={{ flexGrow: 1 }}>
        <World ch={ch} />
      </div>
    </div>
  );
};

export default App;