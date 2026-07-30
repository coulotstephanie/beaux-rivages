"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supportedLocales, type SupportedLocale } from "@/i18n/config";
import { loadTranslations, type TranslationCatalog } from "@/i18n/translations";

const localePrefixes = new RegExp(
  `^/(${supportedLocales.filter((locale) => locale !== "fr").join("|")})(?=/|$)`,
);
const translatableAttributes = ["aria-label", "alt", "placeholder", "title"] as const;

function localeFromPath(pathname: string): SupportedLocale {
  const match = pathname.match(localePrefixes);
  return (match?.[1] as SupportedLocale) ?? "fr";
}

function localizeHref(href: string, locale: SupportedLocale) {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/api/") ||
    href.startsWith("/administration")
  )
    return href;
  const unprefixed = href.replace(localePrefixes, "") || "/";
  return locale === "fr" ? unprefixed : `/${locale}${unprefixed === "/" ? "" : unprefixed}`;
}

function translateValue(value: string, catalog: TranslationCatalog) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const normalized = value.trim();
  return normalized ? `${leading}${catalog[normalized] ?? normalized}${trailing}` : value;
}

function translateTree(root: ParentNode, locale: SupportedLocale, catalog: TranslationCatalog) {
  const elements =
    root instanceof HTMLElement
      ? [root, ...root.querySelectorAll<HTMLElement>("*")]
      : [...root.querySelectorAll<HTMLElement>("*")];
  elements.forEach((element) => {
    if (
      element.closest("[data-no-translate], .admin-dashboard-page") ||
      ["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)
    )
      return;
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const translated = translateValue(node.textContent, catalog);
        if (translated !== node.textContent) node.textContent = translated;
      }
    });
    translatableAttributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) {
        const translated = translateValue(value, catalog);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    });
    if (element instanceof HTMLAnchorElement) {
      const href = element.getAttribute("href") ?? "";
      const localized = localizeHref(href, locale);
      if (localized !== href) element.setAttribute("href", localized);
    }
  });
}

function localizeHead(pathname: string, locale: SupportedLocale, catalog: TranslationCatalog) {
  document.title = translateValue(document.title, catalog);
  document
    .querySelectorAll<HTMLMetaElement>(
      'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]',
    )
    .forEach((meta) => {
      meta.content = translateValue(meta.content, catalog);
    });

  const basePath = pathname.replace(localePrefixes, "") || "/";
  supportedLocales.forEach((candidate) => {
    const hreflang = candidate === "fr" ? "fr" : candidate;
    const href = `https://www.beaux-rivages.com${candidate === "fr" ? "" : `/${candidate}`}${basePath === "/" ? "" : basePath}`;
    let alternate = document.head.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${hreflang}"]`,
    );
    if (!alternate) {
      alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = hreflang;
      document.head.appendChild(alternate);
    }
    alternate.href = href;
  });
}

export function LanguageExperience() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);

  useEffect(() => {
    if (pathname.startsWith("/administration")) return;
    document.documentElement.lang = locale;
    if (locale === "fr") {
      localizeHead(pathname, locale, {});
      return;
    }

    let observer: MutationObserver | undefined;
    let cancelled = false;
    void loadTranslations(locale).then((catalog) => {
      if (cancelled) return;
      localizeHead(pathname, locale, catalog);
      translateTree(document.body, locale, catalog);
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) =>
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) translateTree(node, locale, catalog);
            else if (node.nodeType === Node.TEXT_NODE && node.parentElement)
              translateTree(node.parentElement, locale, catalog);
          }),
        );
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [locale, pathname]);

  return null;
}
