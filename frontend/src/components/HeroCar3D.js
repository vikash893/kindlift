import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Stylized 3D Car from geometry primitives ─────── */
function CarModel() {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + Math.PI * 0.25;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  const bodyColor = '#e8a838';
  const darkColor = '#1a1a2e';
  const glassColor = '#a8d8ea';
  const wheelColor = '#2d2d3f';

  return (
    <group ref={group} position={[0, -0.3, 0]} scale={1.1}>
      {/* ── Main Body ──────────────────────────────── */}
      {/* Lower body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[3.2, 0.55, 1.4]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Front hood slope */}
      <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[1.0, 0.25, 1.35]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Rear trunk slope */}
      <mesh position={[-1.1, 0.5, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.9, 0.25, 1.35]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
      </mesh>

      {/* ── Cabin / Roof ───────────────────────────── */}
      <mesh position={[-0.1, 0.85, 0]} castShadow>
        <boxGeometry args={[1.6, 0.55, 1.25]} />
        <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* ── Windshield (front) ─────────────────────── */}
      <mesh position={[0.65, 0.82, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.05, 0.55, 1.15]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.5} />
      </mesh>

      {/* ── Rear window ────────────────────────────── */}
      <mesh position={[-0.82, 0.82, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.5, 1.15]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.5} />
      </mesh>

      {/* ── Side windows (left) ────────────────────── */}
      <mesh position={[-0.1, 0.85, 0.63]}>
        <boxGeometry args={[1.35, 0.38, 0.04]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.45} />
      </mesh>

      {/* ── Side windows (right) ───────────────────── */}
      <mesh position={[-0.1, 0.85, -0.63]}>
        <boxGeometry args={[1.35, 0.38, 0.04]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.45} />
      </mesh>

      {/* ── Headlights ─────────────────────────────── */}
      <mesh position={[1.62, 0.4, 0.45]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.62, 0.4, -0.45]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* ── Taillights ─────────────────────────────── */}
      <mesh position={[-1.62, 0.4, 0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.2]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-1.62, 0.4, -0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.2]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.4} />
      </mesh>

      {/* ── Grill ──────────────────────────────────── */}
      <mesh position={[1.61, 0.3, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.7]} />
        <meshStandardMaterial color={darkColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Wheels ─────────────────────────────────── */}
      {[
        [1.0, 0.08, 0.78],
        [1.0, 0.08, -0.78],
        [-1.0, 0.08, 0.78],
        [-1.0, 0.08, -0.78],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.1, 12, 24]} />
            <meshStandardMaterial color={wheelColor} roughness={0.9} />
          </mesh>
          {/* Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.12, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* ── Ground shadow ──────────────────────────── */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ── Decorative floating particles ────────────────── */
function Particles() {
  const ref = useRef();
  const count = 30;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#e8a838" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ── Responsive Car Model wrapper ────────────────── */
function ResponsiveCarModel({ isMobile }) {
  return (
    <group scale={isMobile ? 0.75 : 1.1}>
      <CarModel />
    </group>
  );
}

/* ── Exported Hero Canvas ─────────────────────────── */
export const HeroCar3D = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="w-full h-full" style={{ minHeight: isMobile ? '180px' : '400px' }}>
      <Canvas
        camera={{
          position: isMobile ? [3, 1.5, 3] : [4, 2.5, 4],
          fov: isMobile ? 48 : 40,
        }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#e8a838" />
        <pointLight position={[2, 1, 0]} intensity={0.3} color="#a8d8ea" />

        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <ResponsiveCarModel isMobile={isMobile} />
        </Float>

        <Particles />

        <Environment preset="city" environmentIntensity={0.3} />
      </Canvas>
    </div>
  );
};
