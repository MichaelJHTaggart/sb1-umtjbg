import React from 'react';
import { Territory as TerritoryType } from '../types/game';
import { useGameStore } from '../store/gameStore';

interface TerritoryProps {
  territory: TerritoryType;
  size: number;
}

export function Territory({ territory, size }: TerritoryProps) {
  const { players, selectedTerritory, selectTerritory } = useGameStore();
  const player = players[territory.owner];
  const isSelected = selectedTerritory === territory.id;

  const points = Array(6).fill(0).map((_, i) => {
    const angle = (i * 60 - 30) * Math.PI / 180;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <g
      transform={`translate(${territory.x * size * 2}, ${territory.y * size * 2})`}
      onClick={() => selectTerritory(territory.id)}
      className="cursor-pointer transform-gpu transition-transform duration-150 ease-in-out hover:scale-[1.02]"
    >
      <polygon
        points={points}
        fill={player.color}
        stroke={isSelected ? '#FFF' : '#2C3E50'}
        strokeWidth={isSelected ? 3 : 1}
        className={`${isSelected ? 'filter drop-shadow-lg' : ''}`}
      />
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFF"
        className="font-bold text-lg select-none pointer-events-none"
        style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}
      >
        {territory.units}
      </text>
    </g>
  );
}