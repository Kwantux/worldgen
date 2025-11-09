import { useMemo, useState } from "react";
import { World } from "./components/World";
import FinalAssembly from "./logic/FinalAssembly";
import { registerGenerators } from "./generators/GeneratorRegistration";

const App = () => {

  const [_, updateTrigger] = useState({});

  registerGenerators();

  const fA = useMemo(() => {
    return FinalAssembly.getInstance();
  }, []);

  const triggerUpdate = () => {
    updateTrigger({});
  };

  return (
    <div className="bg-gray-900" style={{ display: 'flex', flexDirection: 'row', height: '100vh', color: 'white'}}>

      {/* Left Sidebar for generator settings */}
      <div className="overflow-y-auto" style={{ flex: "0 0 260px", backgroundColor: '#080808', padding: '10px'}}>
        {
          fA.panel([], triggerUpdate)
        }
      </div>

      {/* Main Viewport*/}
      <div className="overflow-hidden" style={{ flex: 1, width: '1000px' }}>
        <World finalAssembly={fA} />
      </div>
    </div>
  );
};

export default App;