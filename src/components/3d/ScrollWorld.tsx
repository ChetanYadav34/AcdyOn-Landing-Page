"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Text, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// ---- THEME SYSTEM ----

const getPalette = (isDark: boolean) => ({
  bg: isDark ? "#080C16" : "#F8FAFC",
  road: isDark ? "#121826" : "#E2E8F0",
  stone: isDark ? "#1E293B" : "#F4F7F6",
  stoneDark: isDark ? "#0F172A" : "#CBD5E1",
  grass: isDark ? "#064E3B" : "#86EFAC",
  water: isDark ? "#1E3A8A" : "#BAE6FD",
  accentBlue: isDark ? "#3B82F6" : "#1D4ED8",
  accentGold: isDark ? "#FBBF24" : "#D97706",
  wood: isDark ? "#451A03" : "#D97706",
  burgundy: isDark ? "#7F1D1D" : "#991B1B",
  glass: isDark ? "#475569" : "#FFFFFF",
  lightWarm: isDark ? "#FDE047" : "#FFFFFF",
  lightCool: isDark ? "#38BDF8" : "#FFFFFF",
  plazaGreen: isDark ? "#059669" : "#6EE7B7",
});

// ---- UTILS & ANIMATION ----

function Uplight({ position, color, intensity = 2.5, distance = 15, isDark }: { position: [number, number, number], color: string, intensity?: number, distance?: number, isDark: boolean }) {
  if (!isDark) return null; // Completely hides the lights in light mode so they don't ruin the clean aesthetic.

  return (
    <group position={position}>
      {/* Sleek recessed glowing LED ring on the ground */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Light emitted */}
      <pointLight position={[0, 0.5, 0]} intensity={intensity} distance={distance} color={color} />
    </group>
  );
}

function AnimatedWater({ args, color, position }: { args: [number, number], color: string, position: [number, number, number] }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  useFrame(({ clock }) => {
    if (!geomRef.current) return;
    const t = clock.getElapsedTime();
    const pos = geomRef.current.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 1.5 + t) * Math.cos(v * 1.5 + t) * 0.05;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh position={position} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
      <planeGeometry ref={geomRef} args={[args[0], args[1], 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.05} metalness={0.9} />
    </mesh>
  );
}

function Tree({ position, scale = 1, type = "canopy", isDark, p }: { position: [number, number, number], scale?: number, type?: "canopy" | "slender" | "shrub", isDark: boolean, p: any }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const offset = position[0] + position[2];
    groupRef.current.rotation.z = Math.sin(t * 0.5 + offset) * 0.015;
    groupRef.current.rotation.x = Math.cos(t * 0.4 + offset) * 0.015;
  });
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {type !== "shrub" && (
        <mesh position={[0, type === "slender" ? 3 : 1, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, type === "slender" ? 6 : 2, 8]} />
          <meshStandardMaterial color={p.wood} roughness={0.9} />
        </mesh>
      )}
      <mesh position={[0, type === "shrub" ? 0.8 : (type === "slender" ? 6 : 3), 0]} castShadow>
        {type === "slender" ? <coneGeometry args={[1.5, 7, 16]} /> : type === "shrub" ? <sphereGeometry args={[1.2, 16, 16]} /> : <icosahedronGeometry args={[2.5, 2]} />}
        <meshStandardMaterial color={p.grass} roughness={0.9} />
      </mesh>
      {isDark && (type === "slender" || type === "shrub") && (
        <pointLight position={[0, 0.5, 0]} distance={4} intensity={0.5} color={p.lightWarm} />
      )}
    </group>
  );
}

function ClickableLandmark({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const scale = hovered ? 1.05 : 1;
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 5);
    }
  });
  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {children}
    </group>
  );
}

