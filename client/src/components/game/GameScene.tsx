import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Spaceship from "./Spaceship";
import SpaceEnvironment from "./SpaceEnvironment";
import CameraController from "./CameraController";
import { useCollision } from "../../hooks/useCollision";

interface GameSceneProps {
  gameState: any;
}

export default function GameScene({ gameState }: GameSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const playerRef = useRef<THREE.Group>(null);
  const { checkCollisions } = useCollision();

  // Generate some enemy spaceships for the demo
  const enemies = useMemo(() => {
    const enemyPositions = [
      [20, 0, -10],
      [-15, 5, -20],
      [10, -3, -30],
      [-25, 2, -15]
    ];
    
    return enemyPositions.map((pos, index) => ({
      id: `enemy-${index}`,
      position: new THREE.Vector3(pos[0], pos[1], pos[2]),
      health: 100,
      isPlayer: false
    }));
  }, []);

  useFrame((state, delta) => {
    // Update game logic each frame
    if (gameState.phase === "playing") {
      checkCollisions();
    }
  });

  return (
    <group ref={groupRef}>
      {/* Camera Controller */}
      <CameraController targetRef={playerRef} offset={[0, 8, 15]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#4488ff" />

      {/* Space Environment */}
      <SpaceEnvironment />

      {/* Player Spaceship */}
      <Spaceship
        ref={playerRef}
        id="player"
        position={[0, 0, 0]}
        isPlayer={true}
        health={gameState.playerHealth}
        selectedModel={gameState.selectedSpaceship}
      />

      {/* Enemy Spaceships */}
      {enemies.map((enemy) => (
        <Spaceship
          key={enemy.id}
          id={enemy.id}
          position={enemy.position.toArray()}
          isPlayer={false}
          health={enemy.health}
          selectedModel="fighter"
        />
      ))}
    </group>
  );
}
