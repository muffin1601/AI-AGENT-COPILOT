import { prisma } from "@/lib/prisma";

/**
 * Step 3: Hierarchy Generation
 * Creates a User Profile and their first Workspace.
 * This establishes the isolated environment for their documents.
 */
export async function createFirstWorkspace(userId: string, email: string, name: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create or ensure Profile exists
    const profile = await tx.profile.upsert({
      where: { id: userId },
      update: { email: email, fullName: name },
      create: { 
        id: userId,
        email: email,
        fullName: name,
      },
    });

    // 2. Create the first Default Workspace
    const workspace = await tx.workspace.create({
      data: {
        name: "My First Workspace",
        slug: `workspace-${userId.slice(0, 5)}`, // Logic to ensure uniqueness
        members: {
          create: {
            profileId: profile.id,
            role: "ADMIN",
          },
        },
      },
    });

    return { profile, workspace };
  });
}
