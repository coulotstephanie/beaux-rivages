import {
  PlatformAvailabilityRepository,
  PlatformReservationPricingRepository,
} from "../repositories";
import { ReservationEngineService } from "./reservation-engine.service";

export * from "./reservation-engine.service";

export const reservationEngine = new ReservationEngineService(
  new PlatformAvailabilityRepository(),
  new PlatformReservationPricingRepository(),
);
