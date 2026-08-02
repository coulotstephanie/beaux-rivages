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

    const available = isDateRangeAvailable(availability.blocks, request.arrival, request.departure);
    const fillsCalendarGap =
      quote.stayRules.optimizeCalendarGaps &&
      available &&
      availability.blocks.some((block) => block.endsOn === request.arrival) &&
      availability.blocks.some((block) => block.startsOn === request.departure);
    const quoteWithOptimizedGap = fillsCalendarGap
      ? {
          ...quote,
          stayRules: {
            ...quote.stayRules,
            valid:
              quote.stayRules.arrivalIsAllowed &&
              quote.nights >= 1 &&
              quote.nights <= quote.stayRules.maximumNights,
            requiredMinimum: 1,
            gapOptimized: true,
          },
        }
      : { ...quote, stayRules: { ...quote.stayRules, gapOptimized: false } };

    return {
      available,
      sourcesHealthy: availability.sourcesHealthy,
      quote: quoteWithOptimizedGap,
    };
  }
}
