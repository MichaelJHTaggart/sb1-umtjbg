import React, { useState } from 'react';
import { Dice6, SkipForward, Plus, Minus } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function GameControls() {
  const [deployUnits, setDeployUnits] = useState(1);
  const { 
    players, 
    currentPlayer, 
    phase, 
    selectedTerritory,
    targetTerritory,
    territories,
    attack,
    endTurn,
    deployUnits: deployUnitsToTerritory
  } = useGameStore();

  const currentPlayerState = players[currentPlayer];
  const selectedTerritoryData = selectedTerritory 
    ? territories.find(t => t.id === selectedTerritory)
    : null;

  const canDeploy = selectedTerritoryData?.owner === currentPlayer && currentPlayerState.units >= deployUnits;

  const handleDeploy = () => {
    if (selectedTerritory && canDeploy) {
      deployUnitsToTerritory(selectedTerritory, deployUnits);
    }
  };

  const handleAttack = () => {
    if (selectedTerritory && targetTerritory) {
      attack(selectedTerritory, targetTerritory);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: players[currentPlayer].color }}
            />
            <span className="font-bold">{players[currentPlayer].name}</span>
            <span className="text-gray-400">({currentPlayerState.units} units)</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="capitalize">{phase} Phase</span>
        </div>

        <div className="flex items-center space-x-4">
          {phase === 'deploy' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDeployUnits(prev => Math.max(1, prev - 1))}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <Minus size={20} />
                </button>
                <span className="w-8 text-center">{deployUnits}</span>
                <button
                  onClick={() => setDeployUnits(prev => Math.min(currentPlayerState.units, prev + 1))}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <Plus size={20} />
                </button>
              </div>
              <button
                onClick={handleDeploy}
                disabled={!canDeploy}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  canDeploy 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Deploy Units
              </button>
            </div>
          )}

          {phase === 'attack' && selectedTerritory && targetTerritory && (
            <button
              onClick={handleAttack}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Dice6 size={20} />
              <span>Roll Dice</span>
            </button>
          )}

          <button
            onClick={endTurn}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <SkipForward size={20} />
            <span>End Turn</span>
          </button>
        </div>
      </div>
    </div>
  );
}