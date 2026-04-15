import { prisma } from "@/lib/prisma";

export async function uploadDocument(workspaceId: string, profileId: string, name: string, content: string) {
  /**
   * Step 4: Document Ingestion
   * This is where isolated knowledge is stored. 
   * Each document belongs STICTLY to one workspace.
   */
  const document = await prisma.document.create({
    data: {
      workspaceId,
      profileId,
      name,
      content,
    },
  });

  // Next Step: We would split this content into chunks (DocumentChunks) here.
  return document;
}
