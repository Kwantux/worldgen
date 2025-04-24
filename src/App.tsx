import { useMemo, useState } from "react";
import { FunctionHolder } from "./functions/FunctionHolder";
import { World } from "./components/World";
import { PerlinGenerator } from "./functions/perlin/PerlinGenerator";
import { BiomeByHeight } from "./functions/biomebyheight/BiomeByHeight";
import { ColorByBiome } from "./functions/colorbybiome/ColorByBiome";
import { ColorByHeight } from "./functions/colorbyheight/ColorByHeight";
import { NoPostProcessing } from "./functions/nopostprocessing/NoPostProcessing";
import { SimpleSmoothing } from "./functions/simplesmoothing/SimpleSmoothing";
import { SmoothBySteepness } from "./functions/smoothbysteepness/SmoothBySteepness";
import { SmoothByHeight } from "./functions/smoothbyheight/SmoothByHeight";

const App = () => {

  const fh = useMemo(() => new FunctionHolder(), []);

  const [heightMapGenerator, setHeightMapGenerator] = useState("perlin");
  const [biomeGenerator, setBiomeGenerator] = useState("biomebyheight");
  const [postProcessing, setPostProcessing] = useState('none');
  const [colorGenerator, setColorGenerator] = useState("colorbybiome");

  const [worldRendered, setWorldRendered] = useState(false);

  const handleHeightMapGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHeightMapGenerator(event.target.value);
  };
  
  const handleBiomeGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBiomeGenerator(event.target.value);
  };

  const handlePostProcessingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPostProcessing(event.target.value);
  }
  
  const handleColorGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setColorGenerator(event.target.value);
  };
  
  return (
    <div className="bg-gray-900" style={{ display: 'flex', flexDirection: 'row', height: '100vh', color: 'white'}}>
      <div className="overflow-y-auto" style={{ flex: "0 0 260px", backgroundColor: '#202020' }}>
        {worldRendered && (
          <div style={{ width: '260px', flexShrink: 0, padding: '16px', backgroundColor: '#101010' }}>
            <div style={{ padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Height Map</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={heightMapGenerator} onChange={handleHeightMapGeneratorChange}>
                <option value="none">None</option>
                <option value="perlin">Perlin Noise</option>
              </select>
              { heightMapGenerator === "perlin" && (
                <PerlinGenerator fh={fh} />
              ) }
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Biome</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px' , backgroundColor: '#2b2a33'}}
                value={biomeGenerator} onChange={handleBiomeGeneratorChange}>
                <option value="biomebyheight">Biome by height</option>
              </select>
              {biomeGenerator === "biomebyheight" && (
                <BiomeByHeight fh={fh} />
              )}
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Post Processing</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={postProcessing} onChange={handlePostProcessingChange}
              >
                <option value="none">None</option>
                <option value="simplesmoothing">Simple smoothing</option>
                <option value="smoothbysteepness">Smooth by steepness</option>
                <option value="smoothbyheight">Smooth by height</option>
              </select>
              {postProcessing === "none" && (
                <NoPostProcessing fh={fh} />
              )}
              {postProcessing === "simplesmoothing" && (
                <SimpleSmoothing fh={fh} />
              )}
              {postProcessing === "smoothbysteepness" && (
                <SmoothBySteepness fh={fh} />
              )}
              {postProcessing === "smoothbyheight" && (
                <SmoothByHeight fh={fh} />
              )}
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Material</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={colorGenerator} onChange={handleColorGeneratorChange}>
                <option value="colorbybiome">Color by biome</option>
                <option value="colorbyheight">Color by height</option>
              </select>
              {colorGenerator === "colorbybiome" && (
                <ColorByBiome fh={fh} />
              )}
              {colorGenerator === "colorbyheight" && (
                <ColorByHeight fh={fh} />
              )}
              </div>
          </div>
        )}
      </div>
      <div className="overflow-hidden" style={{ flex: 1, width: '1000px' }}>
        <World fh={fh} onLoad={() => setWorldRendered(true)} />
      </div>
    </div>
  );
};

export default App;