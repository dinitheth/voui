import { useState, useCallback } from "react";

export type GamePhase = "lobby" | "playing" | "ended";

export interface GameState {
  phase: GamePhase;
  playerHealth: number;
  score: number;
  kills: number;
  selectedSpaceship: string;
  matchId?: string;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: "lobby",
    playerHealth: 100,
    score: 0,
    kills: 0,
    selectedSpaceship: "fighter"
  });

  const joinGame = useCallback((selectedSpaceship: string) => {
    console.log("Joining game with spaceship:", selectedSpaceship);
    setGameState(prev => ({
      ...prev,
      phase: "playing",
      selectedSpaceship,
      playerHealth: 100,
      score: 0,
      kills: 0,
      matchId: `match-${Date.now()}`
    }));
  }, []);

  const leaveGame = useCallback(() => {
    console.log("Leaving game");
    setGameState(prev => ({
      ...prev,
      phase: "lobby",
      matchId: undefined
    }));
  }, []);

  const updateHealth = useCallback((newHealth: number) => {
    setGameState(prev => {
      const updatedHealth = Math.max(0, Math.min(100, newHealth));
      return {
        ...prev,
        playerHealth: updatedHealth,
        phase: updatedHealth <= 0 ? "ended" : prev.phase
      };
    });
  }, []);

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));
  }, []);

  const addKill = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      kills: prev.kills + 1,
      score: prev.score + 100
    }));
  }, []);

  return {
    gameState,
    joinGame,
    leaveGame,
    updateHealth,
    updateScore,
    addKill
  };
}
