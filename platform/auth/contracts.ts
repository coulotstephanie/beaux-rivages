export const staffRoles = ["admin", "editor", "concierge", "read_only"] as const;

export type StaffRole = (typeof staffRoles)[number];

export type StaffIdentity = {
  userId: string;
  email: string | null;
  role: StaffRole;
  authentication: "supabase";
};

export const staffRolePriority: Record<StaffRole, number> = {
  admin: 1,
  editor: 2,
  concierge: 3,
  read_only: 4,
};

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === "string" && staffRoles.includes(value as StaffRole);
}
