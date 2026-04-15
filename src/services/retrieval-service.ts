import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Step 5: Semantic Retrieval
 * Finds the most relevant document chunks based on a user's query.
 */
export async function getRelevantContext(query: string, workspaceId: string, limit: number = 3) {
  try {
    // 1. Generate embedding for the search query
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const embedding = response.data[0].embedding;
    const embeddingString = `[${embedding.join(",")}]`;

    // 2. Perform vector similarity search using cosine distance (<=>)
    // We join with Document to ensure we only search chunks from the correct workspace
    const results: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        dc.content,
        1 - (dc.embedding <=> $1::vector) as similarity
      FROM "DocumentChunk" dc
      JOIN "Document" d ON dc."documentId" = d.id
      WHERE d."workspaceId" = $2
      ORDER BY similarity DESC
      LIMIT $3
    `, embeddingString, workspaceId, limit);

    // 3. Extract and combine the text
    return results
      .filter(r => r.similarity > 0.5) 
      .map(r => r.content)
      .join("\n\n---\n\n");
  } catch (error) {
    console.error("Retrieval Error:", error);
    return "";
  }
}
