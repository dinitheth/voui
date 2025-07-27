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
  
  // Use GLB models instead of GLTF
  let scene;
  try {
    const gltf = useGLTF(`/models/Spaceships/${selectedModel}.glb`);
    scene = gltf.scene;
  } catch (error) {
    console.warn(`Failed to load spaceship model: ${selectedModel}`, error);
    // Fallback to a simple box geometry if model fails to load
    scene = null;
  }
  
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
      
      // Log controls for debugging - show all keys being pressed
      const pressedKeys = Object.keys(keys).filter(key => keys[key]);
      if (pressedKeys.length > 0) {
        console.log("Keys pressed:", pressedKeys, keys);
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

    // Apply velocity and rotation (velocity already includes delta from updateMovement)
    groupRef.current.position.add(velocity);
    groupRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
    
    // Debug position
    if (isPlayer && (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0)) {
      console.log("Player position:", groupRef.current.position.toArray());
    }

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
      {/* Render 3D model or fallback geometry */}
      {scene ? (
        <primitive object={scene.clone()} scale={[2.5, 2.5, 2.5]} />
      ) : (
        // Fallback spaceship using basic geometry
        <group>
          <mesh>
            <boxGeometry args={[2, 0.5, 3]} />
            <meshStandardMaterial 
              color={selectedModel === "fighter" ? "#2563eb" : selectedModel === "interceptor" ? "#dc2626" : "#16a34a"} 
              metalness={0.8} 
              roughness={0.3} 
            />
          </mesh>
          {/* Engine glow */}
          <mesh position={[0, 0, -1.8]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#00aaff" transparent opacity={0.7} />
          </mesh>
        </group>
      )}
      
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

// Preload spaceship models (GLB format)
useGLTF.preload('/models/Spaceships/fighter.glb');
useGLTF.preload('/models/Spaceships/interceptor.glb');
useGLTF.preload('/models/Spaceships/cruiser.glb');
