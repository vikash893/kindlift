import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   PERSON — Simple stylized human figure
   ═══════════════════════════════════════════════════════ */
function Person({ position = [0, 0, 0], color = '#e8a838', scale = 1, seated = false }) {
  const group = useRef();
  const skinColor = '#f5cba7';

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Head */}
      <mesh position={[0, seated ? 1.15 : 1.55, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Body */}
      <mesh position={[0, seated ? 0.85 : 1.2, 0]}>
        <capsuleGeometry args={[0.1, seated ? 0.3 : 0.45, 8, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs (only when standing) */}
      {!seated && (
        <>
          <mesh position={[-0.06, 0.5, 0]}>
            <capsuleGeometry args={[0.05, 0.35, 6, 8]} />
            <meshStandardMaterial color="#3d5a80" />
          </mesh>
          <mesh position={[0.06, 0.5, 0]}>
            <capsuleGeometry args={[0.05, 0.35, 6, 8]} />
            <meshStandardMaterial color="#3d5a80" />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   CAR — Stylized sedan with passengers
   ═══════════════════════════════════════════════════════ */
function Car({ position = [0, 0, 0] }) {
  const group = useRef();
  const bodyColor = '#e8a838';
  const glassColor = '#a8d8ea';
  const wheelColor = '#2d2d3f';

  useFrame((state) => {
    if (group.current) {
      // Subtle bounce
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.015;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Lower body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[3.2, 0.55, 1.4]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Front hood */}
      <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[1.0, 0.25, 1.35]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Rear trunk */}
      <mesh position={[-1.1, 0.5, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.9, 0.25, 1.35]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.1, 0.85, 0]} castShadow>
        <boxGeometry args={[1.6, 0.55, 1.25]} />
        <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0.65, 0.82, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.05, 0.55, 1.15]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.4} />
      </mesh>
      {/* Rear window */}
      <mesh position={[-0.82, 0.82, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.5, 1.15]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.4} />
      </mesh>
      {/* Side windows */}
      <mesh position={[-0.1, 0.85, 0.63]}>
        <boxGeometry args={[1.35, 0.38, 0.04]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.35} />
      </mesh>
      <mesh position={[-0.1, 0.85, -0.63]}>
        <boxGeometry args={[1.35, 0.38, 0.04]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.35} />
      </mesh>
      {/* Headlights */}
      <mesh position={[1.62, 0.4, 0.45]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#fff" emissive="#fffbe6" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[1.62, 0.4, -0.45]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#fff" emissive="#fffbe6" emissiveIntensity={0.8} />
      </mesh>
      {/* Taillights */}
      <mesh position={[-1.62, 0.4, 0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.2]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-1.62, 0.4, -0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.2]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.4} />
      </mesh>
      {/* Grill */}
      <mesh position={[1.61, 0.3, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.7]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wheels */}
      {[[1.0, 0.08, 0.78], [1.0, 0.08, -0.78], [-1.0, 0.08, 0.78], [-1.0, 0.08, -0.78]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.1, 12, 24]} />
            <meshStandardMaterial color={wheelColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.12, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Passengers inside */}
      <Person position={[0.15, 0.15, 0.25]} color="#4a90d9" scale={0.55} seated />
      <Person position={[0.15, 0.15, -0.25]} color="#e8a838" scale={0.55} seated />
      <Person position={[-0.4, 0.15, 0.3]} color="#e76f51" scale={0.55} seated />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   MOTORCYCLE — Stylized bike with rider
   ═══════════════════════════════════════════════════════ */
function Motorcycle({ position = [0, 0, 0] }) {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2.5 + 1) * 0.01;
    }
  });

  return (
    <group ref={group} position={position} scale={0.7}>
      {/* Frame body */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1.2, 0.2, 0.3]} />
        <meshStandardMaterial color="#2d2d3f" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Fuel tank */}
      <mesh position={[0.1, 0.6, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.35]} />
        <meshStandardMaterial color="#e63946" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Seat */}
      <mesh position={[-0.3, 0.58, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0.55, 0.7, 0]}>
        <boxGeometry args={[0.08, 0.25, 0.6]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Front wheel */}
      <mesh position={[0.55, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.07, 10, 20]} />
        <meshStandardMaterial color="#2d2d3f" roughness={0.9} />
      </mesh>
      {/* Rear wheel */}
      <mesh position={[-0.55, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.07, 10, 20]} />
        <meshStandardMaterial color="#2d2d3f" roughness={0.9} />
      </mesh>
      {/* Exhaust */}
      <mesh position={[-0.6, 0.3, 0.2]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Rider */}
      <Person position={[-0.2, 0.35, 0]} color="#264653" scale={0.5} seated />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   BICYCLE — With cyclist pedaling
   ═══════════════════════════════════════════════════════ */
