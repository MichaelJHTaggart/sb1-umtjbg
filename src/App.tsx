import React, { useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { DiceResults } from './components/DiceResults';
import { useGameStore } from './store/gameStore';

function App() {
  const initializeGame = useGameStore(state => state.initializeGame);

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-900 relative">
      <GameBoard />
      <DiceResults />
      <GameControls />
    </div>
  );
}

export default App;