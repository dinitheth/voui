import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraControllerProps {
  targetRef: React.RefObject<THREE.Group>;
  offset?: [number, number, number];
}

export default function CameraController({ targetRef, offset = [0, 5, 10] }: CameraControllerProps) {
  const { camera } = useThree();
  const idealCameraPosition = useRef(new THREE.Vector3());
  const idealLookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!targetRef.current) return;

    const target = targetRef.current;
    const targetPosition = target.position;
    const targetRotation = target.rotation;

    // Calculate ideal camera position relative to the spaceship
    idealCameraPosition.current.set(offset[0], offset[1], offset[2]);
    idealCameraPosition.current.applyEuler(targetRotation);
    idealCameraPosition.current.add(targetPosition);

    // Calculate where the camera should look
    idealLookAt.current.copy(targetPosition);
    idealLookAt.current.y += 1; // Look slightly above the spaceship

    // Smooth camera movement
    const smoothing = 1 - Math.pow(0.01, delta);
    camera.position.lerp(idealCameraPosition.current, smoothing);
    
    // Make camera look at the target smoothly
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(-1);
    currentLookAt.add(camera.position);
    
    currentLookAt.lerp(idealLookAt.current, smoothing);
    camera.lookAt(currentLookAt);
  });

  return null;
}