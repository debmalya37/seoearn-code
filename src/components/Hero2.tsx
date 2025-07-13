// src/components/Hero2.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero2.module.css';
import avatar from "../../asset/avatars.png";
import Image from 'next/image';


export default function Hero2() {
  return (
    <header className={styles.hero}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>SEO Earning Space</div>
        {/* <ul className={styles.links}>
          {['About','Task Feed','Referral','FAQs','Contact'].map((l) => (
            <li key={l}>
              <Link href={`/${l.toLowerCase().replace(/\s+/g,'')}`}>
                {l}
              </Link>
            </li>
          ))}
        </ul> */}
        <Link href="/sign-in">
          <motion.a className={styles.cta} whileHover={{ scale: 1.05 }}>
            Get Started
          </motion.a>
        </Link>
      </nav>

      {/* Main headline */}
      <div className={styles.content}>
        <div className={styles.socialProof}>
        <Image
            src="/avatars.png"
            alt="Users"
            width={100}
            height={80}
            className="m-0"
          />
          <span>Join thousands earning daily</span>
        </div>
        <h1 className={styles.title}>
          Earn from <em>Micro‑Tasks</em><br/>
          or Post Your Own
        </h1>
        <p className={styles.subtitle}>
          Connect advertisers and freelancers on one platform—get tasks done or earn real cash, plus multi‑level referral bonuses.
        </p>
        <div className={styles.buttons}>
          <Link href="/sign-in">
            <motion.a className={styles.primaryBtn} whileHover={{ scale: 1.05 }}>
              Get Started
            </motion.a>
          </Link>
          <Link href="/TaskFeed">
            <motion.a className={styles.secondaryBtn} whileHover={{ scale: 1.05 }}>
              Browse Tasks
            </motion.a>
          </Link>
        </div>
        <div className={styles.glow} />
      </div>
    </header>
  );
}