function Fountain({ position, p, isDark }: { position: [number, number, number], p: any, isDark: boolean }) {
  const spoutRef = useRef<THREE.Group>(null);
  const geomRef = useRef<THREE.CircleGeometry>(null);
  
  useFrame(({ clock }) => {
    // Animate the water surface ripples
    if (geomRef.current) {
      const t = clock.getElapsedTime();
      const pos = geomRef.current.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 2 + t) * Math.cos(v * 2 + t) * 0.05;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
    // Animate the water spouts shooting up
    if (spoutRef.current) {
      const t = clock.getElapsedTime() * 4;
      spoutRef.current.scale.y = 1 + Math.sin(t) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Outer Basin */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.5, 4.5, 0.8, 32]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.9} />
      </mesh>
      {/* Lower Water Surface */}
      <mesh position={[0, 0.75, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <circleGeometry ref={geomRef} args={[4, 32]} />
        <meshStandardMaterial color={p.water} roughness={0.05} metalness={0.9} />
      </mesh>
      
      {/* Center Tier Pedestal */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.5, 2, 16]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.9} />
      </mesh>
      
      {/* Water Spouts */}
      <group position={[0, 2.2, 0]} ref={spoutRef}>
        <mesh position={[0, 1.2, 0]}>
          <coneGeometry args={[0.5, 2.5, 16, 1, true]} />
          <MeshTransmissionMaterial thickness={0.5} roughness={0.1} transmission={0.95} color={p.water} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Fountain Lights */}
      <Uplight position={[0, 0.8, 2.5]} color={p.accentBlue} isDark={isDark} distance={12} intensity={1.5} />
      <Uplight position={[0, 0.8, -2.5]} color={p.accentBlue} isDark={isDark} distance={12} intensity={1.5} />
      <Uplight position={[-2.5, 0.8, 0]} color={p.accentBlue} isDark={isDark} distance={12} intensity={1.5} />
      <Uplight position={[2.5, 0.8, 0]} color={p.accentBlue} isDark={isDark} distance={12} intensity={1.5} />
    </group>
  );
}

// ---- SCENE SECTIONS ----

function CampusGate({ p, isDark }: { p: any, isDark: boolean }) {
  const Column = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1, 2.2]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.9} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 10, 32]} />
        <meshStandardMaterial color={p.stone} roughness={0.7} />
      </mesh>
      <mesh position={[0, 11.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1, 2.4]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.9} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0, 18]}>
      <Column position={[-7, 0, 0]} />
      <Column position={[-11, 0, 0]} />
      <Column position={[7, 0, 0]} />
      <Column position={[11, 0, 0]} />
      
      <mesh position={[0, 13.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[28, 3, 5]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.8} />
      </mesh>
      
      {/* Front Gate Text */}
      <Text position={[0, 13.5, 2.51]} fontSize={2} color={isDark ? p.accentBlue : p.stoneDark} fontWeight="bold" letterSpacing={0.2}>
        ACDYON
      </Text>
      
      {/* Illuminating the Text */}
      {isDark && <pointLight position={[0, 13.5, 6]} intensity={3} distance={20} color={p.accentBlue} />}

      {/* Ground Uplights at Gate (Front of each pillar) */}
      <Uplight position={[-11, 0, 3]} color={p.lightWarm} isDark={isDark} distance={15} />
      <Uplight position={[-7, 0, 3]} color={p.lightWarm} isDark={isDark} distance={15} />
      <Uplight position={[7, 0, 3]} color={p.lightWarm} isDark={isDark} distance={15} />
      <Uplight position={[11, 0, 3]} color={p.lightWarm} isDark={isDark} distance={15} />
      
      {/* Fountain Left */}
      <Fountain position={[-15, 0, 8]} p={p} isDark={isDark} />
      
      {/* Fountain Right */}
      <Fountain position={[15, 0, 8]} p={p} isDark={isDark} />

      <Tree position={[-10, 0, 30]} scale={1.2} type="canopy" isDark={isDark} p={p} />
      <Tree position={[12, 0, 25]} scale={1.4} type="slender" isDark={isDark} p={p} />
      <Tree position={[-20, 0, 15]} scale={1.5} type="canopy" isDark={isDark} p={p} />
      <Tree position={[18, 0, 12]} scale={1.1} type="slender" isDark={isDark} p={p} />
      <Tree position={[-9, 0, 18]} scale={0.9} type="shrub" isDark={isDark} p={p} />
      <Tree position={[9, 0, 22]} scale={1.1} type="shrub" isDark={isDark} p={p} />
    </group>
  );
}

