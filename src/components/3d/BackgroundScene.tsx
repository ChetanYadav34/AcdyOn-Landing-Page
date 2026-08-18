"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScroll } from "framer-motion";

function SceneElements({ scrollYProgress }: { scrollYProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const sphere1Ref = useRef<THREE.Mesh>(null);
  const sphere2Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    // Get current scroll value (0 to 1)
    const scroll = scrollYProgress.get();
    
    if (groupRef.current) {
      // Smoothly interpolate the group's position based on scroll
      // As user scrolls down, move the scene up
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        scroll * 10,
        0.1
      );
      
      // Rotate slowly over time
      groupRef.current.rotation.y += delta * 0.1;
    }

    if (sphere1Ref.current) {
      // Gateway shape fades/moves as we scroll past hero (scroll > 0.2)
      sphere1Ref.current.scale.setScalar(
        THREE.MathUtils.lerp(sphere1Ref.current.scale.x, 1 + scroll * 2, 0.1)
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central "Gateway" Monolith / Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={sphere1Ref} position={[0, -1, -5]}>
          <octahedronGeometry args={[2, 0]} />
          <MeshTransmissionMaterial 
            backside
            thickness={2}
            roughness={0.1}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.1}
            color="#1E40FF"
          />
        </mesh>
      </Float>

      {/* Floating Network Nodes for later scenes */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={sphere2Ref} position={[4, -8, -8]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#D4AF37" wireframe opacity={0.3} transparent />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-5, -15, -10]}>
          <sphereGeometry args={[1, 16, 16]} />
          <MeshTransmissionMaterial 
            thickness={1}
            roughness={0.2}
            transmission={0.9}
            color="#ffffff"
          />
        </mesh>
      </Float>
    </group>
  );
}

export function BackgroundScene({ scrollYProgress }: { scrollYProgress: any }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-navy">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#1E40FF" />
        
        <SceneElements scrollYProgress={scrollYProgress} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
