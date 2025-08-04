import { useEffect, useMemo, useState } from "react";
import { FunctionHolder } from "./logic/FunctionHolder";
import { World } from "./components/World";
import { PerlinGenerator } from "./functions/perlinheight/PerlinHeight";
import { PerlinSunshineGenerator } from "./functions/perlinsunshine/PerlinSunshine";
import { BiomeByHeight } from "./functions/biomebyheight/BiomeByHeight";
import { BiomeByHeightAndHumidityAndTemperature } from "./functions/biomebyheightandhumidityandtemperature/BiomeByHeightAndHumidityAndTemperature";
import { ColorByBiome } from "./functions/colorbybiome/ColorByBiome";
import { ColorByHeight } from "./functions/colorbyheight/ColorByHeight";
import { NoPostProcessing } from "./functions/none/NoPostProcessing";
import { SimpleSmoothing } from "./functions/simplesmoothing/SimpleSmoothing";
import { SmoothBySteepness } from "./functions/smoothbysteepness/SmoothBySteepness";
import { SmoothByHeight } from "./functions/smoothbyheight/SmoothByHeight";
import { WaterByHeight } from "./functions/waterbyheight/WaterByHeight";
import { NoHeight } from "./functions/none/NoHeight";
import { NoTemperature } from "./functions/none/NoTemperature";
import { NoWater } from "./functions/none/NoWater";
import { NoHumidity } from "./functions/none/NoHumidity";
import { NoSunshine } from "./functions/none/NoSunshine";
import { TemperatureBySunshine } from "./functions/temperaturebysunshine/TemperatureBySunshine";
import { TemperatureByHeight } from "./functions/temperaturebyheight/TemperatureByHeight";
import { TemperatureByHeightAndSunshine } from "./functions/temperaturebyheightandsunshine/TemperatureByHeightAndSunshine";
import { PerlinHumidity } from "./functions/perlinhumidity/PerlinHumidity";
import { WarpedMapGenerator } from "./functions/warpedmap/WarpedMap";
import { ClassicFBMGenerator } from "./functions/classicfbm/ClassicFBM";
import { WorldSettings } from "./components/WorldSettings";
import { div } from "three/examples/jsm/nodes/Nodes.js";

