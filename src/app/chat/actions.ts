"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma-db";
import { revalidatePath } from "next/cache";

export async function getConversations(workspaceId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return await prisma.conversation.findMany({
      where: {
        workspaceId,
        profileId: user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  } catch (e) {
    console.error("Error fetching conversations:", e);
    return [];
  }
}

export async function createConversation(workspaceId: string, title: string = "New Intelligence") {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const conversation = await prisma.conversation.create({
      data: {
        workspaceId,
        profileId: user.id,
        title
      }
    });

    revalidatePath("/chat");
    return conversation;
  } catch (e) {
    console.error("Error creating conversation:", e);
    throw e;
  }
}

export async function getMessages(conversationId: string) {
  try {
    return await prisma.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  } catch (e) {
    console.error("Error fetching messages:", e);
    return [];
  }
}

export async function sendMessage(conversationId: string, role: string, content: string) {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        role,
        content
      }
    });

    // Update the conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    revalidatePath(`/chat?id=${conversationId}`);
    return message;
  } catch (e) {
    console.error("Error sending message:", e);
    throw e;
  }
}

export async function ensureDefaultWorkspace() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Ensure Profile exists
    let profile = await prisma.profile.findUnique({ where: { id: user.id } });
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0]
        }
      });
    }

    // Ensure Workspace exists
    let membership = await prisma.workspaceMember.findFirst({
      where: { profileId: user.id },
      include: { workspace: true }
    });

    if (!membership) {
      const workspace = await prisma.workspace.create({
        data: {
          name: "Acme Corp.",
          slug: `acme-${Math.random().toString(36).substring(7)}`,
          members: {
            create: {
              profileId: user.id,
              role: "OWNER"
            }
          }
        }
      });
      return workspace;
    }

    return membership.workspace;
  } catch (e) {
    console.error("Error ensuring workspace:", e);
    throw e;
  }
}