function Bicycle({ position = [0, 0, 0] }) {
  const group = useRef();
  const pedalAngle = useRef(0);

  useFrame((state, delta) => {
    pedalAngle.current += delta * 3;
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.8 + 2) * 0.012;
    }
  });

  return (
    <group ref={group} position={position} scale={0.6}>
      {/* Frame */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.8, 0.06, 0.08]} />
        <meshStandardMaterial color="#2a9d8f" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Seat post */}
      <mesh position={[-0.2, 0.65, 0]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color="#2a9d8f" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Handlebar post */}
      <mesh position={[0.35, 0.65, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="#2a9d8f" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0.35, 0.8, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.45]} />
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Seat */}
      <mesh position={[-0.2, 0.82, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
      {/* Front wheel */}
      <mesh position={[0.4, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.03, 10, 20]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Rear wheel */}
      <mesh position={[-0.4, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.03, 10, 20]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Cyclist */}
      <Person position={[-0.1, 0.5, 0]} color="#e9c46a" scale={0.5} seated />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   TREE — Low-poly tree that sways in wind
   ═══════════════════════════════════════════════════════ */
function Tree({ position = [0, 0, 0], scale = 1, swaySpeed = 1, swayAmount = 0.03 }) {
  const group = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime * swaySpeed + offset;
      group.current.rotation.z = Math.sin(t) * swayAmount;
      group.current.rotation.x = Math.sin(t * 0.7) * swayAmount * 0.5;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.0, 8]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      {/* Canopy layers */}
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.55, 0.8, 8]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[0.42, 0.7, 8]} />
        <meshStandardMaterial color="#40916c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <coneGeometry args={[0.28, 0.55, 8]} />
        <meshStandardMaterial color="#52b788" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   ROUND TREE — Bushy deciduous tree
   ═══════════════════════════════════════════════════════ */
