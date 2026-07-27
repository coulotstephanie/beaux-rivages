import type { ContentChange, ContentSnapshot } from "@/platform/content/contracts";
import type { ContentRepository } from "@/platform/content/repository";

export type AdminActor = { id: string; roles: ("editor" | "publisher" | "administrator")[] };
export interface AdminAuthorizer {
  require(actor: AdminActor, permission: "content:read" | "content:write" | "content:publish"): Promise<void>;
}

export class ContentAdminService {
  constructor(private readonly repository: ContentRepository, private readonly authorizer: AdminAuthorizer) {}
  async read(actor: AdminActor) {
    await this.authorizer.require(actor, "content:read");
    return this.repository.read();
  }
  async apply(actor: AdminActor, changes: ContentChange[]): Promise<ContentSnapshot> {
    await this.authorizer.require(actor, "content:write");
    if (changes.some((change) => change.operation === "delete") && !actor.roles.includes("administrator")) {
      throw new Error("Only an administrator can delete managed content.");
    }
    return this.repository.apply(changes);
  }
}
