import { prisma } from "./prisma";

export type Role = "ADMIN" | "ANALYST" | "VIEWER";

export const PERMISSIONS = {
  DOCUMENTS_UPLOAD: ["ADMIN", "ANALYST"],
  DOCUMENTS_DELETE: ["ADMIN"],
  CHATS_CREATE: ["ADMIN", "ANALYST"],
  SETTINGS_VIEW: ["ADMIN"],
  WORKSPACE_MANAGE: ["ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export async function getWorkspaceRole(profileId: string, workspaceId: string): Promise<Role | null> {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_profileId: {
        workspaceId,
        profileId,
      },
    },
  });

  return (membership?.role as Role) || null;
}

export async function hasPermission(
  profileId: string,
  workspaceId: string,
  permission: Permission
): Promise<boolean> {
  const role = await getWorkspaceRole(profileId, workspaceId);
  if (!role) return false;

  const allowedRoles = PERMISSIONS[permission] as readonly string[];
  return allowedRoles.includes(role);
}
