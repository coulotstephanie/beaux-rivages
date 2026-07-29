import { isDateRangeAvailable } from "@/lib/date-ranges";
import type { ReservationSearchRequest, ReservationSearchResult } from "../types";
import type {
  AvailabilityRepository,
  ReservationPricingRepository,
  ReservationQuote,
} from "../repositories";

export class ReservationEngineService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly pricingRepository: ReservationPricingRepository,
  ) {}

  async search(
    request: ReservationSearchRequest,
  ): Promise<ReservationSearchResult<ReservationQuote>> {
    const [availability, quote] = await Promise.all([
      this.availabilityRepository.get(request.propertySlug),
      this.pricingRepository.quote(request),
    ]);

    return {
      available: isDateRangeAvailable(availability.blocks, request.arrival, request.departure),
      sourcesHealthy: availability.sourcesHealthy,
      quote,
    };
  }
}
