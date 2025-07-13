'use client';
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { motion, useTransform, useViewportScroll } from 'framer-motion';
import Link from 'next/link';
import styles from './InteractiveHero.module.css';

/** 3D Particle Field that orbits on mouse */
function Particles() {
  const ref = useRef<any>();
  const { viewport, mouse } = useThree();
  const count = 500;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * viewport.width * 1.5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.2;
      arr[i * 3 + 2] = Math.random() * 2 - 1;
    }
    return arr;
  }, [viewport, count]);

  useFrame(() => {
    if (ref.current) {
      // gently orbit the whole cloud based on mouse
      ref.current.rotation.y = mouse.x * 0.5;
      ref.current.rotation.x = -mouse.y * 0.5;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial size={0.02} color="#88f" sizeAttenuation />
    </Points>
  );
}

export default function InteractiveHero() {
  // parallax y‑offset for text
  const { scrollY } = useViewportScroll();
  const yOffset = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <section className={styles.hero}>
      {/* 3D canvas background */}
      <Canvas className={styles.canvas} camera={{ position: [0, 0, 3], fov: 75 }}>
        <Suspense fallback={null}>
          <Particles />
        </Suspense>
      </Canvas>

      {/* layered gradient & spotlight mask */}
      <div className={styles.overlay}>
        <div className={styles.spotlight} />
      </div>

      {/* Foreground content */}
      <motion.div style={{ y: yOffset }} className={styles.content}>
        <h1>Your micro‑task world awaits</h1>
        <p>Whether you’re an advertiser or a freelancer—everything you need, right here.</p>
        <div className={styles.buttons}>
          <Link href="/sign-in">
            <motion.button whileHover={{ scale: 1.05 }} className={styles.primary}>
              Get Started
            </motion.button>
          </Link>
          <Link href="/task-feed">
            <motion.button whileHover={{ scale: 1.05 }} className={styles.secondary}>
              Browse Tasks
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
