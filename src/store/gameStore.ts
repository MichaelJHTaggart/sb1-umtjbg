import { create } from 'zustand';
import { GameState, Territory, Player } from '../types/game';
import { generateBoard } from '../utils/boardGenerator';

const INITIAL_PLAYERS: Player[] = [
  { id: 0, name: 'Player 1', color: '#FF6B6B', territories: 0, units: 20 },
  { id: 1, name: 'Player 2', color: '#4ECDC4', territories: 0, units: 20 },
  { id: 2, name: 'Player 3', color: '#95A5A6', territories: 0, units: 20 },
];

interface GameStore extends GameState {
  initializeGame: () => void;
  selectTerritory: (id: string) => void;
  deployUnits: (territoryId: string, units: number) => void;
  attack: (from: string, to: string) => void;
  endTurn: () => void;
  rollDice: (attackerUnits: number, defenderUnits: number) => number[];
}

export const useGameStore = create<GameStore>((set, get) => ({
  players: INITIAL_PLAYERS,
  territories: [],
  currentPlayer: 0,
  phase: 'deploy',
  selectedTerritory: null,
  targetTerritory: null,
  diceResults: [],

  initializeGame: () => {
    const territories = generateBoard();
    // Count initial territories for each player
    const playerTerritories = territories.reduce((acc, t) => {
      acc[t.owner] = (acc[t.owner] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const updatedPlayers = INITIAL_PLAYERS.map(p => ({
      ...p,
      territories: playerTerritories[p.id] || 0
    }));
    
    set({ territories, players: updatedPlayers });
  },

  selectTerritory: (id: string) => {
    const { selectedTerritory, phase, territories, currentPlayer } = get();
    const territory = territories.find(t => t.id === id);
    
    if (!territory) return;
    
    if (phase === 'deploy') {
      if (territory.owner === currentPlayer) {
        set({ selectedTerritory: id });
      }
    } else if (phase === 'attack') {
      if (!selectedTerritory && territory.owner === currentPlayer && territory.units > 1) {
        set({ selectedTerritory: id });
      } else if (selectedTerritory) {
        const attackingTerritory = territories.find(t => t.id === selectedTerritory);
        if (attackingTerritory?.neighbors.includes(id) && territory.owner !== currentPlayer) {
          set({ targetTerritory: id });
        } else if (id === selectedTerritory) {
          set({ selectedTerritory: null, targetTerritory: null });
        }
      }
    }
  },

  deployUnits: (territoryId: string, units: number) => {
    const { territories, players, currentPlayer } = get();
    const player = players[currentPlayer];
    
    if (units > player.units) return;
    
    const updatedTerritories = territories.map(t => 
      t.id === territoryId ? { ...t, units: t.units + units } : t
    );
    
    const updatedPlayers = players.map(p =>
      p.id === currentPlayer ? { ...p, units: p.units - units } : p
    );
    
    set({ 
      territories: updatedTerritories, 
      players: updatedPlayers,
      phase: player.units - units <= 0 ? 'attack' : 'deploy',
      selectedTerritory: null
    });
  },

  attack: (from: string, to: string) => {
    const { territories, rollDice } = get();
    const attacker = territories.find(t => t.id === from)!;
    const defender = territories.find(t => t.id === to)!;
    
    const attackDice = Math.min(3, attacker.units - 1);
    const defendDice = Math.min(2, defender.units);
    
    const results = rollDice(attackDice, defendDice);
    set({ diceResults: results });
    
    // Compare dice rolls and update units
    const attackRolls = results.slice(0, attackDice).sort((a, b) => b - a);
    const defendRolls = results.slice(attackDice, attackDice + defendDice).sort((a, b) => b - a);
    
    let attackerLosses = 0;
    let defenderLosses = 0;
    
    for (let i = 0; i < Math.min(attackRolls.length, defendRolls.length); i++) {
      if (attackRolls[i] > defendRolls[i]) {
        defenderLosses++;
      } else {
        attackerLosses++;
      }
    }
    
    const updatedTerritories = territories.map(t => {
      if (t.id === from) {
        return { ...t, units: t.units - attackerLosses };
      }
      if (t.id === to) {
        return { ...t, units: t.units - defenderLosses };
      }
      return t;
    });
    
    set({ territories: updatedTerritories });
  },

  endTurn: () => {
    const { currentPlayer, players } = get();
    const nextPlayer = (currentPlayer + 1) % players.length;
    
    // Calculate reinforcements (minimum 3, plus territory bonuses)
    const reinforcements = Math.max(3, Math.floor(players[nextPlayer].territories / 3));
    
    const updatedPlayers = players.map(p =>
      p.id === nextPlayer ? { ...p, units: p.units + reinforcements } : p
    );
    
    set({ 
      currentPlayer: nextPlayer,
      players: updatedPlayers,
      phase: 'deploy',
      selectedTerritory: null,
      targetTerritory: null,
      diceResults: []
    });
  },

  rollDice: (attackerUnits: number, defenderUnits: number) => {
    const attackRolls = Array(attackerUnits).fill(0).map(() => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    const defendRolls = Array(defenderUnits).fill(0).map(() => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    return [...attackRolls, ...defendRolls];
  },
}));