import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GameServer } from "./services/gameServer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game-specific API routes
  app.get("/api/game/status", async (req, res) => {
    try {
      res.json({
        status: "online",
        playerCount: 24, // Mock data for MVP
        activeMatches: 6,
        serverRegion: "Monad Testnet"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get game status" });
    }
  });

  app.get("/api/game/leaderboard", async (req, res) => {
    try {
      // Mock leaderboard data for MVP
      const leaderboard = [
        { rank: 1, player: "VoidAce", score: 15420, kills: 89 },
        { rank: 2, player: "StarHunter", score: 12350, kills: 76 },
        { rank: 3, player: "NebulaWarrior", score: 11890, kills: 71 },
        { rank: 4, player: "CosmicPilot", score: 10560, kills: 65 },
        { rank: 5, player: "GalaxyRider", score: 9890, kills: 58 }
      ];

      res.json({ leaderboard });
    } catch (error) {
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.get("/api/spaceships", async (req, res) => {
    try {
      // Mock NFT spaceship data for MVP
      const spaceships = [
        {
          id: "fighter",
          name: "Void Fighter",
          type: "Light Fighter",
          rarity: "Common",
          stats: { speed: 85, armor: 60, firepower: 75 },
          nftContract: "0x742d35Cc6608C92C2C5A6f3F7a4B9f1C9fF02137",
          tokenId: 1
        },
        {
          id: "interceptor",
          name: "Plasma Interceptor",
          type: "Heavy Fighter",
          rarity: "Rare",
          stats: { speed: 70, armor: 80, firepower: 90 },
          nftContract: "0x742d35Cc6608C92C2C5A6f3F7a4B9f1C9fF02137",
          tokenId: 2
        },
        {
          id: "cruiser",
          name: "Battle Cruiser",
          type: "Heavy Cruiser",
          rarity: "Epic",
          stats: { speed: 50, armor: 95, firepower: 85 },
          nftContract: "0x742d35Cc6608C92C2C5A6f3F7a4B9f1C9fF02137",
          tokenId: 3
        }
      ];

      res.json({ spaceships });
    } catch (error) {
      res.status(500).json({ error: "Failed to get spaceships" });
    }
  });

  app.post("/api/game/match", async (req, res) => {
    try {
      const { spaceship } = req.body;
      
      // Mock match creation
      const match = {
        id: `match_${Date.now()}`,
        playerId: `player_${Date.now()}`,
        spaceship,
        status: "waiting",
        createdAt: new Date().toISOString()
      };

      res.json({ match });
    } catch (error) {
      res.status(500).json({ error: "Failed to create match" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Initialize WebSocket game server
  const gameServer = new GameServer();

  return httpServer;
}
