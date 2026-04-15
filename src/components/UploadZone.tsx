"use client";

import { useRef, useState } from "react";
import { useSupabaseUser } from "@/utils/supabase/hooks";
import { FileUp, Loader2 } from "lucide-react";
import styles from "./UploadZone.module.css";

export function UploadZone({ workspaceId }: { workspaceId?: string }) {
  const { user, loading } = useSupabaseUser();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !workspaceId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspaceId", workspaceId);
    formData.append("profileId", user.id);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      console.log("Ingestion started!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div 
      className={styles.uploadContainer} 
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.docx,.txt"
      />
      <div className={styles.iconBox}>
        {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileUp className="w-6 h-6" />}
      </div>
      <div>
        <h3 className={styles.title}>
          {isUploading ? "Uploading company docs..." : "Drop company documents here."}
        </h3>
        <p className={styles.subtitle}>
          PDF, DOCX, or TXT (Max 25MB). Your data remains isolated to your workspace.
        </p>
      </div>
    </div>
  );
}
