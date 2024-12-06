import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { Vector3 } from 'three';

interface CameraControllerProps {
  selectedLayer: number | null;
  distance?: number;
  sidebarExpanded?: boolean;
}

export const CameraController = ({
  selectedLayer, 
  distance = 135,
  sidebarExpanded = false 
}: CameraControllerProps) => {
  const { camera, size } = useThree();
  const lastY = useRef(camera.position.y);
  const targetY = useRef(camera.position.y);
  const keysPressed = useRef<Set<string>>(new Set());
  const moveSpeed = 1;

  // Store original viewport dimensions
  useEffect(() => {
    camera.clearViewOffset();
    if (size.width && size.height) {
      camera.setViewOffset(
        size.width,
        size.height,
        0,
        0,
        size.width,
        size.height
      );
    }
  }, [camera, size]);

  // Layer height spring
  useSpring({
    to: {
      y: selectedLayer === null ? targetY.current : selectedLayer + distance,
    },
    onChange: ({ value: { y } }) => {
      const delta = y - lastY.current;
      camera.position.y += delta;
      lastY.current = y;
      targetY.current = y;
    },
    config: { tension: 170, friction: 26 }
  });

  // Sidebar offset spring
  useSpring({
    to: {
      offsetX: sidebarExpanded ? 150 : 0,
    },
    onChange: ({ value: { offsetX } }) => {
      if (size.width && size.height) {
        camera.setViewOffset(
          size.width,
          size.height,
          -offsetX,
          0,
          size.width,
          size.height
        );
      }
    },
    config: { tension: 170, friction: 26 }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    const moveCamera = () => {
      const keys = keysPressed.current;
      const forward = new Vector3(0, 0, -1);
      const right = new Vector3(1, 0, 0);
      
      // Rotate vectors based on camera rotation
      forward.applyQuaternion(camera.quaternion);
      right.applyQuaternion(camera.quaternion);
      
      // Zero out Y component to keep movement horizontal
      forward.y = 0;
      right.y = 0;
      forward.normalize();
      right.normalize();

      if (keys.size > 0) {
        requestAnimationFrame(moveCamera);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        keysPressed.current.clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      keysPressed.current.clear();
    };
  }, [camera]);

  return null;
}; 