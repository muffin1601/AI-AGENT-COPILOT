import { groq } from "@ai-sdk/groq";
import { streamText } from 'ai';
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma-db";
import { getRelevantContext } from "@/services/retrieval-service";
import { logEvent } from "@/services/audit-service";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { messages } = body;
    const bodyId = body.conversationId || body.id;
    const { searchParams } = new URL(req.url);
    const hookId = searchParams.get("conversationId");
    const conversationId = bodyId || hookId;

    if (!conversationId) {
      console.error("Chat API: Missing conversationId. Body:", JSON.stringify(body));
      return new Response("Conversation ID required", { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { profileId: true, workspaceId: true }
    });

    if (!conversation || conversation.profileId !== user.id) {
      return new Response("Unauthorized conversation access", { status: 403 });
    }

    // 1. Semantic Retrieval (RAG)
    const lastUserMessage = (messages || []).filter((m: any) => m.role === "user").pop();
    let context = "";
    if (lastUserMessage) {
      context = await getRelevantContext(lastUserMessage.content, conversation.workspaceId);
    }

    // Normalize messages for AI SDK v6
    const normalizedMessages = (messages || []).map((m: any) => {
      let content = m.content;
      if (!content && m.parts) {
        content = m.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("");
      }
      return {
        role: m.role,
        content: content || "",
      };
    });

    // 2. Build System Prompt with Context
    const systemPrompt = `You are a helpful AI Assistant. 
    Use the following pieces of retrieved context from the user's workspace to answer the question. 
    If you don't know the answer or the context doesn't contain it, say so.
    
    CONTEXT:
    ${context || "No relevant document context found."}
    
    Maintain a professional tone.`;

    // Persist user message if not already persisted
    if (lastUserMessage) {
      await prisma.message.create({
        data: {
          conversationId,
          role: "user",
          content: lastUserMessage.content
        }
      });
    }

    // Audit the query
    if (lastUserMessage) {
      await logEvent(
        conversation.workspaceId,
        user.id,
        "QUERY",
        { prompt: lastUserMessage.content, conversationId }
      );
    }

    // Use Groq Llama 3.3 70B
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: normalizedMessages,
      onFinish: async ({ text }) => {
        try {
          await prisma.message.create({
            data: {
              conversationId,
              role: "assistant",
              content: text
            }
          });
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
          });
        } catch (e) {
          console.error("Failed to persist AI response:", e);
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
