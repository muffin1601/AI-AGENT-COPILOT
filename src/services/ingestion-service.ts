import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processDocument(documentId: string, rawText: string) {
  
  const CHUNK_SIZE = 1000;
  const CHUNK_OVERLAP = 200;
  const chunks = []; 
  
  for (let i = 0; i < rawText.length; i += (CHUNK_SIZE - CHUNK_OVERLAP)) {
    chunks.push(rawText.slice(i, i + CHUNK_SIZE));
  }
 
 
  for (const content of chunks) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content, 
    });

    const embedding = response.data[0].embedding;
 

    const chunk = await prisma.documentChunk.create({
      data: {
        documentId,
        content,
        metadata: { length: content.length },
      },
      select: { id: true }
    });

    const embeddingString = `[${embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(
      `UPDATE "DocumentChunk" SET embedding = $1::vector WHERE id = $2`,
      embeddingString,
      chunk.id
    );
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { status: "COMPLETED" },
  });
}

