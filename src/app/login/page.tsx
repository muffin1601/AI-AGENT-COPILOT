"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setIsLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={styles.card}
      >
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>pulse</Link>
          <div>
            <h1 className={styles.title}>Secure Access</h1>
            <p className={styles.subtitle}>
              Connect your distributed cognitive unit.
            </p>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleEmailSignIn} className={styles.form}>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? "Authenticating..." : "Continue"}
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.line} />
            <span>Identity Protocol</span>
            <div className={styles.line} />
          </div>

          <div className={styles.socialGrid}>
            <button
              onClick={() => handleOAuthSignIn("github")}
              className={styles.socialBtn}
            >
              <GithubIcon style={{ width: '18px', height: '18px' }} />
              GitHub Identity
            </button>
            <button
              id="google-sso"
              onClick={() => handleOAuthSignIn("google")}
              className={styles.socialBtn}
            >
              <GoogleIcon style={{ width: '18px', height: '18px' }} />
              Google SSO
            </button>
          </div>
        </div>

        <p className={styles.footerText}>
          By proceeding, you agree to the Pulse Labs Protocol.<br />
          Data sovereignty is enforced by default.
        </p>
      </motion.div>
    </div>
  );
}

function GithubIcon({ style }: { style?: any }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function GoogleIcon({ style }: { style?: any }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
