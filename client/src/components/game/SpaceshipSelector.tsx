import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface SpaceshipOption {
  id: string;
  name: string;
  type: string;
  speed: number;
  armor: number;
  firepower: number;
  description: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

interface SpaceshipSelectorProps {
  selectedSpaceship: string;
  onSelectSpaceship: (spaceshipId: string) => void;
}

const spaceships: SpaceshipOption[] = [
  {
    id: "fighter",
    name: "Void Fighter",
    type: "Light Fighter",
    speed: 85,
    armor: 60,
    firepower: 75,
    description: "Fast and agile interceptor perfect for hit-and-run tactics.",
    rarity: "Common"
  },
  {
    id: "interceptor",
    name: "Plasma Interceptor",
    type: "Heavy Fighter",
    speed: 70,
    armor: 80,
    firepower: 90,
    description: "Balanced combat vessel with enhanced weapon systems.",
    rarity: "Rare"
  },
  {
    id: "cruiser",
    name: "Battle Cruiser",
    type: "Heavy Cruiser",
    speed: 50,
    armor: 95,
    firepower: 85,
    description: "Heavily armored battleship built for prolonged engagements.",
    rarity: "Epic"
  }
];

const rarityColors = {
  Common: "bg-gray-500",
  Rare: "bg-blue-500",
  Epic: "bg-purple-500",
  Legendary: "bg-yellow-500"
};

export default function SpaceshipSelector({ selectedSpaceship, onSelectSpaceship }: SpaceshipSelectorProps) {
  return (
    <div className="space-y-4">
      {spaceships.map((ship) => (
        <Card
          key={ship.id}
          className={`p-4 cursor-pointer transition-all ${
            selectedSpaceship === ship.id
              ? "bg-blue-900/50 border-blue-400"
              : "bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"
          }`}
          onClick={() => onSelectSpaceship(ship.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-white font-bold">{ship.name}</h3>
                <Badge className={`${rarityColors[ship.rarity]} text-white text-xs`}>
                  {ship.rarity}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-400 mb-3">{ship.description}</p>
              
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-400">Speed</div>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-2 bg-gray-700 rounded">
                      <div
                        className="h-full bg-green-500 rounded"
                        style={{ width: `${ship.speed}%` }}
                      />
                    </div>
                    <span className="text-white">{ship.speed}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400">Armor</div>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-2 bg-gray-700 rounded">
                      <div
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${ship.armor}%` }}
                      />
                    </div>
                    <span className="text-white">{ship.armor}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400">Firepower</div>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-2 bg-gray-700 rounded">
                      <div
                        className="h-full bg-red-500 rounded"
                        style={{ width: `${ship.firepower}%` }}
                      />
                    </div>
                    <span className="text-white">{ship.firepower}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedSpaceship === ship.id && (
              <div className="ml-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
      
      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/50 rounded">
        <p className="text-yellow-200 text-sm">
          💡 <strong>NFT Integration:</strong> In the full version, these spaceships will be NFTs on the Monad blockchain. 
          Each ship will have unique stats and visual customizations.
        </p>
      </div>
    </div>
  );
}
