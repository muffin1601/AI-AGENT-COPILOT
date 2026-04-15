"use client";

import { Search, Globe, ChevronRight, Zap, Target, History } from "lucide-react";
import styles from "./research.module.css";
import { motion } from "framer-motion";

export default function ResearchPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.title}
        >
          deep research
        </motion.h1>
        <p className={styles.subtitle}>
          Execute autonomous investigations across the global web index.
        </p>
      </header>

      {/* Central Research Interface */}
      <section className={styles.searchHero}>
        <div className="flex flex-col gap-6 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-neutral-600 bg-white/[0.02]"
          >
            Autonomous Search Agents Active
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.heroTitle}
          >
            Inquire in <span className="text-neutral-500 italic">real-time.</span>
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={styles.searchContainer}
        >
          <input 
            type="text" 
            placeholder="Launch search protocol..." 
            className={styles.searchInput}
          />
          <Search className={styles.searchIcon} size={32} />
        </motion.div>
      </section>

      {/* Investigation Logs */}
      <section className={styles.logs}>
        <div className="flex items-center justify-between px-6 border-b border-white/5 pb-8">
           <h3 className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.3em]">Historical Vectors</h3>
           <History className="w-5 h-5 text-neutral-800" />
        </div>
        
        <div className="space-y-6">
          <ResearchLog title="Market Trends: AI Orchestration 2025" domain="Global Index" />
          <ResearchLog title="Competitor Feature Gap Analysis" domain="Enterprise AI" />
          <ResearchLog title="Neural Network Latency Benchmarks" domain="Technical Review" />
        </div>
      </section>
    </div>
  );
}

function ResearchLog({ title, domain }: { title: string; domain: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.logItem}
    >
      <div className={styles.logMain}>
        <div className={styles.logIcon}>
           <Globe className="w-5 h-5" strokeWidth={1} />
        </div>
        <div className="flex flex-col">
          <span className={styles.logTitle}>{title}</span>
          <span className={styles.logMeta}>{domain}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-800" />
    </motion.div>
  );
}
