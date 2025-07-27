import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function SpaceEnvironment() {
  const starsRef = useRef<THREE.Points>(null);
  const skyTexture = useTexture("/textures/sky.png");

  // Generate star positions
  const starPositions = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group>
      {/* Skybox */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial 
          map={skyTexture} 
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={starPositions}
            count={starPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="white" />
      </points>

      {/* Arena boundaries (invisible walls) */}
      <group>
        {/* Floor */}
        <mesh position={[0, -20, 0]} visible={false}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, 20, 0]} visible={false}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* Nebula effects */}
      <group>
        <mesh position={[30, 10, -40]}>
          <sphereGeometry args={[5, 8, 8]} />
          <meshBasicMaterial 
            color="#ff4488" 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[-25, -5, -30]}>
          <sphereGeometry args={[8, 8, 8]} />
          <meshBasicMaterial 
            color="#4488ff" 
            transparent 
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
