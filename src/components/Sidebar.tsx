import React, { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Typography,
  TextField,
  Box,
  Divider,
  InputAdornment,
  Slider,
  IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

interface SidebarProps {
  rule: string;
  onRuleChange: (newRules: { survival: number[], birth: number[] }) => void;
  onExpandedChange?: (expanded: boolean) => void;
  onInitialStateChange: (mode: 'SOUP' | 'SINGLE') => void;
  onDensityChange: (density: number) => void;
  onGenerationsChange: (generations: number) => void;
  onGridSizeChange: (size: number) => void;
  generations: number;
  gridSize: number;
}

const MIN_WIDTH = 280;
const MAX_WIDTH = 450;

const SidebarContainer = styled('div')<{ $width: number; $isExpanded: boolean }>(({ $width, $isExpanded }) => ({
  position: 'fixed',
  left: 10,
  top: 10,
  bottom: $isExpanded ? 10 : 'auto',
  width: $isExpanded ? `${$width}px` : '280px',
  height: $isExpanded ? 'calc(100% - 45px)' : '8.5px',
  backgroundColor: 'rgba(0, 0, 0, 1)',
  border: '1px solid rgba(235, 235, 255, 0.125)',
  color: 'white',
  borderRadius: 4,
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  zIndex: 1000,
  fontFamily: 'monospace',
  transition: 'height 0.18s ease-out',
  overflow: 'hidden',
  minWidth: $isExpanded ? MIN_WIDTH : 'auto',
  maxWidth: $isExpanded ? MAX_WIDTH : 'fit-content',

  '& .MuiTypography-root': {
    color: 'white',
    fontFamily: 'monospace',
  },

  '& .MuiTypography-caption': {
    color: 'rgba(255, 255, 255, 0.6)',
  },

  '& .MuiTypography-subtitle2': {
    marginTop: '-6px',
    color: 'white',
  },

  '& .MuiDivider-root': {
    backgroundColor: 'rgba(235, 235, 255, 0.125)',
  },

  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '14px',
      '& fieldset': {
        borderColor: 'rgba(235, 235, 255, 0.125)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(235, 235, 255, 0.25)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(235, 235, 255, 0.5)',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 12px',
    },
  },
}));

const ContentContainer = styled('div')<{ $isExpanded: boolean }>(({ $isExpanded }) => ({
  opacity: $isExpanded ? 1 : 0,
  transition: 'opacity 0.2s ease-out',
  visibility: $isExpanded ? 'visible' : 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const ExpandButton = styled('div')<{ $isExpanded: boolean }>(({ $isExpanded }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  userSelect: 'none',
  
  '& .arrow': {
    marginTop: '-6px',
    transition: 'transform 0.2s ease-out',
    transform: $isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
  }
}));

const Arrow = () => (
  <svg 
    className="arrow" 
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M4 2L8 6L4 10" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const DragHandle = styled('div')({
  position: 'absolute',
  right: -5,
  top: 0,
  width: 10,
  height: '100%',
  cursor: 'ew-resize',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  
  '&::after': {
    content: '""',
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(235, 235, 255, 0.125)',
  },
  
  '&:hover::after': {
    backgroundColor: 'rgba(235, 235, 255, 0.25)',
  }
});

const RuleInputContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  '& .MuiTextField-root': {
    flex: 1,
    minWidth: '80px',
    maxWidth: '100%',
  }
});

const ToggleContainer = styled('div')({
  display: 'flex',
  backgroundColor: 'rgba(235, 235, 255, 0.125)',
  borderRadius: '4px',
  padding: '2px',
  width: 'fit-content',
  position: 'relative',
});

const ToggleOption = styled('div')<{ $isActive: boolean }>(({ $isActive }) => ({
  padding: '4px 12px',
  cursor: 'pointer',
  position: 'relative',
  zIndex: 1,
  transition: 'color 0.2s ease-out',
  fontSize: '12px',
  fontFamily: 'monospace',
  color: $isActive ? '#000' : '#fff',
  userSelect: 'none',
}));

const ToggleHighlight = styled('div')<{ $position: 'left' | 'right' }>(({ $position }) => ({
  position: 'absolute',
  top: '2px',
  left: $position === 'left' ? '2px' : '50%',
  width: 'calc(50% - 4px)',
  height: 'calc(100% - 4px)',
  backgroundColor: '#fff',
  borderRadius: '2px',
  transition: 'left 0.2s ease-out',
}));

const ControlBox = styled(Box)<{ $disabled?: boolean }>(({ $disabled }) => ({
  border: '1px solid rgba(235, 235, 255, 0.125)',
  borderRadius: 4,
  padding: '8px',
  opacity: $disabled ? 0.5 : 1,
  pointerEvents: $disabled ? 'none' : 'auto',
  '& .MuiSlider-root': {
    paddingTop: '6px',
    marginBottom: '-3px',
  }
}));

