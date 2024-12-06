import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';

interface CameraControllerProps {
  selectedLayer: number | null;
  distance?: number;
}

export const CameraController = ({ selectedLayer, distance = 45 }: CameraControllerProps) => {
  const { camera } = useThree();
  const lastY = useRef(camera.position.y);

  useSpring({
    to: {
      y: selectedLayer === null ? camera.position.y : selectedLayer + distance,
    },
    onChange: ({ value: { y } }) => {
      const delta = y - lastY.current;
      camera.position.y += delta;
      lastY.current = y;
    },
    config: { tension: 170, friction: 26 }
  });

  return null;
}; 