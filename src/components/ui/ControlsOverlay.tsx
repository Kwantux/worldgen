import React from 'react';

export function ControlsOverlay() {
  return (
    <div className="absolute bottom-4 left-4 text-white bg-black/50 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Controls</h2>
      <ul className="space-y-1">
        <li>W/S - Move forward/backward</li>
        <li>A/D - Move left/right</li>
        <li>Space - Move up</li>
        <li>Shift - Move down</li>
        <li>Mouse - Look around</li>
      </ul>
    </div>
  );
}