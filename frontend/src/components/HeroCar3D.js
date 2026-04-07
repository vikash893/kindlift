import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   CSS-ONLY FALLBACK — Animated gradient orb
   Shows when WebGL is unavailable
   ═══════════════════════════════════════════════════════ */
const FallbackHero = () => (
  <div className="w-full h-full relative overflow-hidden" style={{ minHeight: '500px', background: '#000' }}>
    {/* Animated gradient orb */}
    <div
      className="absolute animate-spin-slow"
      style={{
        top: '50%',
        left: '50%',
        width: '400px',
        height: '400px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #1a1a1a 0%, #000 70%)',
        boxShadow: '0 0 80px rgba(232, 168, 56, 0.08), inset 0 0 60px rgba(232, 168, 56, 0.05)',
      }}
    />
    {/* Orbit ring 1 */}
    <div
      className="absolute animate-spin-slow"
      style={{
        top: '50%',
        left: '50%',
        width: '500px',
        height: '500px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1px solid rgba(232, 168, 56, 0.15)',
      }}
    />
    {/* Orbit ring 2 */}
    <div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        width: '600px',
        height: '600px',
        transform: 'translate(-50%, -50%) rotate(60deg)',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        animation: 'spin 20s linear infinite reverse',
      }}
    />
    {/* Glow */}
    <div
      className="absolute animate-pulse-soft"
      style={{
        top: '50%',
        left: '50%',
        width: '200px',
        height: '200px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 168, 56, 0.1) 0%, transparent 70%)',
      }}
    />
  </div>
);

/* ═══════════════════════════════════════════════════════
   THREE.JS HERO — Only renders if WebGL is available
   ═══════════════════════════════════════════════════════ */
let Canvas, Float;
try {
  const fiber = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  Canvas = fiber.Canvas;
  Float = drei.Float;
} catch (e) {
  Canvas = null;
  Float = null;
}

/* Check WebGL support */
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

function GoldenTorus() {
  const ref = useRef();
  const { useFrame } = require('@react-three/fiber');

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.08, 32, 100]} />
      <meshStandardMaterial color="#e8a838" metalness={0.9} roughness={0.1} emissive="#e8a838" emissiveIntensity={0.15} />
    </mesh>
  );
}

function GlowingSphere() {
  const ref = useRef();
  const { useFrame } = require('@react-three/fiber');

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial color="#111" metalness={0.95} roughness={0.05} envMapIntensity={2} />
    </mesh>
  );
}

function OrbitRing({ radius = 2.8, speed = 0.15 }) {
  const ref = useRef();
  const { useFrame } = require('@react-three/fiber');

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
      ref.current.rotation.x = Math.PI / 3;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.03, 16, 80]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.3} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function Particles() {
  const ref = useRef();
  const count = 60;
  const { useFrame } = require('@react-three/fiber');

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 3 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#e8a838" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <group>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <GlowingSphere />
        <GoldenTorus />
        <OrbitRing radius={2.8} speed={0.15} />
        <OrbitRing radius={3.2} speed={-0.1} />
      </Float>
      <Particles />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORTED COMPONENT — with WebGL error boundary
   ═══════════════════════════════════════════════════════ */
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('WebGL unavailable, using CSS fallback:', error.message);
  }
  render() {
    if (this.state.hasError) return <FallbackHero />;
    return this.props.children;
  }
}

export const HeroCar3D = () => {
  const [webglFailed, setWebglFailed] = useState(false);

  // Check WebGL on mount
  if (!Canvas || !Float || !isWebGLAvailable() || webglFailed) {
    return <FallbackHero />;
  }

  return (
    <WebGLErrorBoundary>
      <div className="w-full h-full" style={{ minHeight: '500px' }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            if (!gl.domElement) setWebglFailed(true);
          }}
          fallback={<FallbackHero />}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} color="#fffbe6" />
          <directionalLight position={[-3, 3, -3]} intensity={0.5} color="#e8a838" />
          <pointLight position={[0, 0, 4]} intensity={0.8} color="#e8a838" distance={10} />
          <Scene />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
};
