import React, { useState, useCallback } from 'react';
import { CellularAutomata3D } from './components/CellularAutomata3D';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FPSCounter } from './components/FPSCounter';
import { RestartButton } from './components/RestartButton';
import SiteTitle from './components/SiteTitle';
import { parseRuleString } from './utils/cellularAutomata';
import Sidebar from './components/Sidebar';
import { CameraController } from './components/CameraController';

function App() {
  const [rules, setRules] = useState({
    survival: parseRuleString("23"),
    birth: parseRuleString("3")
  });
  
  const [key, setKey] = useState(0);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [initialMode, setInitialMode] = useState<'SOUP' | 'SINGLE'>('SOUP');
  const [soupDensity, setSoupDensity] = useState(0.15);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [generations, setGenerations] = useState(32);
  const [gridSize, setGridSize] = useState(65);

  const handleRuleChange = (newRules: { survival: number[], birth: number[] }) => {
    setRules(newRules);
  };

  const handleInitialStateChange = useCallback((mode: 'SOUP' | 'SINGLE') => {
    setInitialMode(mode);
    handleRestart();
  }, []);

  const handleDensityChange = useCallback((density: number) => {
    setSoupDensity(density);
  }, []);

  const handleRestart = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  const handleGenerationsChange = useCallback((newGenerations: number) => {
    setGenerations(newGenerations);
  }, []);

  const handleGridSizeChange = useCallback((newSize: number) => {
    setGridSize(newSize);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111112' }}>
      <SiteTitle />
      <FPSCounter />
      <RestartButton onRestart={handleRestart} />
      <Canvas 
        camera={{ position: [46, 0, 46], fov: 75 }}
        style={{ position: 'absolute' }}
      >
        {/* @ts-ignore */}
        <color attach="background" args={['#111112']} />
        {/* @ts-ignore */}
        <ambientLight intensity={0.42} />
        {/* @ts-ignore */}
        <pointLight 
          position={[10, 60+generations * 1.5, 19]}
          intensity={3200}
          color="#ffdd88"
        />
        {/* @ts-ignore */}
        <pointLight 
          position={[-50, -100, -50]} 
          intensity={2000}
          color="#9f8cff"
        />
        <CellularAutomata3D 
          key={key}
          gridSize={gridSize}
          maxGenerations={generations}
          frameDelay={200}
          rules={rules}
          initialMode={initialMode}
          soupDensity={soupDensity}
          onLayerSelect={setSelectedLayer}
        />
        <OrbitControls 
          maxDistance={230} 
          minDistance={5}
        />
        <CameraController
          selectedLayer={selectedLayer}
          sidebarExpanded={sidebarExpanded}
          gridSize={gridSize}
          distance={25}
        />
      </Canvas>
      
      <Sidebar 
        rule={`${rules.birth.join('')}/${rules.survival.join('')}`}
        onRuleChange={handleRuleChange}
        onExpandedChange={setSidebarExpanded}
        onInitialStateChange={handleInitialStateChange}
        onDensityChange={handleDensityChange}
        onGenerationsChange={handleGenerationsChange}
        onGridSizeChange={handleGridSizeChange}
        generations={generations}
        gridSize={gridSize}
      />
    </div>
  );
}

export default App;
