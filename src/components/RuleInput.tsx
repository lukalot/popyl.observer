import React, { useState, ChangeEvent, useEffect } from 'react';
import { parseRuleString } from '../utils/cellularAutomata';

interface RuleInputProps {
  onRuleChange?: (rules: { survival: number[], birth: number[] }) => void;
  initialSurvival?: string;
  initialBirth?: string;
}

export const RuleInput: React.FC<RuleInputProps> = ({
  onRuleChange,
  initialSurvival = "23",
  initialBirth = "3"
}) => {
  const [survival, setSurvival] = useState(initialSurvival);
  const [birth, setBirth] = useState(initialBirth);

  const validateInput = (input: string): boolean => {
    return /^[0-8]*$/.test(input);
  };

  useEffect(() => {
    // Send initial rules on mount
    onRuleChange?.({
      survival: parseRuleString(survival),
      birth: parseRuleString(birth)
    });
  }, []);

  const handleSurvivalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (validateInput(newValue)) {
      setSurvival(newValue);
      onRuleChange?.({
        survival: parseRuleString(newValue),
        birth: parseRuleString(birth)
      });
    }
  };

  const handleBirthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (validateInput(newValue)) {
      setBirth(newValue);
      onRuleChange?.({
        survival: parseRuleString(survival),
        birth: parseRuleString(newValue)
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px', // Positioned below FPS counter
      left: '10px',
      width: '140px',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      border: '1px solid rgba(235, 235, 255, 0.125)',
      color: 'white',
      padding: '8px 8px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between'}}>
        <span style={{ paddingLeft: '2.5px', height: '100%', textAlign: 'center', color: 'grey' }}>SURV</span>
        <input
          type="text"
          value={survival}
          onChange={handleSurvivalChange}
          style={{
            alignSelf: 'flex-end',
            background: 'rgba(0, 0, 0)',
            border: '1px solid rgba(235, 235, 255, 0.125)',
            borderRadius: '2px',
            color: 'white',
            padding: '4px 6px',
            height: '100%',
            width: '60px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between'}}>
        <span style={{ paddingLeft: '2.5px', height: '100%', textAlign: 'center', color: 'grey' }}>BIRTH</span>
        <input
          type="text"
          value={birth}
          onChange={handleBirthChange}
          style={{
            alignSelf: 'flex-end',
            background: 'rgba(0, 0, 0)',
            border: '1px solid rgba(235, 235, 255, 0.125)',
            borderRadius: '2px',
            color: 'white',
            padding: '4px 6px',
            height: '100%',
            width: '60px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
        />
      </div>
    </div>
  );
}; 