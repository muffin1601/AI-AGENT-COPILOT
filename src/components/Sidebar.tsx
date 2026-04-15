"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Files, Settings, LogOut, Cpu } from "lucide-react";
import styles from "./Sidebar.module.css";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Intelligence", href: "/chat", icon: MessageSquare },
  { label: "Knowledge", href: "/documents", icon: Files },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

export function Sidebar({ user, role }: { user: any, role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userDisplayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Authenticated User";

  if (pathname === "/" || pathname === "/login") return null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <Cpu className={styles.logoCpu} />
        </div>
        <span className={styles.logoText}>Pulse</span>
      </div>

      {user && (
        <div className={styles.userBox}>
          <div className={styles.userAvatar}>{userInitial}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userDisplayName}</span>
            <span className={styles.userRole}>Clearance: {role}</span>
          </div>
        </div>
      )}

      <nav className={styles.nav}>
        {navItems.map((item) => {
          // RBAC: Check if user has role for this item
          if (item.roles && !item.roles.includes(role)) return null;

          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
            >
              <Icon className={styles.navIcon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut className={styles.navIcon} />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
}
