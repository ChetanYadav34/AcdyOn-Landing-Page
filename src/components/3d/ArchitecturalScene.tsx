"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function ArchitecturalElements() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle, slow monolithic rotation
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Tall architectural frosted pane */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh position={[1, 0, -2]} rotation={[0, -Math.PI / 6, 0]}>
          <boxGeometry args={[3, 6, 0.1]} />
          <MeshTransmissionMaterial 
            backside
            thickness={1}
            roughness={0.15}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.03}
            color="#ffffff"
          />
        </mesh>
      </Float>

      {/* Secondary accent pane */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[-1.5, -0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[2, 4, 0.05]} />
          <MeshTransmissionMaterial 
            thickness={0.5}
            roughness={0.1}
            transmission={0.9}
            ior={1.4}
            color="#F3F1EC" // Ivory tint
          />
        </mesh>
      </Float>

      {/* Solid monolithic accent (Graphite/Slate) */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0.5, -2, 1]} rotation={[Math.PI / 12, -Math.PI / 8, 0]}>
          <boxGeometry args={[1.5, 1.5, 0.2]} />
          <meshStandardMaterial color="#2D3748" roughness={0.7} metalness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

export function ArchitecturalScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        {/* Soft, studio-like lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#D4AF37" />
        
        <ArchitecturalElements />
        {/* 'studio' or 'apartment' give a clean editorial lighting feel without the outdoorsy city reflection */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
