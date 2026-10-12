"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count, mobile }: { count: number; mobile: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Deterministic stateless hash so particle layout is stable across renders
  const seeds = useMemo(() => {
    const seed = 1337 + count * 7919 + (mobile ? 1 : 0);
    const rand = (n: number) => {
      const h = Math.imul(n ^ seed, 2654435761) >>> 0;
      const h2 = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
      return ((h2 ^ (h2 >>> 13)) >>> 0 % 100000) / 100000;
    };
    return Array.from({ length: count }, (_, i) => ({
      x: (rand(i * 7 + 1) - 0.5) * 26,
      y: (rand(i * 7 + 2) - 0.5) * 16,
      z: -4 - rand(i * 7 + 3) * 14,
      s: 0.02 + rand(i * 7 + 4) * (mobile ? 0.05 : 0.09),
      sp: 0.15 + rand(i * 7 + 5) * 0.5,
      ph: rand(i * 7 + 6) * Math.PI * 2,
      yellow: rand(i * 7 + 7) < 0.16,
    }));
  }, [count, mobile]);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const px = pointer.x * 0.6;
    const py = pointer.y * 0.4;
    for (let i = 0; i < seeds.length; i++) {
      const p = seeds[i];
      dummy.position.set(
        p.x + Math.sin(t * p.sp + p.ph) * 0.5 + px * (0.4 + p.s * 4),
        p.y + Math.cos(t * p.sp * 0.8 + p.ph) * 0.45 + py * (0.4 + p.s * 4),
        p.z
      );
      dummy.scale.setScalar(p.s * (1 + Math.sin(t * 1.4 + p.ph) * 0.12));
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
      ref.current.setColorAt(i, color.set(p.yellow ? "#ffd400" : "#8a8f96"));
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.75} />
    </instancedMesh>
  );
}

function Rings() {
  const g1 = useRef<THREE.Mesh>(null!);
  const g2 = useRef<THREE.Mesh>(null!);
  const g3 = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // very slow, cinematic
    g1.current.rotation.z = t * 0.05;
    g2.current.rotation.z = -t * 0.035;
    g3.current.rotation.x = Math.sin(t * 0.1) * 0.25;
    g3.current.rotation.y = t * 0.03;
  });
  return (
    <group position={[4.6, -1.2, -9]} rotation={[0.4, 0.2, 0]}>
      <mesh ref={g1}>
        <torusGeometry args={[2.6, 0.02, 8, 128]} />
        <meshBasicMaterial color="#ffd400" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh ref={g2}>
        <torusGeometry args={[2.0, 0.014, 8, 128]} />
        <meshBasicMaterial color="#5a5e64" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh ref={g3}>
        <torusGeometry args={[3.2, 0.01, 8, 128]} />
        <meshBasicMaterial color="#ffd400" transparent opacity={0.18} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Tubes() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.12, 0.03);
    ref.current.position.y = Math.sin(t * 0.25) * 0.15;
  });
  return (
    <group ref={ref} position={[-5.2, 0.4, -8]}>
      {[-1.2, 0, 1.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* glass tube — cheap transparent standard material.
              (meshPhysicalMaterial transmission was removed: it forces a
              second full scene render pass and was the main lag source.) */}
          <mesh>
            <cylinderGeometry args={[0.34, 0.34, 4.4, 24, 1, true]} />
            <meshStandardMaterial
              color="#9aa0a6"
              transparent
              opacity={0.22}
              roughness={0.15}
              metalness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* glowing liquid */}
          <mesh position={[0, -0.9 + i * 0.35, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 1.1, 20]} />
            <meshStandardMaterial
              color={i === 1 ? "#ffd400" : "#3a3d42"}
              emissive={i === 1 ? "#ffd400" : "#000000"}
              emissiveIntensity={i === 1 ? 0.9 : 0}
              roughness={0.3}
            />
          </mesh>
          {/* caps */}
          <mesh position={[0, 2.25, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.14, 20]} />
            <meshStandardMaterial color="#1c1e21" metalness={0.9} roughness={0.35} />
          </mesh>
          <mesh position={[0, -2.25, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.14, 20]} />
            <meshStandardMaterial color="#1c1e21" metalness={0.9} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Rig({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const s = scrollY.current; // 0..1
    const targetY = -s * 3.2 + Math.sin(t * 0.2) * 0.12;
    const targetX = Math.sin(t * 0.12) * 0.25;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.lookAt(0, targetY - 0.2, -6);
  });
  return null;
}

export default function LabScene({ scrollRef }: { scrollRef?: React.MutableRefObject<number> }) {
  const fallbackScroll = useRef(0);
  const scrollY = scrollRef ?? fallbackScroll;
  const [mobile, setMobile] = React.useState(false);
  // WebGL capability is static per device — read once during client render.
  const [ok] = React.useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    // track scroll if no external ref
    if (!scrollRef) {
      const onScroll = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        fallbackScroll.current = h > 0 ? window.scrollY / h : 0;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        mq.removeEventListener?.("change", update);
        window.removeEventListener("scroll", onScroll);
      };
    }
    return () => mq.removeEventListener?.("change", update);
  }, [scrollRef]);

  if (!ok) return null; // CSS fallback behind

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={mobile ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 55 }}
        onCreated={({ gl }) => {
          try {
            gl.setClearColor("#050505", 0);
          } catch {}
        }}
      >
        <fog attach="fog" args={["#050505", 8, 22]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} color="#fff6d8" />
        <pointLight position={[-4, 2, -2]} intensity={12} color="#ffd400" distance={14} />
        <pointLight position={[5, -2, -4]} intensity={8} color="#ffe45e" distance={12} />
        <Particles count={mobile ? 100 : 220} mobile={mobile} />
        {!mobile && <Rings />}
        {!mobile && <Tubes />}
        {/* floor grid */}
        <gridHelper args={[28, 28, "#ffd400", "#1c1e21"]} position={[0, -3.4, -6]} />
        <Rig scrollY={scrollY} />
      </Canvas>
      {/* cinematic vignette + grain overlay */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 38%, transparent 40%, rgba(0,0,0,.55) 78%, rgba(0,0,0,.9) 100%)" }} />
    </div>
  );
}
