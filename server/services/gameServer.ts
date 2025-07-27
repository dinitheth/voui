import { WebSocket, WebSocketServer } from "ws";

export interface GameMessage {
  type: string;
  data: any;
  playerId?: string;
  timestamp: number;
}

export interface Player {
  id: string;
  websocket: WebSocket;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  health: number;
  spaceship: string;
  lastUpdate: number;
}

export class GameServer {
  private wss: WebSocketServer;
  private players: Map<string, Player> = new Map();
  private gameLoopInterval: NodeJS.Timeout | null = null;

  constructor(port: number = 8080) {
    this.wss = new WebSocketServer({ port });
    this.setupWebSocket();
    this.startGameLoop();
    console.log(`Game server running on port ${port}`);
  }

  private setupWebSocket(): void {
    this.wss.on("connection", (ws: WebSocket) => {
      const playerId = this.generatePlayerId();
      console.log(`Player ${playerId} connected`);

      // Create new player
      const player: Player = {
        id: playerId,
        websocket: ws,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        health: 100,
        spaceship: "fighter",
        lastUpdate: Date.now()
      };

      this.players.set(playerId, player);

      // Send welcome message
      this.sendToPlayer(playerId, {
        type: "connected",
        data: { playerId, playerCount: this.players.size },
        timestamp: Date.now()
      });

      // Broadcast new player to others
      this.broadcast({
        type: "playerJoined",
        data: { playerId, spaceship: player.spaceship },
        timestamp: Date.now()
      }, playerId);

      // Handle messages
      ws.on("message", (data: Buffer) => {
        try {
          const message: GameMessage = JSON.parse(data.toString());
          this.handleMessage(playerId, message);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      });

      // Handle disconnect
      ws.on("close", () => {
        console.log(`Player ${playerId} disconnected`);
        this.players.delete(playerId);
        this.broadcast({
          type: "playerLeft",
          data: { playerId },
          timestamp: Date.now()
        });
      });
    });
  }

  private handleMessage(playerId: string, message: GameMessage): void {
    const player = this.players.get(playerId);
    if (!player) return;

    switch (message.type) {
      case "updatePosition":
        player.position = message.data.position;
        player.rotation = message.data.rotation;
        player.lastUpdate = Date.now();
        
        // Broadcast position update to other players
        this.broadcast({
          type: "playerUpdate",
          data: {
            playerId,
            position: player.position,
            rotation: player.rotation
          },
          timestamp: Date.now()
        }, playerId);
        break;

      case "fireLaser":
        // Handle laser firing
        this.broadcast({
          type: "laserFired",
          data: {
            playerId,
            position: message.data.position,
            direction: message.data.direction
          },
          timestamp: Date.now()
        });
        break;

      case "damage":
        const targetId = message.data.targetId;
        const damage = message.data.damage;
        const target = this.players.get(targetId);
        
        if (target) {
          target.health = Math.max(0, target.health - damage);
          
          // Notify all players of damage
          this.broadcast({
            type: "playerDamaged",
            data: {
              playerId: targetId,
              health: target.health,
              attackerId: playerId
            },
            timestamp: Date.now()
          });

          // Check if player is destroyed
          if (target.health <= 0) {
            this.broadcast({
              type: "playerDestroyed",
              data: {
                playerId: targetId,
                killerId: playerId
              },
              timestamp: Date.now()
            });
          }
        }
        break;

      case "selectSpaceship":
        player.spaceship = message.data.spaceship;
        break;
    }
  }

  private broadcast(message: GameMessage, excludePlayerId?: string): void {
    this.players.forEach((player, playerId) => {
      if (playerId !== excludePlayerId && player.websocket.readyState === WebSocket.OPEN) {
        player.websocket.send(JSON.stringify(message));
      }
    });
  }

  private sendToPlayer(playerId: string, message: GameMessage): void {
    const player = this.players.get(playerId);
    if (player && player.websocket.readyState === WebSocket.OPEN) {
      player.websocket.send(JSON.stringify(message));
    }
  }

  private startGameLoop(): void {
    this.gameLoopInterval = setInterval(() => {
      // Send periodic game state updates
      const gameState = {
        players: Array.from(this.players.values()).map(p => ({
          id: p.id,
          position: p.position,
          rotation: p.rotation,
          health: p.health,
          spaceship: p.spaceship
        }))
      };

      this.broadcast({
        type: "gameState",
        data: gameState,
        timestamp: Date.now()
      });
    }, 100); // 10 FPS for game state updates
  }

  private generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public stop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
    }
    this.wss.close();
  }
}
