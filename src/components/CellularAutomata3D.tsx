import React, { useState, useEffect, useCallback } from 'react';
import { VoxelGrid } from './VoxelGrid.tsx';
import { generateNextGeneration } from '../utils/cellularAutomata.ts';
import { CameraController } from './CameraController.tsx';

interface CellularAutomata3DProps {
  gridSize: number;
  maxGenerations: number;
  frameDelay: number;
  rules: {
    survival: number[];
    birth: number[];
  };
}

export const CellularAutomata3D: React.FC<CellularAutomata3DProps> = ({
  gridSize,
  maxGenerations,
  frameDelay,
  rules
}) => {
  const [generations, setGenerations] = useState<boolean[][][]>(() => {
    // Initialize with a single layer
    const initialGrid = Array(gridSize).fill(0).map(() =>
      Array(gridSize).fill(0).map(() =>
        Math.random() > 0.85
      )
    );
    return [initialGrid];
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
      <CameraController selectedLayer={selectedLayer} distance={45} />
      <VoxelGrid generations={generations} onLayerSelect={handleLayerSelect} />
    </>
  );
}; 