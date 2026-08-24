"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PremiumUX() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.classList.remove("is-navigating");
  }, [pathname]);

  useEffect(() => {
    const revealTargets = [
      ...document.querySelectorAll<HTMLElement>(
        "main > section:not(.page-hero):not(.premium-hero):not(.premium-property-hero):not(.premium-experience-collection), .ui-heading, .property-connections a, .destination-guide__addresses article",
      ),
    ];
    revealTargets.forEach((element) => element.classList.add("ux-reveal"));
    document.body.classList.add("ux-enhanced");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        // A percentage threshold prevents very tall editorial sections from
        // ever becoming visible: the viewport can be smaller than 8% of the
        // section. Reveal as soon as any part enters the viewport instead.
        threshold: 0,
      },
    );
    revealTargets.forEach((element) => revealObserver.observe(element));

    const prepareImage = (image: HTMLImageElement) => {
      const parent = image.parentElement;
      if (!parent || parent.classList.contains("ux-image-shell")) return;
      parent.classList.add("ux-image-shell");
      const ready = () => parent.classList.add("is-ready");
      if (image.complete) ready();
      else image.addEventListener("load", ready, { once: true });
    };
    document.querySelectorAll<HTMLImageElement>("main img").forEach(prepareImage);
    const imageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) =>
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node instanceof HTMLImageElement) prepareImage(node);
          node.querySelectorAll<HTMLImageElement>("img").forEach(prepareImage);
        }),
      );
    });
    const main = document.querySelector("main");
    if (main) imageObserver.observe(main, { childList: true, subtree: true });

    let ticking = false;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onLinkClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey)
        return;
      const target = new URL(link.href, window.location.href);
      if (
        target.origin !== window.location.origin ||
        target.pathname === window.location.pathname ||
        link.target === "_blank"
      )
        return;
      document.body.classList.add("is-navigating");
      window.setTimeout(() => document.body.classList.remove("is-navigating"), 900);
    };
    document.addEventListener("click", onLinkClick);

    return () => {
      revealObserver.disconnect();
      imageObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onLinkClick);
      document.body.classList.remove("ux-enhanced", "is-navigating");
    };
  }, [pathname]);

  return (
    <div className="reading-progress" aria-hidden="true">
      <span ref={progressRef} />
    </div>
  );
}
