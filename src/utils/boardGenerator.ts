import { Territory } from '../types/game';

export function generateBoard(): Territory[] {
  const territories: Territory[] = [];
  const radius = 3; // Smaller radius for better gameplay
  const directions = [
    [1, 0], [1, -1], [0, -1],
    [-1, 0], [-1, 1], [0, 1]
  ];
  
  // Generate hexagonal grid coordinates
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    
    for (let r = r1; r <= r2; r++) {
      const x = q * 1.732; // √3
      const y = r + (q / 2);
      
      territories.push({
        id: `${q},${r}`,
        x,
        y,
        owner: Math.floor(Math.random() * 3),
        units: Math.floor(Math.random() * 3) + 1,
        neighbors: []
      });
    }
  }
  
  // Calculate neighbors
  territories.forEach(t1 => {
    const [q1, r1] = t1.id.split(',').map(Number);
    
    directions.forEach(([dq, dr]) => {
      const neighborId = `${q1 + dq},${r1 + dr}`;
      if (territories.some(t => t.id === neighborId)) {
        t1.neighbors.push(neighborId);
      }
    });
  });
  
  return territories;
}