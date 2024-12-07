import React, { useState, useEffect, useCallback } from 'react';
import { VoxelGrid } from './VoxelGrid';
import { generateNextGeneration } from '../utils/cellularAutomata';
import { CameraController } from './CameraController';

interface CellularAutomata3DProps {
  gridSize: number;
  maxGenerations: number;
  frameDelay: number;
  rules: {
    survival: number[];
    birth: number[];
  };
  initialMode: 'SOUP' | 'SINGLE';
  soupDensity: number;
}

export const CellularAutomata3D: React.FC<CellularAutomata3DProps> = ({
  gridSize,
  maxGenerations,
  frameDelay,
  rules,
  initialMode,
  soupDensity
}) => {
  const initializeGrid = useCallback(() => {
    if (initialMode === 'SINGLE') {
      // Create empty grid
      const grid = Array(gridSize).fill(0).map(() =>
        Array(gridSize).fill(false)
      );
      
      // Set center cell to true
      const center = Math.floor(gridSize / 2);
      grid[center][center] = true;
      
      return grid;
    } else {
      // Initialize with random cells based on density
      return Array(gridSize).fill(0).map(() =>
        Array(gridSize).fill(0).map(() =>
          Math.random() < soupDensity
        )
      );
    }
  }, [gridSize, initialMode, soupDensity]);

  const [generations, setGenerations] = useState<boolean[][][]>(() => {
    return [initializeGrid()];
  });
  
  // Add selectedLayer state
  const [selectedLayer, setSelectedLayer] = useState<number>(0);

  const generateNextLayer = useCallback(() => {
    if (generations.length >= maxGenerations) return;

    const currentLayer = generations[generations.length - 1];
    const nextLayer = generateNextGeneration(currentLayer, rules);
    
    setGenerations(prev => [...prev, nextLayer]);
  }, [generations, maxGenerations, rules]);

  useEffect(() => {
    const timer = setInterval(generateNextLayer, frameDelay);
    return () => clearInterval(timer);
  }, [generateNextLayer, frameDelay]);

  const handleLayerSelect = (layer: number) => {
    setSelectedLayer(layer);
  };

  return (
    <>
      <CameraController 
        selectedLayer={selectedLayer} 
        distance={45}
      />
      <VoxelGrid generations={generations} onLayerSelect={handleLayerSelect} />
    </>
  );
}; 