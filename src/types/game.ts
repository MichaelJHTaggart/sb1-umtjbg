export interface Territory {
  id: string;
  x: number;
  y: number;
  owner: number;
  units: number;
  neighbors: string[];
}

export interface Player {
  id: number;
  name: string;
  color: string;
  territories: number;
  units: number;
}

export interface GameState {
  players: Player[];
  territories: Territory[];
  currentPlayer: number;
  phase: 'deploy' | 'attack' | 'fortify';
  selectedTerritory: string | null;
  targetTerritory: string | null;
  diceResults: number[];
}