function LegacyCentralPlaza({ p, isDark }: { p: any, isDark: boolean }) {
  // Recreating the exact layout from the user's uploaded Image 1
  return (
    <group position={[4, 0, 0]}>
      {/* Massive circular base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[14, 16, 2, 64]} />
        <meshStandardMaterial color={p.stone} roughness={0.8} />
      </mesh>
      
      {/* Central Translucent Octahedron */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 6, 0]} castShadow>
          <octahedronGeometry args={[4, 0]} />
          <MeshTransmissionMaterial thickness={2} roughness={0.1} transmission={0.95} color={p.water} ior={1.2} />
        </mesh>
      </Float>

      {/* 4 Green Rectangular Blocks around it */}
      <mesh position={[-8, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 1.5, 1.5]} />
        <meshStandardMaterial color={p.plazaGreen} roughness={0.5} />
      </mesh>
      <mesh position={[8, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 1.5, 1.5]} />
        <meshStandardMaterial color={p.plazaGreen} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, -8]} castShadow>
        <boxGeometry args={[4, 1.5, 1.5]} />
        <meshStandardMaterial color={p.plazaGreen} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 8]} castShadow>
        <boxGeometry args={[4, 1.5, 1.5]} />
        <meshStandardMaterial color={p.plazaGreen} roughness={0.5} />
      </mesh>

      <Uplight position={[-12, 1, 0]} color={p.lightCool} isDark={isDark} />
      <Uplight position={[12, 1, 0]} color={p.lightCool} isDark={isDark} />
      <Uplight position={[0, 1, -12]} color={p.lightCool} isDark={isDark} />
      <Uplight position={[0, 1, 12]} color={p.lightCool} isDark={isDark} />
    </group>
  );
}

