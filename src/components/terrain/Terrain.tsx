import { Fragment, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { FunctionHolder } from '../../logic/FunctionHolder';
import { TileMesh } from './TileMesh';

export const SEGMENTS = 512;

export const Terrain: React.FC<{ fh: FunctionHolder; onLoad?: () => void }> = ({ fh, onLoad }) => {

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  const tiles = useMemo(() => {
    const tiles: React.ReactNode[] = [];
    for (const [position, tile] of fh.getTiles()) {
      tiles.push(<TileMesh tile={tile} />);
    }
    console.log(tiles);
    return tiles;
  }, [fh, fh.tiles]);

  return (
    <Fragment>
      {tiles}
    </Fragment>
  );
}