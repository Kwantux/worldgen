import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export function FlyingCamera() {
  const { camera } = useThree();
  camera.far = 100000;
  camera.updateProjectionMatrix();
  const speed = 0.5;
  const keys = useRef<{ [key: string]: boolean }>({});

  useFrame(() => {
    if (keys.current['w']) camera.translateZ(-speed);
    if (keys.current['s']) camera.translateZ(speed);
    if (keys.current['a']) camera.translateX(-speed);
    if (keys.current['d']) camera.translateX(speed);
    if (keys.current['arrowup']) camera.translateZ(-speed);
    if (keys.current['arrowdown']) camera.translateZ(speed);
    if (keys.current['arrowleft']) camera.translateX(-speed);
    if (keys.current['arrowright']) camera.translateX(speed);
    if (keys.current[' ']) camera.translateY(speed);
    if (keys.current['shift']) camera.translateY(-speed);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return null;
}