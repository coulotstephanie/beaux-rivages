export type DocumentKind =
  | "quote"
  | "contract"
  | "deposit_invoice"
  | "balance_invoice"
  | "final_invoice"
  | "credit_note"
  | "receipt"
  | "payment_statement"
  | "certificate";
export type DocumentStatus =
  | "draft"
  | "issued"
  | "sent"
  | "viewed"
  | "signed"
  | "declined"
  | "expired"
  | "paid"
  | "void"
  | "archived";
export type DocumentCenterSnapshot = {
  generatedAt: string;
  metrics: { total: number; toSign: number; sent: number; signed: number; archived: number };
  documents: Array<{
    id: string;
    kind: DocumentKind;
    number: string;
    version: number;
    status: DocumentStatus;
    reservationId: string;
    reservationReference: string;
    propertyId: string;
    propertyName: string;
    guestId: string | null;
    guestName: string;
    amountCents: number | null;
    storagePath: string | null;
    issuedAt: string | null;
    createdAt: string;
    signatureStatus: string | null;
    deliveryStatus: string | null;
  }>;
  reservations: Array<{
    id: string;
    reference: string;
    propertyName: string;
    guestName: string;
    guestEmail: string;
  }>;
  templates: Array<{
    id: string;
    kind: DocumentKind;
    name: string;
    primaryColor: string;
    footerText: string;
    legalText: string;
    active: boolean;
  }>;
  settings: {
    legalName: string;
    address: string;
    phone: string;
    email: string;
    iban: string;
    bic: string;
    vatNumber: string;
    vatEnabled: boolean;
    logoPath: string;
    primaryColor: string;
    footerText: string;
    legalMentions: string;
    ownerSignaturePath: string;
  };
  audit: Array<{
    id: string;
    documentId: string | null;
    action: string;
    origin: string;
    details: Record<string, unknown>;
    createdAt: string;
  }>;
};
