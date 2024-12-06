import { ThreeElements } from '@react-three/fiber';
import { Object3D } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      primitive: {
        object: Object3D;
        onClick?: (event: any) => void;
        onPointerDown?: (event: any) => void;
      }
    }
  }
} 