function LandmarkPromenade({ p, isDark }: { p: any, isDark: boolean }) {
  const Plinth = () => (
    <group position={[0, 1, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3, 2, 32]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[2.4, 32]} />
        <meshStandardMaterial color={p.stone} roughness={0.5} />
      </mesh>
    </group>
  );

  const execRef = useRef<THREE.Group>(null);
  const aiRef = useRef<THREE.Group>(null);
  const docRef = useRef<THREE.Group>(null);
  const recRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (execRef.current) execRef.current.position.y = Math.sin(t) * 0.1;
    if (aiRef.current) aiRef.current.rotation.y = t * 0.2;
    if (docRef.current) docRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    if (recRef.current) recRef.current.rotation.z = Math.sin(t) * 0.05;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Promenade Flooring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 300]} />
        <meshStandardMaterial color={p.road} roughness={0.9} />
      </mesh>
      
      {/* 1. Executive (Left) */}
      <group position={[-12, 0, -30]}>
        <Plinth />
        <ClickableLandmark onClick={() => window.location.href = "/programs"}>
          <group ref={execRef} position={[0, 4.5, 0]}>
            <mesh position={[0, 4.5, 0]} castShadow>
              <cylinderGeometry args={[0, 2, 7, 4]} />
              <meshStandardMaterial color={p.accentBlue} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.5, 0]} castShadow>
              <cylinderGeometry args={[2, 2, 3, 32]} />
              <meshStandardMaterial color={p.stoneDark} roughness={0.7} />
            </mesh>
          </group>
        </ClickableLandmark>
        <Uplight position={[-4.5, 0.2, 0]} color={p.accentBlue} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[4.5, 0.2, 0]} color={p.accentBlue} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, 4.5]} color={p.accentBlue} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, -4.5]} color={p.accentBlue} isDark={isDark} intensity={1.5} distance={12} />
      </group>

      {/* 2. AI (Right) */}
      <group position={[8, 0, -60]}>
        <Plinth />
        <ClickableLandmark onClick={() => window.location.href = "/programs/ai-for-business-leaders"}>
          <group position={[0, 6, 0]}>
            <group ref={aiRef}>
              <mesh castShadow>
                <icosahedronGeometry args={[2.2, 1]} />
                <meshStandardMaterial color={p.lightCool} wireframe />
              </mesh>
              <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <MeshTransmissionMaterial thickness={2} roughness={0.1} transmission={0.95} color={p.water} />
              </mesh>
            </group>
          </group>
        </ClickableLandmark>
        <Uplight position={[-4.5, 0.2, 0]} color={p.lightCool} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[4.5, 0.2, 0]} color={p.lightCool} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, 4.5]} color={p.lightCool} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, -4.5]} color={p.lightCool} isDark={isDark} intensity={1.5} distance={12} />
      </group>

      {/* 3. Doctoral (Left) */}
      <group position={[-12, 0, -90]}>
        <Plinth />
        <ClickableLandmark onClick={() => window.location.href = "/doctoral"}>
          <group ref={docRef} position={[0, 5, 0]}>
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[1.2, 1.5, 4, 16]} />
              <meshStandardMaterial color={p.stone} roughness={0.9} />
            </mesh>
            <mesh position={[0, 4.2, 0]} castShadow>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color={p.stone} roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.5, 1.5]} rotation={[Math.PI/6, 0, 0]} castShadow>
              <boxGeometry args={[2, 1.5, 0.3]} />
              <meshStandardMaterial color={p.wood} roughness={0.6} />
            </mesh>
          </group>
        </ClickableLandmark>
        <Uplight position={[-4.5, 0.2, 0]} color={p.lightWarm} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[4.5, 0.2, 0]} color={p.lightWarm} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, 4.5]} color={p.lightWarm} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, -4.5]} color={p.lightWarm} isDark={isDark} intensity={1.5} distance={12} />
      </group>

      {/* 4. Recognition (Right) */}
      <group position={[12, 0, -120]}>
        <Plinth />
        <ClickableLandmark onClick={() => window.location.href = "/universities/academic-recognition"}>
          <group ref={recRef} position={[0, 6, 0]}>
            <mesh castShadow rotation={[0, -Math.PI/4, 0]}>
              <torusGeometry args={[2.2, 0.25, 32, 64]} />
              <meshStandardMaterial color={p.accentGold} metalness={1} roughness={0.15} />
            </mesh>
            <mesh position={[0, -2.5, 0]} castShadow>
              <cylinderGeometry args={[0.8, 1.5, 5, 32]} />
              <meshStandardMaterial color={p.stoneDark} roughness={0.7} />
            </mesh>
          </group>
        </ClickableLandmark>
        <Uplight position={[-4.5, 0.2, 0]} color={p.accentGold} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[4.5, 0.2, 0]} color={p.accentGold} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, 4.5]} color={p.accentGold} isDark={isDark} intensity={1.5} distance={12} />
        <Uplight position={[0, 0.2, -4.5]} color={p.accentGold} isDark={isDark} intensity={1.5} distance={12} />
      </group>
    </group>
  );
}

