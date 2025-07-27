import { useState, useRef, useCallback } from "react";
import * as THREE from "three";

export function useSpaceship(id: string) {
  const [velocity] = useState(new THREE.Vector3());
  const [rotation] = useState(new THREE.Euler());
  const lastFireTime = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useState(() => {
    audioRef.current = new Audio("/sounds/engine.mp3");
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
    }
  });

  const updateMovement = useCallback((keys: any, delta: number) => {
    const speed = 50; // Increased speed significantly
    const rotationSpeed = 3;
    const boostMultiplier = keys.boost ? 2 : 1;

    // Apply lighter drag
    velocity.multiplyScalar(0.98); // Reduced drag for better movement

    // Forward/Backward movement
    if (keys.forward) {
      velocity.z -= speed * delta * boostMultiplier;
      console.log("FORWARD pressed - velocity.z:", velocity.z);
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
    if (keys.backward) {
      velocity.z += speed * delta * 0.5;
      console.log("BACKWARD pressed - velocity.z:", velocity.z);
    }

    // Left/Right rotation
    if (keys.left) {
      rotation.y += rotationSpeed * delta;
    }
    if (keys.right) {
      rotation.y -= rotationSpeed * delta;
    }

    // Up/Down movement
    if (keys.up) {
      velocity.y += speed * delta * 0.7;
    }
    if (keys.down) {
      velocity.y -= speed * delta * 0.7;
    }

    // Stop engine sound when not moving
    if (!keys.forward && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    console.log("Spaceship movement:", {
      id,
      velocity: velocity.toArray(),
      rotation: [rotation.x, rotation.y, rotation.z]
    });
  }, [id, velocity, rotation]);

  const fireLaser = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTime.current > 200) { // Fire rate limit
      lastFireTime.current = now;
      
      // Play laser sound
      const laserSound = new Audio("/sounds/laser.mp3");
      laserSound.volume = 0.5;
      laserSound.play().catch(() => {});
      
      console.log("Firing laser from spaceship:", id);
      
      // TODO: Create laser projectile
      // This would involve adding the laser to the scene and managing its movement
    }
  }, [id]);

  return {
    velocity,
    rotation,
    updateMovement,
    fireLaser
  };
}
