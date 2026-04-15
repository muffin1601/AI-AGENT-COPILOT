import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { processDocument } from "@/services/ingestion-service";
import { hasPermission } from "@/lib/rbac";
import { logEvent } from "@/services/audit-service";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const workspaceId = formData.get("workspaceId") as string;
    const profileId = formData.get("profileId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // RBAC: Check permissions
    const canUpload = await hasPermission(profileId, workspaceId, "DOCUMENTS_UPLOAD");
    if (!canUpload) {
      return NextResponse.json({ error: "Security Violation: Insufficient clearance for document ingestion." }, { status: 403 });
    }

    // 1. ArrayBuffer -> Buffer conversion
    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = "";

    // 2. Parse based on File Type
    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      rawText = data.text;
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const { value } = await mammoth.extractRawText({ buffer });
      rawText = value;
    } else {
      rawText = buffer.toString("utf-8");
    }

    // 3. Store the Document in Database
    const document = await prisma.document.create({
      data: {
        workspaceId,
        profileId,
        name: file.name,
        status: "PROCESSING",
      },
    });

    // 4. Trigger Ingestion Pipeline (Asynchronously)
    processDocument(document.id, rawText);

    // 5. Audit Logging
    await logEvent(workspaceId, profileId, "UPLOAD", { fileName: file.name, fileSize: file.size });

    return NextResponse.json({ 
      message: "Document ingestion started", 
      id: document.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Ingestion API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
