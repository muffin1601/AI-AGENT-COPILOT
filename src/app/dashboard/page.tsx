import { Files, MessageSquare, Activity, Zap, TrendingUp, Clock } from "lucide-react";
import styles from "./dashboard.module.css";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userDisplayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Operator";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.welcomeBadge}>Intelligence Console Active</div>
        <h1 className={styles.title}>Welcome back, {userDisplayName}</h1>
        <p className={styles.subtitle}>Real-time metrics for your neural workspace.</p>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><Files className={styles.trendIcon} /></div>
            <div className={`${styles.statTrend} ${styles.trendUp}`}>
              <TrendingUp className={styles.trendIcon} /> +12%
            </div>
          </div>
          <p className={styles.statLabel}>Intelligence Corpus</p>
          <h2 className={styles.statValue}>1,248</h2>
          <p className={styles.activityTime}>Active documents indexed</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><MessageSquare className={styles.trendIcon} /></div>
            <div className={`${styles.statTrend} ${styles.trendUp}`}>
              <TrendingUp className={styles.trendIcon} /> +5%
            </div>
          </div>
          <p className={styles.statLabel}>Neural Sessions</p>
          <h2 className={styles.statValue}>84</h2>
          <p className={styles.activityTime}>Conversations this week</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><Zap className={styles.trendIcon} /></div>
            <div className={`${styles.statTrend} ${styles.trendUp}`}>
              <TrendingUp className={styles.trendIcon} /> 0.8s
            </div>
          </div>
          <p className={styles.statLabel}>Inference Latency</p>
          <h2 className={styles.statValue}>Optimal</h2>
          <p className={styles.activityTime}>Avg. response velocity</p>
        </div>
      </section>

      <div className={styles.sections}>
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Protocol Activity</h3>
            <Activity className={styles.trendIcon} />
          </div>
          <div className={styles.activityList}>
            <ActivityItem icon={<Clock />} text="Technical Specs v2.pdf indexed successfully" time="2 minutes ago" />
            <ActivityItem icon={<Clock />} text="New neural session initialized by Admin" time="1 hour ago" />
            <ActivityItem icon={<Clock />} text="System optimization protocol completed" time="4 hours ago" />
          </div>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.activityTitle}>Neural Efficiency</h3>
          <div className={styles.efficiencyArea}>
             <div className={styles.efficiencyCircle}>
                <div className={styles.efficiencySpin}></div>
                <span className={styles.efficiencyValue}>94%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, text, time }: { icon: any, text: string, time: string }) {
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityDot}></div>
      <div className={styles.activityInfo}>
        <p className={styles.activityText}>{text}</p>
        <span className={styles.activityTime}>{time}</span>
      </div>
    </div>
  );
}
