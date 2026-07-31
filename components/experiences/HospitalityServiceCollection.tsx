"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { HospitalityService } from "@/hospitalityServices";

const serviceHref = (service: HospitalityService) =>
  service.slug === "essentiel" ? "/experiences#essentiel" : `/${service.slug}`;

export function HospitalityServiceCollection({ services }: { services: HospitalityService[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <section
      className="hospitality-services shell"
      aria-label="Expériences et services Beaux Rivages"
    >
      {services.map((service, index) => (
        <motion.article
          id={service.slug}
          className={`hospitality-service-card hospitality-service-card--${service.action}`}
          key={service.slug}
          initial={reducedMotion ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.55, delay: index * 0.04 }}
        >
          <Link
            className="hospitality-service-card__media"
            href={serviceHref(service)}
            aria-label={`Découvrir ${service.title}`}
          >
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              quality={88}
              loading="lazy"
              sizes="(max-width: 850px) 100vw, 48vw"
            />
          </Link>
          <div className="hospitality-service-card__copy">
            <span className="hospitality-service-card__icon" aria-hidden="true">
              {service.icon}
            </span>
            <p className="hospitality-service-card__badge">{service.badge}</p>
            <h2>{service.title}</h2>
            <p>{service.intro}</p>
            <ul>
              {service.sections
                .flatMap((section) => section.items)
                .slice(0, 5)
                .map((item) => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
            <Link href={serviceHref(service)}>
              {service.action === "quote"
                ? "Imaginer cette expérience"
                : service.action === "booking"
                  ? "Découvrir et ajouter"
                  : "Découvrir ce qui est inclus"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.article>
      ))}
    </section>
  );
}
