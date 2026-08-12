import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import React, { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Header } from "../components/Header";
import { getProperty } from "../data";
import { PropertyPage } from "../components/PropertyPage";
import type { SupportedLocale } from "../i18n/config";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  PathnameContext,
  SearchParamsContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime";

const locales: SupportedLocale[] = ["fr", "en", "de", "es", "nl"];
(globalThis as typeof globalThis & { React: typeof React }).React = React;
const router: AppRouterInstance = {
  back() {},
  forward() {},
  refresh() {},
  push() {},
  replace() {},
  prefetch() {},
};

function withRouter(element: React.ReactElement) {
  return createElement(
    AppRouterContext.Provider,
    { value: router },
    createElement(
      PathnameContext.Provider,
      { value: "/" },
      createElement(SearchParamsContext.Provider, { value: new URLSearchParams() }, element),
    ),
  );
}

async function expectCleanHydration(element: React.ReactElement, label: string) {
  const tree = withRouter(element);
  const html = renderToString(tree);
  const dom = new JSDOM(`<div id="root">${html}</div>`, { url: "https://www.beaux-rivages.com/" });
  const previous = {
    window: globalThis.window,
    self: globalThis.self,
    document: globalThis.document,
    HTMLElement: globalThis.HTMLElement,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
  };
  Object.assign(globalThis, {
    window: dom.window,
    self: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const errors: string[] = [];
  const previousError = console.error;
  console.error = (...args: unknown[]) => errors.push(args.map(String).join(" "));
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(dom.window.document.querySelector("#root")!, tree);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const hydrationErrors = errors.filter((error) =>
      /hydration|did not match|server rendered html|hydrated but/i.test(error),
    );
    assert.deepEqual(hydrationErrors, [], `${label}: ${hydrationErrors.join("\n")}`);
  } finally {
    await act(async () => root?.unmount());
    console.error = previousError;
    Object.assign(globalThis, previous);
    delete (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT;
    dom.window.close();
  }
}

for (const locale of locales) {
  test(`Header s’hydrate sans divergence en ${locale}`, async () => {
    await expectCleanHydration(createElement(Header, { locale }), `header ${locale}`);
  });
}

for (const slug of ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"] as const) {
  test(`${slug} s’hydrate sans divergence en anglais`, async () => {
    await expectCleanHydration(
      createElement(PropertyPage, { property: getProperty(slug), locale: "en" }),
      slug,
    );
  });
}
