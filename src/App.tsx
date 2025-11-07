import { useMemo, useState } from "react";
import { World } from "./components/World";
import FinalAssembly from "./logic/FinalAssembly";
import { registerGenerators } from "./generators/GeneratorRegistration";

const App = () => {

  const [showRightSidebar, setShowRightSidebar] = useState(false);  
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
      {/* <button 
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
      </button> */}
      <div className="overflow-y-auto" style={{ flex: "0 0 260px", backgroundColor: '#080808', padding: '10px'}}>
        {
          // Left sidebar
          fA.panel([], triggerUpdate)
        }
      </div>
      <div className="overflow-hidden" style={{ flex: 1, width: '1000px' }}>
        <World finalAssembly={fA} />
      </div>
    </div>
  );
};

export default App;