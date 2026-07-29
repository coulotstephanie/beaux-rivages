export const staffRoles = ["admin", "concierge", "read_only"] as const;

export type StaffRole = (typeof staffRoles)[number];

export type StaffIdentity = {
  userId: string;
  email: string | null;
  role: StaffRole;
  authentication: "supabase" | "legacy-token";
};

export const staffRolePriority: Record<StaffRole, number> = {
  admin: 1,
  concierge: 2,
  read_only: 3,
};

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === "string" && staffRoles.includes(value as StaffRole);
}
