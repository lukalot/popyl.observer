import React, { useState, useCallback } from 'react';
import { CellularAutomata3D } from './components/CellularAutomata3D.tsx';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FPSCounter } from './components/FPSCounter.tsx';
import { RuleInput } from './components/RuleInput.tsx';
import { RestartButton } from './components/RestartButton.tsx';
import SiteTitle from './components/SiteTitle.tsx';
import { parseRuleString } from './utils/cellularAutomata.ts';

function App() {
  const [rules, setRules] = useState({
    survival: parseRuleString("23"),
    birth: parseRuleString("3")
  });
  
  const [key, setKey] = useState(0);

  const handleRuleChange = (newRules: { survival: number[], birth: number[] }) => {
    setRules(newRules);
  };

  const handleRestart = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111112' }}>
      <SiteTitle />
      <FPSCounter />
      <RuleInput onRuleChange={handleRuleChange} />
      <RestartButton onRestart={handleRestart} />
      <Canvas camera={{ position: [15, 15, 15], fov: 75 }}>
        {/* @ts-ignore */}
        <color attach="background" args={['#111112']} />
        {/* @ts-ignore */}
        <ambientLight intensity={0.4} />
        {/* @ts-ignore */}
        <pointLight 
          position={[10, 130, 20]} 
          intensity={3000}
          color="#ffdd88"
        />
        {/* @ts-ignore */}
        <pointLight 
          position={[-50, -100, -50]} 
          intensity={1000}
          color="#9785f2"
        />
        <CellularAutomata3D 
          key={key}
          gridSize={65}
          maxGenerations={32}
          frameDelay={200}
          rules={rules}
        />
        <OrbitControls 
          maxDistance={230} 
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}

export default App;
