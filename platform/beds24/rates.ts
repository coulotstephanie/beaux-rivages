import type {
  Beds24AirbnbCalendarRange,
  Beds24AirbnbPreparedRate,
  Beds24CalendarRange,
  Beds24PreparedRate,
  Beds24SourceRate,
} from "./contracts";

export const BOOKING_PRICE1_FLOOR = 120;
export const AIRBNB_PRICE2_FLOOR = 100;
export const NID_CLEANING_FEE = 75;

export const NID_BEDS24 = {
  propertySlug: "nid-d-ete",
  propertyId: 346624,
  roomId: 715617,
  dailyPriceNumber: 1,
  dailyPriceName: "Booking Genius",
  booking: { dailyPriceNumber: 1, field: "price1", floor: BOOKING_PRICE1_FLOOR },
  airbnb: { dailyPriceNumber: 2, field: "price2", floor: AIRBNB_PRICE2_FLOOR },
  expectedSourceCount: 487,
  authorizedPeriod: { start: "2026-09-01", end: "2027-12-31" },
  promotionSuspension: { start: "2027-07-17", end: "2027-08-15" },
} as const;

export function prepareBeds24Rate(rate: Beds24SourceRate): Beds24PreparedRate {
  const suspended =
    rate.date >= NID_BEDS24.promotionSuspension.start &&
    rate.date <= NID_BEDS24.promotionSuspension.end;
  const cleaningPerNight = NID_CLEANING_FEE / rate.minimumNights;
  const nightlyWithoutCleaning = rate.nightlyRate - cleaningPerNight;
  const calculatedBeds24Price = Math.ceil(
    suspended ? nightlyWithoutCleaning : nightlyWithoutCleaning / 0.81,
  );
  const beds24Price = Math.max(BOOKING_PRICE1_FLOOR, calculatedBeds24Price);
  const stayTarget = rate.nightlyRate * rate.minimumNights;
  const stayTotalAfterDiscountAndCleaning =
    Math.round(
      (beds24Price * (suspended ? 1 : 0.81) * rate.minimumNights + NID_CLEANING_FEE) *
        100,
    ) / 100;
  return {
    ...rate,
    beds24Price,
    calculatedBeds24Price,
    priceFloorApplied: beds24Price !== calculatedBeds24Price,
    cleaningPerNight: Math.round(cleaningPerNight * 100) / 100,
    stayTarget,
    stayTotalAfterDiscountAndCleaning,
    stayDifference: Math.round((stayTotalAfterDiscountAndCleaning - stayTarget) * 100) / 100,
    promotionCompensation: suspended ? "suspended" : "genius_mobile",
  };
}

export function prepareAirbnbBeds24Rate(rate: Beds24SourceRate): Beds24AirbnbPreparedRate {
  const cleaningPerNight = NID_CLEANING_FEE / rate.minimumNights;
  const calculatedPrice2 = Math.ceil(
    (rate.nightlyRate * rate.minimumNights - NID_CLEANING_FEE) / rate.minimumNights,
  );
  const price2 = Math.max(AIRBNB_PRICE2_FLOOR, calculatedPrice2);
  const stayTarget = rate.nightlyRate * rate.minimumNights;
  const stayTotalWithCleaning = price2 * rate.minimumNights + NID_CLEANING_FEE;
  return {
    ...rate,
    price2,
    calculatedPrice2,
    priceFloorApplied: price2 !== calculatedPrice2,
    cleaningPerNight: Math.round(cleaningPerNight * 100) / 100,
    stayTarget,
    stayTotalWithCleaning,
    stayDifference: stayTotalWithCleaning - stayTarget,
  };
}

const followingDay = (date: string) => {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
};

export function collapseCalendarRanges(rates: Beds24PreparedRate[]): Beds24CalendarRange[] {
  const ranges: Beds24CalendarRange[] = [];
  for (const rate of rates) {
    const previous = ranges.at(-1);
    if (
      previous &&
      followingDay(previous.to) === rate.date &&
      previous.price1 === rate.beds24Price &&
      previous.minStay === rate.minimumNights
    ) {
      previous.to = rate.date;
    } else {
      ranges.push({
        from: rate.date,
        to: rate.date,
        price1: rate.beds24Price,
        minStay: rate.minimumNights,
      });
    }
  }
  return ranges;
}

export function collapseAirbnbCalendarRanges(
  rates: Beds24AirbnbPreparedRate[],
): Beds24AirbnbCalendarRange[] {
  const ranges: Beds24AirbnbCalendarRange[] = [];
  for (const rate of rates) {
    const previous = ranges.at(-1);
    if (
      previous &&
      followingDay(previous.to) === rate.date &&
      previous.price2 === rate.price2
    ) {
      previous.to = rate.date;
    } else {
      ranges.push({
        from: rate.date,
        to: rate.date,
        price2: rate.price2,
      });
    }
  }
  return ranges;
}

export function splitBatches<T>(values: T[], size = 50) {
  if (!Number.isInteger(size) || size < 1) throw new Error("BEDS24_BATCH_SIZE_INVALID");
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) =>
    values.slice(index * size, (index + 1) * size),
  );
}