function GlobalAtrium({ p, isDark }: { p: any, isDark: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group position={[12, 0, -160]}>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.1} metalness={0.6} />
      </mesh>
      <mesh position={[0, 12, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow>
        <ringGeometry args={[25, 35, 64]} />
        <meshStandardMaterial color={p.stone} roughness={0.9} />
      </mesh>
      
      <group position={[0, 10, 0]} ref={globeRef}>
        <mesh castShadow>
          <sphereGeometry args={[7, 64, 64]} />
          <MeshTransmissionMaterial thickness={3} roughness={0.05} transmission={0.95} ior={1.5} color={p.water} />
        </mesh>
        <mesh rotation={[Math.PI/3, 0, 0]}>
          <torusGeometry args={[7.5, 0.05, 16, 128]} />
          <meshStandardMaterial color={p.accentGold} metalness={1} roughness={0.1} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI/4]}>
          <torusGeometry args={[8, 0.05, 16, 128]} />
          <meshStandardMaterial color={p.accentBlue} metalness={0.8} />
        </mesh>
        {isDark && <pointLight position={[0, 0, 0]} intensity={4} distance={30} color={p.lightCool} />}
      </group>
    </group>
  );
}

function FinalWallLogo({ isDark, p }: { isDark: boolean, p: any }) {
  const imageRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  useFrame((state) => {
    // Only show the logo when camera passes z = -140 (just past the globe)
    const z = state.camera.position.z;
    const targetOpacity = z < -140 ? Math.min(1, (-140 - z) / 10) : 0;
    
    if (imageRef.current && imageRef.current.material) {
      imageRef.current.material.opacity = targetOpacity * 0.9;
    }
    if (textRef.current) {
      textRef.current.fillOpacity = targetOpacity * 0.9;
    }
  });

  return (
    <group position={[0, 8, -13.9]}>
      {isDark ? (
        <Suspense fallback={null}>
          <DreiImage 
            ref={imageRef}
            url="/acdyon-logo.webp" 
            scale={[5, 5]} 
            transparent
            blending={THREE.AdditiveBlending}
          />
        </Suspense>
      ) : (
        <Text
          ref={textRef}
          fontSize={2.5}
          color={p.stoneDark}
          fontWeight="bold"
          letterSpacing={0.2}
        >
          ACDYON
        </Text>
      )}
    </group>
  );
}

function PathwayCenter({ p, isDark }: { p: any, isDark: boolean }) {
  return (
    <group position={[0, 0, -200]}>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial color={p.stone} roughness={0.6} />
      </mesh>
      
      {/* Full Cylinders instead of sliced ones so it doesn't look cut in half */}
      <mesh position={[0, 2.5, -6]} castShadow receiveShadow>
        <cylinderGeometry args={[10, 10, 1, 64]} />
        <meshStandardMaterial color={p.wood} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.25, -6]} castShadow receiveShadow>
        <cylinderGeometry args={[9.5, 9.5, 2.5, 64]} />
        <meshStandardMaterial color={p.stoneDark} roughness={0.8} />
      </mesh>

      <mesh position={[0, 8, -14]} castShadow>
        <planeGeometry args={[40, 16]} />
        <MeshTransmissionMaterial thickness={0.5} roughness={0} transmission={0.95} color={p.glass} />
      </mesh>
      
      {/* Dynamic Fading Logo */}
      <FinalWallLogo isDark={isDark} p={p} />
      
      {/* Recessed Lighting / Uplights */}
      <Uplight position={[-8, 0, -2]} color={p.lightWarm} isDark={isDark} distance={20} />
      <Uplight position={[8, 0, -2]} color={p.lightWarm} isDark={isDark} distance={20} />
      <Uplight position={[-15, 0, -8]} color={p.lightWarm} isDark={isDark} distance={20} />
      <Uplight position={[15, 0, -8]} color={p.lightWarm} isDark={isDark} distance={20} />
      
      {/* Background Rim Light */}
      {isDark && <pointLight position={[0, 8, -2]} intensity={2.5} distance={25} color={p.lightWarm} />}
    </group>
  );
}

// ---- CAMERA RIG ----

