import { Fragment, useEffect, useMemo, useState } from 'react';
import { FunctionHolder } from '../../logic/FunctionHolder';
import { TileMesh } from './TileMesh';

export const SEGMENTS = 64;

export const Terrain: React.FC<{ fh: FunctionHolder; onLoad?: () => void }> = ({ fh, onLoad }) => {
  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  const [updateCallback, setUpdateCallback] = useState(false);

  useEffect(() => {
    const callback = () => {
      // Force re-render when tiles are updated
      setUpdateCallback(true);
    };
    fh.addTileUpdateCallback(callback);
    return () => {
      fh.removeTileUpdateCallback(callback);
    };
  }, [fh]);

  const tiles = useMemo(() => {
    console.log("Updating tiles");
    const tiles: React.ReactNode[] = [];
    for (const [, tile] of fh.getTiles()) {
      const key = `${tile.getX()}-${tile.getY()}`;
      tiles.push(<TileMesh key={key} tile={tile} />);
    }
    setUpdateCallback(false);
    return tiles;
  }, [fh, updateCallback]);

  return (
    <Fragment>
      {tiles}
    </Fragment>
  );
}