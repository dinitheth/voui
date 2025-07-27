import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

interface GameUIProps {
  gameState: any;
  onLeaveGame: () => void;
}

export default function GameUI({ gameState, onLeaveGame }: GameUIProps) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="flex justify-between items-start">
          {/* Player Stats */}
          <Card className="p-4 bg-black/80 text-white border-blue-500/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Health:</span>
                <Progress 
                  value={gameState.playerHealth} 
                  className="w-24 h-2" 
                />
                <span className="text-sm">{gameState.playerHealth}%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Score:</span>
                <span className="text-lg font-bold text-yellow-400">
                  {gameState.score || 0}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Kills:</span>
                <span className="text-lg font-bold text-red-400">
                  {gameState.kills || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Game Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className="bg-black/80 text-white border-blue-500/50 hover:bg-blue-900/50"
            >
              Controls
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={onLeaveGame}
              className="bg-red-900/80 hover:bg-red-800/80"
            >
              Leave Game
            </Button>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-20 right-4 pointer-events-auto">
          <Card className="p-4 bg-black/90 text-white border-blue-500/50 max-w-xs">
            <h3 className="font-bold mb-3 text-blue-400">Game Controls</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Move Forward:</span>
                <span className="text-yellow-400">W / ↑</span>
              </div>
              <div className="flex justify-between">
                <span>Move Backward:</span>
                <span className="text-yellow-400">S / ↓</span>
              </div>
              <div className="flex justify-between">
                <span>Turn Left:</span>
                <span className="text-yellow-400">A / ←</span>
              </div>
              <div className="flex justify-between">
                <span>Turn Right:</span>
                <span className="text-yellow-400">D / →</span>
              </div>
              <div className="flex justify-between">
                <span>Move Up:</span>
                <span className="text-yellow-400">Q</span>
              </div>
              <div className="flex justify-between">
                <span>Move Down:</span>
                <span className="text-yellow-400">E</span>
              </div>
              <div className="flex justify-between">
                <span>Fire Laser:</span>
                <span className="text-yellow-400">Space</span>
              </div>
              <div className="flex justify-between">
                <span>Boost:</span>
                <span className="text-yellow-400">Shift</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-6 h-6 border-2 border-white/70 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="flex justify-center">
          <Card className="p-3 bg-black/80 text-white border-blue-500/50">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Systems Online</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Arena:</span>
                <span className="text-blue-400">Void Sector 7</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Ship:</span>
                <span className="text-purple-400">{gameState.selectedSpaceship}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameState.phase === "ended" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
          <Card className="p-8 bg-black/90 text-white border-red-500/50 text-center">
            <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over</h2>
            <div className="space-y-2 mb-6">
              <p className="text-xl">Final Score: <span className="text-yellow-400">{gameState.score}</span></p>
              <p className="text-lg">Kills: <span className="text-red-400">{gameState.kills}</span></p>
            </div>
            <Button onClick={onLeaveGame} className="bg-blue-900 hover:bg-blue-800">
              Return to Lobby
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
