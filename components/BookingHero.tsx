import Image from "next/image";
import { Badge, Container } from "./ui";
import { BLUR_DATA_URL } from "@/media";
import { siteMedia } from "@/media/site";

export function BookingHero() {
  return (
    <section className="booking-hero-premium">
      <Image src={siteMedia.destination.sea} alt="" fill quality={95} priority fetchPriority="high" placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" />
      <div className="booking-hero-premium__overlay" />
      <Container className="booking-hero-premium__content">
        <Badge light>Réservation directe</Badge>
        <h1>Imaginons votre séjour.</h1>
        <p>Choisissez votre maison, vos dates et les attentions qui rendront cette parenthèse vraiment personnelle.</p>
      </Container>
    </section>
  );
}
