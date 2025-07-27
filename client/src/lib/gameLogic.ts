import * as THREE from "three";

export interface Laser {
  id: string;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  damage: number;
  ownerId: string;
  createdAt: number;
}

export interface SpaceshipData {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  health: number;
  maxHealth: number;
  isPlayer: boolean;
}

export class GameLogic {
  private lasers: Map<string, Laser> = new Map();
  private spaceships: Map<string, SpaceshipData> = new Map();

  addLaser(laser: Laser): void {
    this.lasers.set(laser.id, laser);
  }

  removeLaser(id: string): void {
    this.lasers.delete(id);
  }

  updateLasers(deltaTime: number): void {
    const laserLifetime = 3000; // 3 seconds
    const now = Date.now();

    this.lasers.forEach((laser, id) => {
      // Update laser position
      laser.position.add(
        laser.direction.clone().multiplyScalar(laser.speed * deltaTime)
      );

      // Remove old lasers
      if (now - laser.createdAt > laserLifetime) {
        this.removeLaser(id);
      }
    });
  }

  checkLaserCollisions(): Array<{ laserId: string; spaceshipId: string; damage: number }> {
    const collisions: Array<{ laserId: string; spaceshipId: string; damage: number }> = [];

    this.lasers.forEach((laser, laserId) => {
      this.spaceships.forEach((spaceship, spaceshipId) => {
        // Don't hit the spaceship that fired the laser
        if (laser.ownerId === spaceshipId) return;

        // Simple distance-based collision detection
        const distance = laser.position.distanceTo(spaceship.position);
        if (distance < 2) { // Hit radius
          collisions.push({
            laserId,
            spaceshipId,
            damage: laser.damage
          });
        }
      });
    });

    return collisions;
  }

  updateSpaceship(id: string, data: Partial<SpaceshipData>): void {
    const existing = this.spaceships.get(id);
    if (existing) {
      this.spaceships.set(id, { ...existing, ...data });
    } else {
      this.spaceships.set(id, {
        id,
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        health: 100,
        maxHealth: 100,
        isPlayer: false,
        ...data
      });
    }
  }

  getSpaceship(id: string): SpaceshipData | undefined {
    return this.spaceships.get(id);
  }

  getAllLasers(): Laser[] {
    return Array.from(this.lasers.values());
  }

  getAllSpaceships(): SpaceshipData[] {
    return Array.from(this.spaceships.values());
  }

  dealDamage(spaceshipId: string, damage: number): boolean {
    const spaceship = this.spaceships.get(spaceshipId);
    if (spaceship) {
      spaceship.health = Math.max(0, spaceship.health - damage);
      return spaceship.health <= 0; // Return true if destroyed
    }
    return false;
  }
}

// Global game logic instance
export const gameLogic = new GameLogic();
