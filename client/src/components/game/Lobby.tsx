import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SpaceshipSelector from "./SpaceshipSelector";

interface LobbyProps {
  onJoinGame: (selectedSpaceship: string) => void;
}

export default function Lobby({ onJoinGame }: LobbyProps) {
  const [selectedSpaceship, setSelectedSpaceship] = useState("fighter");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleJoinGame = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      onJoinGame(selectedSpaceship);
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Game Title */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              VoidRiders
            </span>
          </h1>
          <p className="text-xl text-gray-300">Dogfight Arena</p>
          <p className="text-sm text-gray-400 mt-2">
            3D Spaceship Combat • Blockchain NFTs • Real-time Multiplayer
          </p>
        </div>

        {/* Main Lobby Interface */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Spaceship Selection */}
          <Card className="bg-black/60 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-white">Select Your Spaceship</CardTitle>
            </CardHeader>
            <CardContent>
              <SpaceshipSelector
                selectedSpaceship={selectedSpaceship}
                onSelectSpaceship={setSelectedSpaceship}
              />
            </CardContent>
          </Card>

          {/* Game Info & Join */}
          <Card className="bg-black/60 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-white">Arena Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Players Online:</span>
                  <span className="text-green-400">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Active Matches:</span>
                  <span className="text-blue-400">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Server Region:</span>
                  <span className="text-purple-400">Monad Testnet</span>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <h4 className="text-white font-medium mb-2">Game Mode: Free-for-All</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Battle against other pilots in open space. Last ship standing wins!
                </p>
                
                <Button
                  onClick={handleJoinGame}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3"
                >
                  {isConnecting ? "Connecting..." : "Join Battle"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-black/40 border-gray-600/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-400">1,247</div>
                <div className="text-sm text-gray-400">Total Battles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">856</div>
                <div className="text-sm text-gray-400">Ships Destroyed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">156</div>
                <div className="text-sm text-gray-400">NFT Ships</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">89%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Built on Monad Blockchain • Powered by Three.js • NFT Integration</p>
        </div>
      </div>
    </div>
  );
}
