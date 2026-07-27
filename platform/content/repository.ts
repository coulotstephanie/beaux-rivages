import type { ContentChange, ContentSnapshot } from "./contracts";

export interface ContentRepository {
  read(): Promise<ContentSnapshot>;
  apply(changes: ContentChange[]): Promise<ContentSnapshot>;
}

export class ReadOnlyContentRepository implements ContentRepository {
  constructor(private readonly snapshot: ContentSnapshot) {}
  async read() { return structuredClone(this.snapshot); }
  async apply(): Promise<ContentSnapshot> {
    throw new Error("Content repository is read-only. Configure an authenticated writable adapter.");
  }
}
