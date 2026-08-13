import type { Beds24AirbnbCalendarRange } from "./contracts";
import { NID_BEDS24 } from "./rates";

const AIRBNB_RANGE_KEYS = ["from", "price2", "to"];

export function assertAirbnbPrice2Payload(
  roomId: number,
  ranges: Beds24AirbnbCalendarRange[],
) {
  if (roomId !== NID_BEDS24.roomId) throw new Error("BEDS24_AIRBNB_ROOM_FORBIDDEN");
  if (!Array.isArray(ranges) || ranges.length === 0)
    throw new Error("BEDS24_AIRBNB_PAYLOAD_EMPTY");
  for (const range of ranges) {
    if (Object.keys(range).sort().join(",") !== AIRBNB_RANGE_KEYS.join(","))
      throw new Error("BEDS24_AIRBNB_FIELD_FORBIDDEN");
    if (
      range.from < NID_BEDS24.authorizedPeriod.start ||
      range.to > NID_BEDS24.authorizedPeriod.end ||
      range.from > range.to
    ) throw new Error("BEDS24_AIRBNB_DATE_FORBIDDEN");
    if (!Number.isInteger(range.price2) || range.price2 < NID_BEDS24.airbnb.floor)
      throw new Error("BEDS24_AIRBNB_PRICE_INVALID");
  }
}
