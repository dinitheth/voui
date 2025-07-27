import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import GameScene from "./components/game/GameScene";
import Lobby from "./components/game/Lobby";
import GameUI from "./components/game/GameUI";
import { useGameState } from "./hooks/useGameState";

// Define control keys for the spaceship game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "up", keys: ["KeyQ"] },
  { name: "down", keys: ["KeyE"] },
  { name: "fire", keys: ["Space"] },
  { name: "boost", keys: ["Shift"] },
];

function App() {
  const { gameState, joinGame, leaveGame } = useGameState();

  if (gameState.phase === "lobby") {
    return <Lobby onJoinGame={joinGame} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [0, 5, 10],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
        >
          <color attach="background" args={["#000008"]} />
          
          <Suspense fallback={null}>
            <GameScene gameState={gameState} />
          </Suspense>
        </Canvas>
        
        <GameUI gameState={gameState} onLeaveGame={leaveGame} />
      </KeyboardControls>
    </div>
  );
}

export default App;
