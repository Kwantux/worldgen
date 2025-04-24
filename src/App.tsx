import { useState } from "react";
import { ConsumerHolder } from "./functions/ConsumerHolder";
import { World } from "./components/World";
import { PerlinGenerator } from "./functions/perlin/PerlinGenerator";
import { BiomeByHeight } from "./functions/biomebyheight/BiomeByHeight";
import { ColorByBiome } from "./functions/colorbybiome/ColorByBiome";
import { ColorByHeight } from "./functions/colorbyheight/ColorByHeight";

const App = () => {

  const ch = new ConsumerHolder();

  const [heightMapGenerator, setHeightMapGenerator] = useState("perlin");
  const [biomeGenerator, setBiomeGenerator] = useState("biomebyheight");
  const [colorGenerator, setColorGenerator] = useState("colorbybiome");

  const handleHeightMapGeneratorChange = (event) => {
    setHeightMapGenerator(event.target.value);
  };

  const handleBiomeGeneratorChange = (event) => {
    setBiomeGenerator(event.target.value);
  };

  const handleColorGeneratorChange = (event) => {
    setColorGenerator(event.target.value);
  };

  return (
    <div className="bg-gray-900" style={{ display: 'flex', flexDirection: 'row', height: '100vh', color: 'white'}}>
      <div className="overflow-y-auto" style={{ flex: "0 0 260px", backgroundColor: '#202020' }}>
        <div style={{ width: '260px', flexShrink: 0, padding: '16px', backgroundColor: '#101010' }}>

          <div style={{ padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Height Map</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
              value={heightMapGenerator} onChange={handleHeightMapGeneratorChange}>
              <option value="none">None</option>
              <option value="perlin">Perlin Noise</option>
            </select>
            { heightMapGenerator === "perlin" && (
              <PerlinGenerator ch={ch} />
            ) }
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Biome</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px' , backgroundColor: '#2b2a33'}}
              value={biomeGenerator} onChange={handleBiomeGeneratorChange}>
              <option value="biomebyheight">Biome by height</option>
            </select>
            {biomeGenerator === "biomebyheight" && (
              <BiomeByHeight ch={ch} />
            )}
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Post Processing</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
            >
              <option value="none">None</option>
            </select>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
            <h1 style={{ marginBottom: '16px' }}>Material</h1>
            <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
              value={colorGenerator} onChange={handleColorGeneratorChange}>
              <option value="colorbybiome">Color by biome</option>
              <option value="colorbyheight">Color by height</option>
            </select>
            {colorGenerator === "colorbybiome" && (
              <ColorByBiome ch={ch} />
            )}
            {colorGenerator === "colorbyheight" && (
              <ColorByHeight ch={ch} />
            )}
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