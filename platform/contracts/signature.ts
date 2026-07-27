export type ContractSignatory = { name: string; email: string; role: "traveler" | "owner" };
export interface ElectronicSignatureProvider {
  createEnvelope(input: {
    reservationId: string;
    pdf: Uint8Array;
    signatories: ContractSignatory[];
  }): Promise<{ envelopeId: string; status: "draft" | "sent"; signingUrls?: string[] }>;
  getStatus(envelopeId: string): Promise<"draft" | "sent" | "viewed" | "signed" | "declined" | "expired">;
  downloadSignedDocument(envelopeId: string): Promise<Uint8Array>;
}

export interface WelcomeBookGenerator {
  generate(input: {
    reservationId: string;
    generatedAt: string;
    weather?: unknown;
    tides?: unknown;
  }): Promise<Uint8Array>;
}
