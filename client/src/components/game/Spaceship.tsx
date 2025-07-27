import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useSpaceship } from "../../hooks/useSpaceship";

interface SpaceshipProps {
  id: string;
  position: [number, number, number];
  isPlayer: boolean;
  health: number;
  selectedModel: string;
}

export default function Spaceship({ id, position, isPlayer, health, selectedModel }: SpaceshipProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(`/models/Spaceships/${selectedModel}.gltf`);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { velocity, rotation, updateMovement, fireLaser } = useSpaceship(id);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
    }
  }, [position]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isPlayer) {
      // Handle player input
      const keys = getKeys();
      
      // Log controls for debugging
      if (keys.forward || keys.backward || keys.left || keys.right) {
        console.log("Player controls:", {
          forward: keys.forward,
          backward: keys.backward,
          left: keys.left,
          right: keys.right
        });
      }

      // Update movement based on input
      updateMovement(keys, delta);

      // Handle firing
      if (keys.fire) {
        fireLaser();
      }
    } else {
      // Simple AI movement for enemies
      const time = state.clock.getElapsedTime();
      groupRef.current.position.x += Math.sin(time + parseInt(id.split('-')[1])) * 0.01;
      groupRef.current.position.z += Math.cos(time + parseInt(id.split('-')[1])) * 0.005;
    }

    // Apply velocity and rotation
    groupRef.current.position.add(velocity.clone().multiplyScalar(delta));
    groupRef.current.rotation.set(rotation.x, rotation.y, rotation.z);

    // Health-based visual effects
    if (health < 50) {
      groupRef.current.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.Material).opacity = 0.7;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene.clone()} scale={[1, 1, 1]} />
      
      {/* Collision box for debugging */}
      <mesh visible={false}>
        <boxGeometry args={[2, 1, 3]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>

      {/* Health bar */}
      {health < 100 && (
        <group position={[0, 2, 0]}>
          <mesh>
            <planeGeometry args={[2, 0.2]} />
            <meshBasicMaterial color="red" />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[2 * (health / 100), 0.2]} />
            <meshBasicMaterial color="green" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Preload spaceship models
useGLTF.preload('/models/Spaceships/fighter.gltf');
useGLTF.preload('/models/Spaceships/interceptor.gltf');
useGLTF.preload('/models/Spaceships/cruiser.gltf');
