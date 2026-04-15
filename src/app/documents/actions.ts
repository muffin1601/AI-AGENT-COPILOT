"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getDocuments(workspaceId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return await prisma.document.findMany({
      where: {
        workspaceId,
        // We ensure security by checking if the user is a member of this workspace
        workspace: {
          members: {
            some: {
              profileId: user.id
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (e) {
    console.error("Error fetching documents:", e);
    return [];
  }
}

export async function getCurrentWorkspace() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const membership = await prisma.workspaceMember.findFirst({
            where: { profileId: user.id },
            include: { workspace: true }
        });

        return membership?.workspace || null;
    } catch (e) {
        console.error("Error fetching workspace:", e);
        return null;
    }
}