const App = () => {

  const fh = useMemo(() => {
    const holder = new FunctionHolder();
    holder.setTimeUpdateCallback((times: { [key: string]: number }) => {
      setTimes(prevTimes => ({
        ...prevTimes,
        ...times
      }));
    });
    return holder;
  }, []);

  const [heightNoiseFunction, setHeightNoiseFunction] = useState("perlin");
  const [fractalHeightMapGenerator, setFractalHeightMapGenerator] = useState("classicfbm");
  const [sunshineMapGenerator, setSunshineMapGenerator] = useState("perlin");
  const [biomeGenerator, setBiomeGenerator] = useState("biomebyheightandhumidityandtemperature");
  const [postProcessing, setPostProcessing] = useState('nopostprocessing');
  const [colorGenerator, setColorGenerator] = useState("colorbybiome");
  const [waterGenerator, setWaterGenerator] = useState("waterbyheight");
  const [humidityGenerator, setHumidityGenerator] = useState("perlin");
  const [temperatureGenerator, setTemperatureGenerator] = useState("temperaturebyheightandsunshine");
  // const [vegetationGenerator, setVegetationGenerator] = useState("none");

  const [worldRendered, setWorldRendered] = useState(false);
  const [times, setTimes] = useState({ height: 0, sunshine: 0, biome: 0, postProcessing: 0, color: 0, water: 0 });
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  useEffect(() => {
    if (showRightSidebar) {
      fh.updateRightSidebar();
    }
  }, [showRightSidebar]);

  fh.setHeightMapImageConsumer((heightMapImage) => {
    heightMapImage.style.maxWidth = '196px';
    heightMapImage.style.maxHeight = '196px';
    if (document.getElementById('height-map-image')) {
      document.getElementById('height-map-image')!.innerHTML = "";
      document.getElementById('height-map-image')!.appendChild(heightMapImage);
    }
  })

  fh.setWaterMapImageConsumer((waterMapImage) => {
    waterMapImage.style.maxWidth = '196px';
    waterMapImage.style.maxHeight = '196px';
    if (document.getElementById('water-map-image')) {
      document.getElementById('water-map-image')!.innerHTML = "";
      document.getElementById('water-map-image')!.appendChild(waterMapImage);
    }
  })
  
  fh.setHumidityMapImageConsumer((humidityMapImage) => {
    humidityMapImage.style.maxWidth = '196px';
    humidityMapImage.style.maxHeight = '196px';
    if (document.getElementById('humidity-map-image')) {
      document.getElementById('humidity-map-image')!.innerHTML = "";
      document.getElementById('humidity-map-image')!.appendChild(humidityMapImage);
    }
  })

  fh.setSunshineMapImageConsumer((sunshineMapImage) => {
    sunshineMapImage.style.maxWidth = '196px';
    sunshineMapImage.style.maxHeight = '196px';
    if (document.getElementById('sunshine-map-image')) {
      document.getElementById('sunshine-map-image')!.innerHTML = "";
      document.getElementById('sunshine-map-image')!.appendChild(sunshineMapImage);
    }
  })

  fh.setTemperatureMapImageConsumer((temperatureMapImage) => {
    temperatureMapImage.style.maxWidth = '196px';
    temperatureMapImage.style.maxHeight = '196px';
    if (document.getElementById('temperature-map-image')) {
      document.getElementById('temperature-map-image')!.innerHTML = "";
      document.getElementById('temperature-map-image')!.appendChild(temperatureMapImage);
    }
  })

  fh.setBiomeMapImageConsumer((biomeMapImage) => {
    biomeMapImage.style.maxWidth = '196px';
    biomeMapImage.style.maxHeight = '196px';
    if (document.getElementById('biome-map-image')) {
      document.getElementById('biome-map-image')!.innerHTML = "";
      document.getElementById('biome-map-image')!.appendChild(biomeMapImage);
    }
  })

  fh.setColorMapImageConsumer((colorMapImage) => {
    colorMapImage.style.maxWidth = '196px';
    colorMapImage.style.maxHeight = '196px';
    if (document.getElementById('color-map-image')) {
      document.getElementById('color-map-image')!.innerHTML = "";
      document.getElementById('color-map-image')!.appendChild(colorMapImage);
    }
  })

  
  const handleHeightNoiseFunctionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHeightNoiseFunction(event.target.value);
  };

  const handleFractalHeightMapGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFractalHeightMapGenerator(event.target.value);
  };

  const handleSunshineMapGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSunshineMapGenerator(event.target.value);
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

  const handleWaterGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWaterGenerator(event.target.value);
  };

  const handleHumidityGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHumidityGenerator(event.target.value);
  };

  const handleTemperatureGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTemperatureGenerator(event.target.value);
  };

  // const handleVegetationGeneratorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setVegetationGenerator(event.target.value);
  // };
  

  return (
    <div className="bg-gray-900" style={{ display: 'flex', flexDirection: 'row', height: '100vh', color: 'white'}}>
      <button 
        onClick={() => setShowRightSidebar(!showRightSidebar)}
        style={{
          position: 'absolute',
          right: showRightSidebar ? '240px' : '10px',
          top: '10px',
          padding: '8px 16px',
          backgroundColor: '#404040',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        {showRightSidebar ? 'Hide Maps' : 'Show Maps'}
      </button>
      <div className="overflow-y-auto" style={{ flex: "0 0 260px", backgroundColor: '#202020' }}>
        {/* Left sidebar content */}

      <div style={{ width: '260px', flexShrink: 0, padding: '16px', backgroundColor: '#101010' }}>
        <WorldSettings fh={fh} />
      </div> 

        {worldRendered && (
          <div style={{ width: '260px', flexShrink: 0, padding: '16px', backgroundColor: '#101010' }}>
            <div style={{ padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Height Noise Function</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={heightNoiseFunction} onChange={handleHeightNoiseFunctionChange}>
                <option value="none">None</option>
                <option value="perlin">Perlin Noise</option>
              </select>

              { heightNoiseFunction === "none" && (
                <NoHeight fh={fh} />
              ) }
              { heightNoiseFunction === "perlin" && (
                <PerlinGenerator fh={fh} />
              ) }
              <br/>
              <p>Generation time: {times.height}ms</p>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Fractal Height Map Generator</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={fractalHeightMapGenerator} onChange={handleFractalHeightMapGeneratorChange}>
                <option value="classicfbm">Classic fBm</option>
                <option value="warped">Warped fBm</option>
              </select>
              { fractalHeightMapGenerator === "classicfbm" && (
                <ClassicFBMGenerator fh={fh} />
              ) }
              { fractalHeightMapGenerator === "warped" && (
                <WarpedMapGenerator fh={fh} />
              ) }
              <br/>
              <p>Generation time: {times.height}ms</p>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Sunshine Map</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={sunshineMapGenerator} onChange={handleSunshineMapGeneratorChange}>
                <option value="noperlin">None</option>
                <option value="perlin">Perlin Noise</option>
              </select>
              { sunshineMapGenerator === "noperlin" && (
                <NoSunshine fh={fh} />
              ) }
              { sunshineMapGenerator === "perlin" && (
                <PerlinSunshineGenerator fh={fh} />
              ) }
              <br/>
              <p>Generation time: {times.sunshine}ms</p>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Post Processing</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={postProcessing} onChange={handlePostProcessingChange}
                >
                <option value="nopostprocessing">None</option>
                <option value="simplesmoothing">Simple smoothing</option>
                <option value="smoothbysteepness">Smooth by steepness</option>
                <option value="smoothbyheight">Smooth by height</option>
              </select>
              {postProcessing === "nopostprocessing" && (
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
              <p>Generation time: {fh.getTimes()["postProcessing"]}ms</p>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Water</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={waterGenerator} onChange={handleWaterGeneratorChange}>
                <option value="nowater">None</option>
                <option value="waterbyheight">Water by height</option>
              </select>
              {waterGenerator === "nowater" && (
                <NoWater fh={fh} />
              )}
              {waterGenerator === "waterbyheight" && (
                <WaterByHeight fh={fh} />
              )}
              <br/>
              <p>Generation time: {fh.getTimes()["water"]}ms</p>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Humidity</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={humidityGenerator} onChange={handleHumidityGeneratorChange}>
                <option value="none">None</option>
                <option value="perlin">Perlin Humidity</option>
              </select>
              {humidityGenerator === "none" && (
                <NoHumidity fh={fh} />
              )}
              {humidityGenerator === "perlin" && (
                <PerlinHumidity fh={fh} />
              )}
              <br/>
              <p>Generation time: {fh.getTimes()["humidity"]}ms</p>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Temperature</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={temperatureGenerator} onChange={handleTemperatureGeneratorChange}>
                <option value="none">None</option>
                <option value="temperaturebysunshine">Temperature by sunshine</option>
                <option value="temperaturebyheight">Temperature by height</option>
                <option value="temperaturebyheightandsunshine">Temperature by height and sunshine</option>
              </select>
              {temperatureGenerator === "none" && (
                <NoTemperature fh={fh} />
              )}
              {temperatureGenerator === "temperaturebysunshine" && (
                <TemperatureBySunshine fh={fh} />
              )}
              {temperatureGenerator === "temperaturebyheight" && (
                <TemperatureByHeight fh={fh} />
              )}
              {temperatureGenerator === "temperaturebyheightandsunshine" && (
                <TemperatureByHeightAndSunshine fh={fh} />
              )}
              <br/>
              <p>Generation time: {fh.getTimes()["temperature"]}ms</p>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Biome</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px' , backgroundColor: '#2b2a33'}}
                value={biomeGenerator} onChange={handleBiomeGeneratorChange}>
                <option value="biomebyheight">Biome by height</option>
                <option value="biomebyheightandhumidityandtemperature">Biome by height, humidity and temperature</option>
              </select>
              {biomeGenerator === "biomebyheight" && (
                <BiomeByHeight fh={fh} />
              )}
              {biomeGenerator === "biomebyheightandhumidityandtemperature" && (
                <BiomeByHeightAndHumidityAndTemperature fh={fh} />
              )}
              <p>Generation time: {times.biome}ms</p>
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
              <br/>
              <p>Generation time: {fh.getTimes()["color"]}ms</p>
            </div>

            {/* <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#202020' }}>
              <h1 style={{ marginBottom: '16px' }}>Vegetation</h1>
              <select style={{ width: '100%', padding: '8px', marginBottom: '16px', backgroundColor: '#2b2a33' }}
                value={vegetationGenerator} onChange={handleVegetationGeneratorChange}>
                <option value="none">None</option>
              </select>
              <br/>
              <p>Generation time: {fh.getTimes()["vegetation"]}ms</p>
            </div> */}

          </div>
        )}
        {!worldRendered && (
          <div style={{ padding: '16px', backgroundColor: '#202020' }}>
            <p>Generating initial world...</p>
            <p>Please wait for the UI to load.</p>
          </div>
        )}
      </div>
      <div className="overflow-hidden" style={{ flex: 1, width: '1000px' }}>
        <World fh={fh} onLoad={() => setWorldRendered(true)} />
      </div>
      {showRightSidebar && (
        <div className="overflow-y-auto" style={{ flex: "0 0 228px", backgroundColor: '#202020', position: 'relative' }}>
        {worldRendered && (
          <div style={{ padding: '16px', backgroundColor: '#202020' }}>
          <p>Raw Height map</p>
          <div id="height-map-image" style={{ 
            width: '200px', 
            height: '200px',
            marginTop: '16px',
            backgroundColor: '#101010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          <br/>
          <p>Water map</p>
          <div id="water-map-image" style={{ 
            width: '200px', 
            height: '200px',
            marginTop: '16px',
            backgroundColor: '#101010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          <br/>
          <p>Humidity map</p>
          <div id="humidity-map-image" style={{ 
            width: '200px', 
            height: '200px',
            marginTop: '16px',
            backgroundColor: '#101010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          <br/>
          <p>Sunshine map</p>
          <div id="sunshine-map-image" style={{ 
            width: '200px', 
            height: '200px',
            marginTop: '16px',
            backgroundColor: '#101010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          <br/>
          <p>Temperature map</p>
          <div id="temperature-map-image" style={{ 
            width: '200px', 
            height: '200px',
            marginTop: '16px',
            backgroundColor: '#101010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          <br/>
          <p>Biome map</p>
          <div id="biome-map-image" style={{ 
            width: '200px', 
            height: '200px',
            marginTop: '16px',
            backgroundColor: '#101010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          <br/>
          <p>Color map</p>
          <div id="color-map-image" style={{ 
            width: '200px', 
            height: '200px',
            marginTop: '16px',
            backgroundColor: '#101010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default App;