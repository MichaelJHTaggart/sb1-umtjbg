import React from 'react';
import { useGameStore } from '../store/gameStore';

export function DiceResults() {
  const { diceResults } = useGameStore();

  if (diceResults.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4">
      <div className="flex space-x-4">
        <div className="text-center">
          <h3 className="font-bold text-red-500">Attacker</h3>
          <div className="flex space-x-2 mt-2">
            {diceResults.slice(0, 3).map((result, i) => (
              <div
                key={`attack-${i}`}
                className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center font-bold text-red-500"
              >
                {result}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-blue-500">Defender</h3>
          <div className="flex space-x-2 mt-2">
            {diceResults.slice(3).map((result, i) => (
              <div
                key={`defend-${i}`}
                className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-500"
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}