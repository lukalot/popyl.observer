import React, { useMemo, useState, useRef, useEffect } from 'react';
import { BoxGeometry, Color, MeshPhongMaterial, InstancedMesh, Object3D, EdgesGeometry, LineSegments, LineBasicMaterial, Frustum, Matrix4 } from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      lineSegments: any;
    }
  }
}

interface VoxelGridProps {
  generations: boolean[][][];
  onLayerSelect?: (layer: number) => void;
}

export const VoxelGrid = ({ generations, onLayerSelect }: VoxelGridProps) => {
  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const hasUserSelectedRef = useRef(false);
  const instanceCountRef = useRef(0);
  const frustumRef = useRef(new Frustum());
  const projScreenMatrixRef = useRef(new Matrix4());
  const mouseDownPositionRef = useRef<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    onLayerSelect?.(0); // Notify parent of initial layer selection
  }, []); // Empty dependency array means this runs once on mount

  // Effect to handle auto-selection of latest layer
  useEffect(() => {
    if (!generations.length) return;
    
    const latestLayer = generations.length - 1;
    
    // Only auto-select if user hasn't manually selected a layer
    if (!hasUserSelectedRef.current) {
      setSelectedLayer(latestLayer);
      onLayerSelect?.(latestLayer);
    }
  }, [generations.length, onLayerSelect]);

  const { boxGeometry, material, instancedMesh } = useMemo(() => {
    const boxGeo = new BoxGeometry(1, 1, 1);
    const mat = new MeshPhongMaterial({ toneMapped: false });
    
    if (!generations.length || !generations[0]?.length || !generations[0]?.[0]?.length) {
      return { boxGeometry: boxGeo, material: mat, instancedMesh: null };
    }
    
    const gridSize = generations[0].length;
    const maxInstances = generations.length * gridSize * gridSize;
    const instMesh = new InstancedMesh(boxGeo, mat, maxInstances);
    instMesh.frustumCulled = true;
    
    return { boxGeometry: boxGeo, material: mat, instancedMesh: instMesh };
  }, [generations]);

  // Pre-calculate colors for better performance
  const colorCache = useMemo(() => {
    const gridSize = generations[0]?.length || 0;
    const cache: Color[][] = [];
    
    for (let height = 0; height < generations.length; height++) {
      cache[height] = [];
      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          const hue = height === 0 ? 
            ((x + z) / (gridSize * 2)) : 
            ((x + z + height) / (gridSize * 2));
          cache[height][x * gridSize + z] = new Color().setHSL(hue, 0.7, 0.64);
        }
      }
    }
    return cache;
  }, [generations]);

  // Create wireframe outline for selected layer
  const wireframe = useMemo(() => {
    if (!generations[0]?.length) return null;
    
    const gridSize = generations[0].length;
    const edges = new EdgesGeometry(new BoxGeometry(gridSize, 1, gridSize));
    const wireframeMaterial = new LineBasicMaterial({ color: 0xffffff });
    const wireframeMesh = new LineSegments(edges, wireframeMaterial);
    
    // Center the wireframe
    const offset = Math.floor(gridSize / 2);
    wireframeMesh.position.set(-offset, 0, -offset);
    
    return wireframeMesh;
  }, [selectedLayer, generations]);

  // Modified click handler to track user selections and ignore drags
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!event.instanceId) return;
    
    // Calculate movement delta
    const movementDelta = Math.abs(event.pageX - (mouseDownPositionRef.current?.x ?? event.pageX)) +
                         Math.abs(event.pageY - (mouseDownPositionRef.current?.y ?? event.pageY));
    
    // Skip if this was a drag event (movement > 2 pixels)
    if (movementDelta > 2) return;
    
    const matrix = new Object3D();
    instancedMesh?.getMatrixAt(event.instanceId, matrix.matrix);
    matrix.matrix.decompose(matrix.position, matrix.quaternion, matrix.scale);
    
    const layer = Math.round(matrix.position.y);
    hasUserSelectedRef.current = true;
    setSelectedLayer(layer);
    onLayerSelect?.(layer);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    mouseDownPositionRef.current = { x: event.pageX, y: event.pageY };
  };

  useFrame(({ camera }) => {
    if (!instancedMesh) return;

    // Update frustum for culling
    projScreenMatrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustumRef.current.setFromProjectionMatrix(projScreenMatrixRef.current);

    const tempObject = new Object3D();
    const gridSize = generations[0].length;
    const offset = Math.floor(gridSize / 2);
    let instanceIndex = 0;

    generations.forEach((grid, height) => {
      grid.forEach((row, x) => {
        row.forEach((cell, z) => {
          if (cell) {
            const worldX = x - offset;
            const worldZ = z - offset;
            
            tempObject.position.set(worldX, height, worldZ);

            // Simple frustum culling check
            if (!frustumRef.current.containsPoint(tempObject.position)) {
              return;
            }

            tempObject.updateMatrix();
            instancedMesh.setMatrixAt(instanceIndex, tempObject.matrix);
            
            // Use cached colors
            instancedMesh.setColorAt(instanceIndex, colorCache[height][x * gridSize + z]);
            instanceIndex++;
          }
        });
      });
    });

    // Update wireframe position if layer is selected
    if (wireframe && selectedLayer !== null) {
      wireframe.position.set(0, selectedLayer, 0);
    }

    instanceCountRef.current = instanceIndex;
    instancedMesh.count = instanceIndex;
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
  });

  if (!instancedMesh) return null;

  return (
    <>
      <primitive 
        object={instancedMesh} 
        onClick={handleClick}
        onPointerDown={handlePointerDown}
      />
      {wireframe && <primitive object={wireframe} />}
    </>
  );
}; 