function CameraRig() {
  const targetRef = useRef(new THREE.Vector3());

  // 11-point sequence for 10 scrolling intervals
  // Important rule: pos.z MUST always be greater than look.z to prevent the camera from spinning around backwards!
  const posCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5, 55),      // 0. Hero Outside
      new THREE.Vector3(0, 4, 30),      // 1. Approach Gate
      new THREE.Vector3(-4, 5, 12),     // 2. Look at Legacy Plaza (Plaza is at x=4)
      new THREE.Vector3(4, 5, -15),     // 3. Exec (Camera Right)
      new THREE.Vector3(-4, 5, -45),    // 4. AI (Camera Left)
      new THREE.Vector3(4, 5, -75),     // 5. Doc (Camera Right)
      new THREE.Vector3(-4, 5, -105),   // 6. Rec (Camera Left)
      new THREE.Vector3(-4, 7, -140),   // 7. Globe (Camera Left)
      new THREE.Vector3(0, 4, -185),    // 8. Funnel Front
      new THREE.Vector3(0, 4, -185),    // 9. Funnel (Hold position)
      new THREE.Vector3(0, 4, -190),    // 10. Consultation
    ], false, 'catmullrom', 0.5);
  }, []);

  const lookCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 6, 18),      // Hero Look at Gate
      new THREE.Vector3(0, 5, 18),      // Gate approach
      new THREE.Vector3(4, 5, 0),       // Plaza reveal
      // To place a model on the LEFT of the screen, look to its RIGHT.
      // Exec model is at x=-12, look at x=-4
      new THREE.Vector3(-4, 5, -30),    
      // AI model reverted to previous perfect framing
      new THREE.Vector3(8, 5, -60),     
      // Doc model is at x=-12, look at x=-4
      new THREE.Vector3(-4, 5, -90),    
      // Rec model is at x=12, look at x=4
      new THREE.Vector3(4, 5, -120),    
      // Globe model is at x=12, look at x=4
      new THREE.Vector3(4, 10, -160),   
      new THREE.Vector3(0, 4, -200),    // Look ahead at Funnel/Desk
      new THREE.Vector3(0, 4, -200),    // Preview
      new THREE.Vector3(0, 4, -200),    // Consultation
    ], false, 'catmullrom', 0.5);
  }, []);

  useFrame((state, delta) => {
    if (!posCurve || !lookCurve) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const rawT = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const t = Math.max(0, Math.min(1, rawT));
    
    const pos = posCurve.getPoint(t);
    const look = lookCurve.getPoint(t);

    state.camera.position.lerp(pos, delta * 3.5);
    targetRef.current.lerp(look, delta * 4.5);
    state.camera.lookAt(targetRef.current);

    // Responsive FOV adaptation for smartphone screens
    const aspect = state.size.width / state.size.height;
    let targetFov = 45;
    if (aspect < 1) {
      // Linearly scale FOV up as the screen gets narrower
      targetFov = 45 + (1 - aspect) * 50; 
    }
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, delta * 4);
    state.camera.updateProjectionMatrix();
  });

  return null;
}

export function ScrollWorld() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const isDark = mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"));
  const p = getPalette(isDark);

  return (
    <Canvas shadows camera={{ position: [0, 5, 55], fov: 45 }} gl={{ antialias: true }}>
      <color attach="background" args={[p.bg]} />
      <fog attach="fog" args={[p.bg, 20, 80]} />
      
      <ambientLight intensity={isDark ? 0.05 : 0.5} color={isDark ? "#64748B" : "#ffffff"} />
      <directionalLight 
        position={[30, 50, 30]} 
        intensity={isDark ? 0.2 : 1.8} 
        color={isDark ? "#BAE6FD" : "#FFF5E1"} 
        castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200} shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60}
      />
      <Environment preset={isDark ? "night" : "city"} />
      <CameraRig />

      <mesh position={[0, -0.1, -100]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 300]} />
        <meshStandardMaterial color={p.grass} roughness={1} />
      </mesh>

      <CampusGate p={p} isDark={isDark} />
      <LegacyCentralPlaza p={p} isDark={isDark} />
      <LandmarkPromenade p={p} isDark={isDark} />
      <GlobalAtrium p={p} isDark={isDark} />
      <PathwayCenter p={p} isDark={isDark} />
    </Canvas>
  );
}
