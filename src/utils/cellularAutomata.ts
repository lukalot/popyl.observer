interface CellularAutomataRules {
  survival: number[];
  birth: number[];
}

export const generateNextGeneration = (
  currentGrid: boolean[][], 
  rules: CellularAutomataRules
): boolean[][] => {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  const nextGrid = Array(rows).fill(0).map(() => Array(cols).fill(false));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(currentGrid, i, j);
      
      if (currentGrid[i][j]) {
        // Cell is alive - check survival rules
        nextGrid[i][j] = rules.survival.includes(neighbors);
      } else {
        // Cell is dead - check birth rules
        nextGrid[i][j] = rules.birth.includes(neighbors);
      }
    }
  }

  return nextGrid;
};

// Helper function to convert rule string to number array
export const parseRuleString = (ruleString: string): number[] => {
  return [...ruleString].map(Number);
};

const countNeighbors = (grid: boolean[][], row: number, col: number): number => {
  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      
      const newRow = (row + i + rows) % rows;
      const newCol = (col + j + cols) % cols;
      
      if (grid[newRow][newCol]) count++;
    }
  }

  return count;
}; 