import React, { useState } from 'react';
import { FunctionHolder } from '../logic/FunctionHolder';

export const WorldSettings: React.FC<{
    fh: FunctionHolder
}> = ({ fh }) => {

  const [tiles, setTiles] = useState(1);

  const handleTilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTiles(e.target.valueAsNumber);
    fh.generateTiles(e.target.valueAsNumber);
  };
  
  return (
    <div>
      <label>Radius of World (in Tiles):</label>
      <input type="number" value={tiles} onChange={handleTilesChange} style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
      <label>Segments per Tile:</label>
      <input type="number" value={fh.getSegments()} onChange={(e) => fh.setSegments(e.target.valueAsNumber)} style={{ backgroundColor: '#2b2a33', padding : '4px', width: '100%'}} />
    </div>
  );
};