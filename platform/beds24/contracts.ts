export type Beds24SourceRate = {
  date: string;
  nightlyRate: number;
  minimumNights: number;
};

export type Beds24PreparedRate = Beds24SourceRate & {
  beds24Price: number;
  calculatedBeds24Price: number;
  priceFloorApplied: boolean;
  cleaningPerNight: number;
  stayTarget: number;
  stayTotalAfterDiscountAndCleaning: number;
  stayDifference: number;
  promotionCompensation: "genius_mobile" | "suspended";
};

export type Beds24AirbnbPreparedRate = Beds24SourceRate & {
  price2: number;
  calculatedPrice2: number;
  priceFloorApplied: boolean;
  cleaningPerNight: number;
  stayTarget: number;
  stayTotalWithCleaning: number;
  stayDifference: number;
};

export type Beds24RepricePreviewRow = Beds24PreparedRate & {
  currentBeds24Price: number | null;
  currentMinimumNights: number | null;
};

export type Beds24CalendarRange = {
  from: string;
  to: string;
  price1: number;
  minStay: number;
};

export type Beds24AirbnbCalendarRange = {
  from: string;
  to: string;
  price2: number;
};

export type Beds24AirbnbDifference = {
  date: string;
  expectedPrice2: number;
  actualPrice2: number | null;
};

export type Beds24AirbnbSyncReport = {
  mode: "preview" | "audit" | "write";
  propertySlug: "nid-d-ete";
  propertyId: 346624;
  roomId: 715617;
  field: "price2";
  sourceCount: number;
  start: "2026-09-01";
  end: "2027-12-31";
  rangeCount: number;
  theoreticalBatchCount: number;
  theoreticalBatches: Array<{
    number: number;
    rangeCount: number;
    start: string;
    end: string;
  }>;
  sentBatches: number;
  verified: boolean;
  comparison?: { absent: number; identical: number; different: number };
  differences: Beds24AirbnbDifference[];
  auditAvailable: boolean;
  errors: Array<{
    stage: "read" | "validation" | "write" | "verify";
    batch?: number;
    message: string;
  }>;
  sample: Beds24AirbnbPreparedRate[];
};

export type Beds24Difference = {
  date: string;
  expectedPrice: number;
  actualPrice: number | null;
  expectedMinimumNights: number;
  actualMinimumNights: number | null;
};

export type Beds24SyncReport = {
  mode: "preview" | "reprice-preview" | "audit" | "write";
  propertySlug: "nid-d-ete";
  propertyId: 346624;
  roomId: 715617;
  dailyPriceNumber: 1;
  dailyPriceName: "Booking Genius";
  sourceCount: number;
  start: string;
  end: string;
  compensatedCount: number;
  suspendedCount: number;
  rangeCount: number;
  batchCount: number;
  writtenBatches: number;
  verified: boolean;
  comparison?: {
    creations: number;
    modifications: number;
    identical: number;
    highlighted: Beds24Difference[];
  };
  channelAssociation?: {
    priceRuleFound: boolean;
    name: string | null;
    bookingEnabled: boolean | null;
    airbnbEnabled: boolean | null;
    onlyBookingEnabled: boolean | null;
  };
  details?: Beds24RepricePreviewRow[];
  differences: Beds24Difference[];
  errors: Array<{ stage: "source" | "write" | "verify" | "channel"; batch?: number; message: string }>;
  sample: Beds24PreparedRate[];
};
