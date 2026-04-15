"use client";

import { motion } from "framer-motion";
import styles from "./PulseLogo.module.css";

export function PulseLogo({ className }: { className?: string }) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.iconBox}>
        <div className={styles.innerDot} />
        
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={styles.pulseRing}
        />
      </div>
      <span className={styles.text}>pulse</span>
    </div>
  );
}