function RoundTree({ position = [0, 0, 0], scale = 1, swaySpeed = 0.8 }) {
  const group = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime * swaySpeed + offset;
      group.current.rotation.z = Math.sin(t) * 0.025;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.9, 8]} />
        <meshStandardMaterial color="#8B5E3C" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshStandardMaterial color="#588157" roughness={0.85} />
      </mesh>
      <mesh position={[0.25, 1.35, 0.15]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#6aae5f" roughness={0.85} />
      </mesh>
      <mesh position={[-0.2, 1.4, -0.1]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#4a8f43" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   ROAD — Asphalt strip with lane markings
   ═══════════════════════════════════════════════════════ */
function Road() {
  return (
    <group>
      {/* Road surface */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 2.8]} />
        <meshStandardMaterial color="#4a4a5a" roughness={0.95} />
      </mesh>
      {/* Road edges — white lines */}
      <mesh position={[0, 0.02, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 0.06]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.02, -1.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 0.06]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Center dashed lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-7.5 + i * 1.4, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.05]} />
          <meshStandardMaterial color="#e8d44d" />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   GRASS FIELD — Green ground with flowers
   ═══════════════════════════════════════════════════════ */
function GrassField() {
  return (
    <group>
      {/* Near-side field */}
      <mesh position={[0, 0, 3.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#7cb342" roughness={0.95} />
      </mesh>
      {/* Far-side field */}
      <mesh position={[0, 0, -3.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#8bc34a" roughness={0.95} />
      </mesh>
      {/* Flowers / small bushes on near side */}
      {[
        [2, 0.08, 2.5, '#e76f51'], [-1, 0.08, 3.2, '#f4a261'],
        [4, 0.08, 4, '#e9c46a'], [-3, 0.08, 3.8, '#f4a261'],
        [6, 0.08, 2.8, '#e76f51'], [-5, 0.08, 4.2, '#e9c46a'],
        [1, 0.08, 4.5, '#e76f51'], [3.5, 0.08, 3.6, '#f4a261'],
      ].map(([x, y, z, color], i) => (
        <mesh key={`f${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Flowers on far side */}
      {[
        [1.5, 0.08, -2.5, '#2a9d8f'], [-2, 0.08, -3.5, '#e76f51'],
        [3, 0.08, -4, '#f4a261'], [-4, 0.08, -3, '#2a9d8f'],
        [5, 0.08, -2.8, '#e9c46a'], [-1, 0.08, -4.3, '#e76f51'],
      ].map(([x, y, z, color], i) => (
        <mesh key={`ff${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   WIND PARTICLES — Flowing gentle wind
   ═══════════════════════════════════════════════════════ */
function WindParticles() {
  const ref = useRef();
  const count = 60;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 3 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel.push(0.5 + Math.random() * 1.5);
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3] += velocities[i] * delta;
      // Loop back
      if (posAttr.array[i * 3] > 9) {
        posAttr.array[i * 3] = -9;
        posAttr.array[i * 3 + 1] = Math.random() * 3 + 0.3;
        posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }
    posAttr.needsUpdate = true;
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
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════
   WIND STREAKS — Horizontal lines showing wind flow
   ═══════════════════════════════════════════════════════ */
function WindStreaks() {
  const groupRef = useRef();
  const streaks = useMemo(() =>
    Array.from({ length: 15 }).map(() => ({
      x: (Math.random() - 0.5) * 14,
      y: 0.5 + Math.random() * 3,
      z: (Math.random() - 0.5) * 8,
      speed: 2 + Math.random() * 3,
      len: 0.3 + Math.random() * 0.6,
    })), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.x += streaks[i].speed * delta;
      if (child.position.x > 8) {
        child.position.x = -8;
        child.position.y = 0.5 + Math.random() * 3;
        child.position.z = (Math.random() - 0.5) * 8;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {streaks.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[s.len, 0.008, 0.008]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   HILLS — Distant background hills
   ═══════════════════════════════════════════════════════ */
function Hills() {
  return (
    <group>
      <mesh position={[0, 0.5, -7]}>
        <sphereGeometry args={[4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5a8c46" roughness={0.95} />
      </mesh>
      <mesh position={[5, 0.3, -8]}>
        <sphereGeometry args={[3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a7c3a" roughness={0.95} />
      </mesh>
      <mesh position={[-5, 0.4, -7.5]}>
        <sphereGeometry args={[3.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#6b9b50" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   WALKING PERSON — Standing by the roadside
   ═══════════════════════════════════════════════════════ */
function RoadsidePerson({ position, color }) {
  const group = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (group.current) {
      // Subtle idle sway
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + offset) * 0.02;
    }
  });

  return (
    <group ref={group} position={position}>
      <Person position={[0, 0, 0]} color={color} scale={0.45} seated={false} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   SUN — Glowing sun in the sky
   ═══════════════════════════════════════════════════════ */
function Sun() {
  return (
    <mesh position={[6, 5, -6]}>
      <sphereGeometry args={[0.6, 16, 16]} />
      <meshBasicMaterial color="#f9dc5c" />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════
   SKY GRADIENT — Subtle sky plane
   ═══════════════════════════════════════════════════════ */
function Sky() {
  return (
    <mesh position={[0, 4, -12]} rotation={[0, 0, 0]}>
      <planeGeometry args={[40, 12]} />
      <meshBasicMaterial color="#b2d8e8" transparent opacity={0.3} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════
   CLOUDS
   ═══════════════════════════════════════════════════════ */
function Cloud({ position, scale = 1 }) {
  const ref = useRef();
  const speed = useMemo(() => 0.15 + Math.random() * 0.2, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.x += speed * delta;
      if (ref.current.position.x > 12) ref.current.position.x = -12;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={1} />
      </mesh>
      <mesh position={[0.35, 0.05, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={1} />
      </mesh>
      <mesh position={[-0.3, -0.05, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={1} />
      </mesh>
      <mesh position={[0.1, 0.15, 0.15]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={1} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN SCENE — Composites all elements
   ═══════════════════════════════════════════════════════ */
function Scene() {
  const scene = useRef();

  useFrame((state) => {
    if (scene.current) {
      // Gentle camera-like rotation of the whole scene
      scene.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08 + 0.3;
    }
  });

  return (
    <group ref={scene} position={[0, -1.2, 0]}>
      {/* Sky & atmosphere */}
      <Sky />
      <Sun />
      <Cloud position={[-4, 4.5, -5]} scale={1.2} />
      <Cloud position={[2, 5, -6]} scale={0.9} />
      <Cloud position={[7, 4.2, -4]} scale={1.0} />

      {/* Terrain */}
      <Hills />
      <GrassField />
      <Road />

      {/* Vehicles on road */}
      <Car position={[0.5, 0, 0.3]} />
      <Motorcycle position={[-3.5, 0, -0.5]} />
      <Bicycle position={[4, 0, -0.4]} />

      {/* Roadside people */}
      <RoadsidePerson position={[-2, 0, 2.2]} color="#e76f51" />
      <RoadsidePerson position={[5.5, 0, 2.5]} color="#4a90d9" />
      <RoadsidePerson position={[2.5, 0, -2.0]} color="#e9c46a" />

      {/* Trees — near side */}
      <Tree position={[-6, 0, 2.8]} scale={0.9} swaySpeed={1.2} />
      <RoundTree position={[-3, 0, 3.8]} scale={0.8} />
      <Tree position={[0, 0, 3.5]} scale={1.0} swaySpeed={0.9} />
      <RoundTree position={[3, 0, 2.5]} scale={1.1} swaySpeed={1.0} />
      <Tree position={[6, 0, 4.0]} scale={0.85} swaySpeed={1.3} />
      <RoundTree position={[8, 0, 3.2]} scale={0.7} />

      {/* Trees — far side */}
      <RoundTree position={[-7, 0, -3.0]} scale={1.0} />
      <Tree position={[-4.5, 0, -3.5]} scale={1.1} swaySpeed={1.1} />
      <RoundTree position={[-1.5, 0, -2.8]} scale={0.85} swaySpeed={0.7} />
      <Tree position={[1, 0, -3.8]} scale={0.9} swaySpeed={1.0} />
      <RoundTree position={[4, 0, -3.2]} scale={1.0} />
      <Tree position={[7, 0, -3.6]} scale={0.8} swaySpeed={1.4} />

      {/* Distant trees (smaller) */}
      <Tree position={[-5, 0, -5.5]} scale={0.5} swaySpeed={0.6} />
      <RoundTree position={[2, 0, -5.0]} scale={0.55} />
      <Tree position={[6, 0, -5.8]} scale={0.45} swaySpeed={0.8} />

      {/* Wind effects */}
      <WindParticles />
      <WindStreaks />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORTED COMPONENT
   ═══════════════════════════════════════════════════════ */
export const HeroCar3D = () => {
  return (
    <div className="w-full h-full" style={{ minHeight: '400px' }}>
      <Canvas
        camera={{ position: [6, 4, 8], fov: 38 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#e8f4f0']} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[8, 8, 5]}
          intensity={1.3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          color="#fffbe6"
        />
        <directionalLight position={[-4, 4, -3]} intensity={0.3} color="#87ceeb" />
        <hemisphereLight skyColor="#87ceeb" groundColor="#7cb342" intensity={0.4} />

        <Float speed={0.5} rotationIntensity={0} floatIntensity={0.1}>
          <Scene />
        </Float>

        <fog attach="fog" args={['#e8f4f0', 10, 22]} />
      </Canvas>
    </div>
  );
};
