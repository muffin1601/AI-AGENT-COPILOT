"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import styles from "@/app/layout.module.css";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname?.startsWith("/auth");
  
  if (isAuthPage) {
    return <div className="min-h-screen w-full bg-black">{children}</div>;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}
