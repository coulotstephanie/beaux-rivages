import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PropertyVisualPreview } from "./PropertyVisualPreview";

vi.mock("@/components/PropertyPage", () => ({
  PropertyPage: ({ property }: { property: { title: string; intro: string; hero: string } }) => (
    <main>
      <section data-editor-field="hero" data-editor-kind="image">
        <img alt="hero" src={property.hero} />
      </section>
      <h1 data-editor-field="title">{property.title}</h1>
      <p data-editor-field="intro">{property.intro}</p>
    </main>
  ),
}));

describe("PropertyVisualPreview", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("edits a clicked title directly and reports the change", () => {
    const post = vi.spyOn(window, "postMessage");
    render(<PropertyVisualPreview slug="villa-raie-manta" />);
    fireEvent(
      window,
      new MessageEvent("message", {
        origin: window.location.origin,
        data: { type: "property-preview-editing", editing: true },
      }),
    );
    const title = screen.getByRole("heading", { level: 1 });
    fireEvent.click(title);
    title.innerText = "Nouveau titre";
    fireEvent.blur(title);
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "property-preview-change",
        field: "title",
        value: "Nouveau titre",
      }),
      window.location.origin,
    );
  });

  it("opens the media chooser when the hero is clicked", () => {
    const post = vi.spyOn(window, "postMessage");
    render(<PropertyVisualPreview slug="nid-d-ete" />);
    fireEvent(
      window,
      new MessageEvent("message", {
        origin: window.location.origin,
        data: { type: "property-preview-editing", editing: true },
      }),
    );
    fireEvent.click(screen.getByAltText("hero"));
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({ type: "property-preview-media", field: "hero" }),
      window.location.origin,
    );
  });
});
