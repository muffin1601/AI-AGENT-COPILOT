import { FileText, CheckCircle2, History, ArrowUpRight } from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import styles from "./documents.module.css";
import { getDocuments, getCurrentWorkspace } from "./actions";

export default async function DocumentsPage() {
  const workspace = await getCurrentWorkspace();
  const documents = workspace ? await getDocuments(workspace.id) : [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>knowledge base</h1>
        <p className={styles.subtitle}>
          Manage the documents that power your company copilot.
        </p>
      </header>

      {/* The Luxurious Ingestion Point */}
      <UploadZone workspaceId={workspace?.id} />

      {/* The Knowledge Repository */}
      <div className={styles.repository}>
        <div className={styles.repoHeader}>
          <h3 className={styles.repoTitle}>Workspace Knowledge</h3>
          <History className={styles.repoHeaderIcon} />
        </div>
        
        <div className={styles.table}>
          {documents.length === 0 && (
            <div className={styles.emptyState}>
              No intelligence sources discovered in this workspace yet.
            </div>
          )}
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className={styles.row}
            >
              <div className={styles.rowInner}>
                <div className={styles.iconBox}>
                  <FileText className={styles.fileIcon} strokeWidth={1} />
                </div>
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>{doc.name}</span>
                  <span className={styles.fileStats}>{doc.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.rowActions}>
                <div className={`${styles.statusBadge} ${doc.status === 'COMPLETED' ? styles.indexedStatus : styles.activeStatus}`}>
                  {doc.status === 'COMPLETED' ? (
                    <CheckCircle2 className={styles.statusIcon} />
                  ) : (
                    <div className={styles.statusDot} />
                  )}
                  {doc.status}
                </div>
                <button className={styles.actionBtn}>
                  <ArrowUpRight className={styles.fileIcon} strokeWidth={1} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
