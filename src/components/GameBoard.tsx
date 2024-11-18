import React from 'react';
import { Territory } from './Territory';
import { useGameStore } from '../store/gameStore';

export function GameBoard() {
  const { territories } = useGameStore();
  const HEX_SIZE = 40;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg
        viewBox="-300 -300 600 600"
        className="max-w-full max-h-full"
      >
        <g>
          {territories.map((territory) => (
            <Territory
              key={territory.id}
              territory={territory}
              size={HEX_SIZE}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}