const Sidebar = ({ 
  rule, 
  onRuleChange, 
  onExpandedChange, 
  onInitialStateChange, 
  onDensityChange,
  onGenerationsChange,
  onGridSizeChange,
  generations,
  gridSize
}: SidebarProps) => {
  const [width, setWidth] = useState(MIN_WIDTH);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fillRatio, setFillRatio] = useState(0.5);
  const [mode, setMode] = useState<'SOUP' | 'SINGLE'>('SOUP');

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();

    const startX = e.pageX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(
        Math.max(startWidth + e.pageX - startX, MIN_WIDTH),
        MAX_WIDTH
      );
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width]);

  const [birth, survival] = rule.split('/');

  const handleNumberInput = (type: 'birth' | 'survival', value: string) => {
    // Filter out non-digits and numbers outside 1-8, but allow up to 9 characters
    const validNumbers = value
      .split('')
      .filter(char => /[1-8]/.test(char))
      .filter((item, pos, self) => self.indexOf(item) === pos) // Remove duplicates
      .slice(0, 9) // Limit to 9 characters
      .join('');

    if (type === 'birth') {
      onRuleChange({
        birth: validNumbers.split('').map(Number),
        survival: survival.split('').map(Number)
      });
    } else {
      onRuleChange({
        birth: birth.split('').map(Number),
        survival: validNumbers.split('').map(Number)
      });
    }
  };

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  };

  return (
    <SidebarContainer $width={width} $isExpanded={isExpanded}>
      <ExpandButton $isExpanded={isExpanded} onClick={toggleExpanded}>
        <Arrow />
        <Typography variant="subtitle2">
          Controls
        </Typography>
      </ExpandButton>

      <ContentContainer $isExpanded={isExpanded}>
        {isExpanded && <DragHandle onMouseDown={handleDragStart} />}
        
        <Box>
          <Typography variant="caption" display="block" gutterBottom>
            Rule Input
          </Typography>
          <RuleInputContainer>
            <TextField
              size="small"
              variant="outlined"
              value={birth}
              onChange={(e) => handleNumberInput('birth', e.target.value)}
              placeholder="3"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="caption">B</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              variant="outlined"
              value={survival}
              onChange={(e) => handleNumberInput('survival', e.target.value)}
              placeholder="23"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="caption">S</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </RuleInputContainer>
        </Box>

        <Divider />
        
        <Box>
          <Typography variant="caption" display="block" gutterBottom sx={{ mb: 1 }}>
            Initial State
          </Typography>
          <ToggleContainer>
            <ToggleHighlight $position={mode === 'SOUP' ? 'left' : 'right'} />
            <ToggleOption 
              $isActive={mode === 'SOUP'} 
              onClick={() => {
                setMode('SOUP');
                onInitialStateChange('SOUP');
              }}
            >
              SOUP
            </ToggleOption>
            <ToggleOption 
              $isActive={mode === 'SINGLE'} 
              onClick={() => {
                setMode('SINGLE');
                onInitialStateChange('SINGLE');
              }}
            >
              SINGLE
            </ToggleOption>
          </ToggleContainer>
          <ControlBox $disabled={mode === 'SINGLE'} sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} gutterBottom>
              Initial Soup Density
            </Typography>
            <Slider
              size="small"
              value={fillRatio}
              onChange={(_, value) => {
                setFillRatio(value as number);
                onDensityChange(value as number);
              }}
              min={0.05}
              max={1}
              step={0.05}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(235, 235, 255, 0.125)',
                  fontFamily: 'monospace',
                }
              }}
            />
          </ControlBox>
        </Box>

        <Divider />
        
        <Box>
          <Typography variant="caption" display="block" gutterBottom>
            Simulation Area
          </Typography>
          <ControlBox>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} gutterBottom>
              Max Generations
            </Typography>
            <Slider
              size="small"
              value={generations}
              onChange={(_, value) => {
                onGenerationsChange(value as number);
              }}
              min={4}
              max={128}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}`}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(235, 235, 255, 0.125)',
                  fontFamily: 'monospace',
                  color: generations > 48 ? '#ff4444' : 'white',
                }
              }}
            />
          </ControlBox>
          
          <ControlBox sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} gutterBottom>
              Grid Size
            </Typography>
            <Slider
              size="small"
              value={gridSize}
              onChange={(_, value) => {
                onGridSizeChange(value as number);
              }}
              min={21}
              max={101}
              step={2}  // Keep it odd numbers
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}×${value}`}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(235, 235, 255, 0.125)',
                  fontFamily: 'monospace',
                }
              }}
            />
          </ControlBox>
        </Box>
      </ContentContainer>
    </SidebarContainer>
  );
};

export default Sidebar; 