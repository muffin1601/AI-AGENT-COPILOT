import { prisma } from "@/lib/prisma";

export async function logEvent(
  workspaceId: string,
  profileId: string,
  action: string,
  details?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        workspaceId,
        profileId,
        action,
        details: details || {},
      },
    });
  } catch (err) {
    console.error("Critical: Failed to persist audit log:", err);
    // In production, we might want to log this to an external failover service
  }
}
