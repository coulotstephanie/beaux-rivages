export const guestBookHouses = ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"] as const;
export const guestBookLanguages = ["fr", "en", "de", "es", "nl", "other"] as const;
export const guestBookStatuses = [
  "photo_received",
  "ocr_review",
  "validated",
  "published",
] as const;

export type GuestBookHouse = (typeof guestBookHouses)[number];
export type GuestBookLanguage = (typeof guestBookLanguages)[number];
export type GuestBookStatus = (typeof guestBookStatuses)[number];

export type GuestBookEntry = {
  id: string;
  house: GuestBookHouse;
  date: string;
  language: GuestBookLanguage;
  author: string;
  text: string;
  featured: boolean;
  tags: string[];
  image: string | null;
  status: GuestBookStatus;
  createdAt: string;
  updatedAt: string;
};

export type GuestBookFilters = {
  search?: string;
  house?: GuestBookHouse | "all";
  language?: GuestBookLanguage | "all";
  year?: string;
  tag?: string;
};

export type GuestBookStats = {
  total: number;
  languages: { value: GuestBookLanguage; count: number }[];
  themes: { value: string; count: number }[];
  words: { value: string; count: number }[];
};
