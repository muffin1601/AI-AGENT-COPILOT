"use client";

import { Settings, Shield, Bell, Zap, Database, Globe, Command } from "lucide-react";
import styles from "./settings.module.css";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.title}
        >
          protocol settings
        </motion.h1>
        <p className={styles.subtitle}>
          Configure your autonomous intelligence units and workspace orchestration.
        </p>
      </header>

      {/* Security & Access */}
      <section className={styles.section}>
         <h3 className={styles.sectionTitle}>Security & Identity</h3>
         <div className={styles.cardGrid}>
            <SettingCard 
              icon={<Shield size={24} strokeWidth={1} />}
              title="Identity Protocol"
              subtitle="Manage your cryptographic authentication layers."
              label="Primary Wallet"
              placeholder="0x71C...3924"
            />
            <SettingCard 
              icon={<Globe size={24} strokeWidth={1} />}
              title="Regional Proxy"
              subtitle="Execute localized research with high-fidelity nodes."
              label="Node Affinity"
              placeholder="US-West (Oregon)"
            />
         </div>
      </section>

      {/* Intelligence Configuration */}
      <section className={styles.section}>
         <h3 className={styles.sectionTitle}>Neural Configuration</h3>
         <div className={styles.cardGrid}>
            <SettingCard 
              icon={<Zap size={24} strokeWidth={1} />}
              title="Inference Priority"
              subtitle="Balance low-latency vs high-fidelity intelligence."
              label="Execution Mode"
              placeholder="Extreme Priority (Sub-10ms)"
            />
            <SettingCard 
              icon={<Database size={24} strokeWidth={1} />}
              title="Knowledge Indexing"
              subtitle="Control how your data is vectorised and accessed."
              label="Sampling Depth"
              placeholder="100% (Lossless Precision)"
            />
         </div>
      </section>

      <div className="flex justify-start pt-12">
         <button className={styles.saveBtn}>Commit Changes</button>
      </div>
    </div>
  );
}

function SettingCard({ icon, title, subtitle, label, placeholder }: { icon: any, title: string, subtitle: string, label: string, placeholder: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.card}
    >
      <div className={styles.settingHeader}>
         <div className={styles.iconBox}>{icon}</div>
         <div className="flex flex-col">
            <span className={styles.settingTitle}>{title}</span>
            <span className={styles.settingMeta}>{subtitle}</span>
         </div>
      </div>
      
      <div className={styles.inputGroup}>
         <label className={styles.inputLabel}>{label}</label>
         <input type="text" className={styles.inputField} placeholder={placeholder} />
      </div>
    </motion.div>
  );
}
