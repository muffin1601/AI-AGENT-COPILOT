"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Database, Command, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { PulseLogo } from "@/components/PulseLogo";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    viewport: { once: true }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarInner}>
          <Link href="/">
            <PulseLogo />
          </Link>
          
          <div className={styles.navActionGroup}>
            <Link href="/login" className={styles.btnPrimary}>
              Log in
            </Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.badge}
          >
            Intelligence Orchestration for Scale
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className={styles.heroTitle}
          >
            Intelligent <span>agents</span><br />for modern teams.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className={styles.heroSubtitle}
          >
            Connect distributed knowledge silos into a singular cognitive unit. 
            Orchestrate complex workflows with custom-trained autonomous agents.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className={styles.heroActions}
          >
            <Link href="/login" className={styles.btnPrimary}>
              Get Started Free
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.8 }}
            className={styles.heroMockup}
          >
            <Image 
              src="/pulse_hero_mockup.png"
              alt="Pulse Platform Overview"
              fill
              priority
            />
            <div className={styles.mockupOverlay} />
          </motion.div>
        </div>
      </section>

      <section id="features" className={styles.section}>
        <div className={styles.sectionHeadingArea}>
          <span className={styles.badge}>Architecture</span>
          <h2 className={styles.sectionTitle}>Built for Universal Scale.</h2>
        </div>

        <div className={styles.featuresGrid}>
          <motion.div {...fadeInUp} className={`${styles.featureCard} ${styles.col8}`}>
            <div>
              <Database className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Neural Data Vault</h3>
              <p className={styles.cardText}>
                Your entire organization's memory, searchable and indexable in under 10ms. 
                Connect files, databases, and third-party tools into one singular vault.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{delay: 0.2}} className={`${styles.featureCard} ${styles.col4}`}>
            <div>
              <Shield className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Zero Trust</h3>
              <p className={styles.cardText}>
                Privacy is built at the core. Your data never leaves your environment.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{delay: 0.3}} className={`${styles.featureCard} ${styles.col4}`}>
            <div>
              <Zap className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Sub-10ms</h3>
              <p className={styles.cardText}>
                High-throughput inference for real-time agent reaction and execution.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{delay: 0.4}} className={`${styles.featureCard} ${styles.col8}`}>
            <div>
              <Command className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Autonomous Orchestration</h3>
              <p className={styles.cardText}>
                Pulse doesn't just suggest—it acts. Deploy agents that browse the web, 
                access databases, and coordinate with teams automatically.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Queries/MO</span>
            <span className={styles.statValue}>4.8B+</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Active Deployments</span>
            <span className={styles.statValue}>12,400</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Reduced Latency</span>
            <span className={styles.statValue}>92%</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Uptime</span>
            <span className={styles.statValue}>99.9%</span>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.ctaSection}`}>
        <motion.h2 {...fadeInUp} className={styles.ctaTitle}>
          Ready to accelerate your <br />
          <span>entire organization?</span>
        </motion.h2>
        <motion.div {...fadeInUp} transition={{delay: 0.2}}>
          <Link href="/login" className={styles.btnPrimary}>
            Get Started Now
          </Link>
        </motion.div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <span className={styles.logoText}>pulse ai</span>
            <p className={styles.cardText} style={{maxWidth: '240px'}}>
              Building the next generation of decentralized intelligence orchestration.
            </p>
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.statLabel}>Platform</span>
            <a href="#" className={styles.navLink}>API Reference</a>
            <a href="#" className={styles.navLink}>System Health</a>
            <a href="#" className={styles.navLink}>Docs</a>
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.statLabel}>Company</span>
            <a href="#" className={styles.navLink}>About Us</a>
            <a href="#" className={styles.navLink}>Media Kit</a>
            <a href="#" className={styles.navLink}>Careers</a>
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.statLabel}>Legal</span>
            <a href="#" className={styles.navLink}>Privacy Policy</a>
            <a href="#" className={styles.navLink}>Terms of Service</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Pulse Labs Worldwide</span>
          <div className={styles.footerBottomGroup}>
            <span>PULSE PROTOCOL</span>
            <span>V 0.1.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
