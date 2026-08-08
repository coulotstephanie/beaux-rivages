import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProperty } from "@/data";
import {
  visualContentFromProperty,
  type PropertyEditorDocument,
} from "@/platform/property-editor/contracts";
import { PropertyVisualEditorAdmin } from "./PropertyVisualEditorAdmin";

const content = visualContentFromProperty(getProperty("villa-raie-manta"));
const document: PropertyEditorDocument = {
  slug: "villa-raie-manta",
  draft: content,
  published: content,
  hasUnpublishedChanges: false,
};
const response = (body: unknown, ok = true) => ({ ok, json: async () => body }) as Response;

describe("PropertyVisualEditorAdmin", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("supports undo, draft, discard and publication with distinct API actions", async () => {
    const requests: Array<{ method: string; body?: string }> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        requests.push({ method, body: init?.body as string | undefined });
        return response(method === "GET" ? document : { document });
      }),
    );
    render(<PropertyVisualEditorAdmin token="session" notify={vi.fn()} />);
    await screen.findAllByText("À jour");

    fireEvent(
      window,
      new MessageEvent("message", {
        origin: window.location.origin,
        data: { type: "property-preview-change", field: "title", value: "Titre temporaire" },
      }),
    );
    expect(await screen.findByText("Modifications non enregistrées")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(await screen.findByText("À jour")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Enregistrer le brouillon" }));
    await waitFor(() => expect(requests.filter((item) => item.method === "POST")).toHaveLength(1));
    fireEvent.click(screen.getByRole("button", { name: "Abandonner les changements" }));
    await waitFor(() => expect(requests.filter((item) => item.method === "POST")).toHaveLength(2));
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer et publier" }));
    await waitFor(() => expect(requests.filter((item) => item.method === "POST")).toHaveLength(3));
    const actions = requests
      .filter((item) => item.method === "POST")
      .map((item) => JSON.parse(item.body ?? "{}").action);
    expect(actions).toEqual(["save-draft", "discard", "publish"]);
  });

  it("adds a library photo to an editorial mosaic and forwards it to the preview", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        response(url.includes("/cms/media") ? { assets: [] } : document),
      ),
    );
    render(<PropertyVisualEditorAdmin token="session" notify={vi.fn()} />);
    await screen.findAllByText("À jour");
    const iframe = screen.getByTitle("Aperçu de Villa Raie Manta") as HTMLIFrameElement;
    const postMessage = vi.spyOn(iframe.contentWindow!, "postMessage");

    fireEvent(
      window,
      new MessageEvent("message", {
        origin: window.location.origin,
        data: {
          type: "property-preview-add-media",
          field: "editorial.0",
          fields: ["editorial.0.0", "editorial.0.1"],
        },
      }),
    );
    fireEvent.click(await screen.findByRole("button", { name: /La Villa en famille/ }));

    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "property-preview-content",
          content: expect.objectContaining({
            visualMediaOrder: expect.objectContaining({
              "editorial.0": expect.arrayContaining(["editorial.0.0", "editorial.0.1"]),
            }),
          }),
        }),
        window.location.origin,
      ),
    );
    expect(screen.getByText("Modifications non enregistrées")).toBeInTheDocument();
  });

  it("forwards a reordered mosaic immediately to the preview", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => response(document)),
    );
    render(<PropertyVisualEditorAdmin token="session" notify={vi.fn()} />);
    await screen.findAllByText("À jour");
    const iframe = screen.getByTitle("Aperçu de Villa Raie Manta") as HTMLIFrameElement;
    const postMessage = vi.spyOn(iframe.contentWindow!, "postMessage");

    fireEvent(
      window,
      new MessageEvent("message", {
        origin: window.location.origin,
        data: {
          type: "property-preview-reorder",
          field: "editorial.0.1",
          fields: ["editorial.0.0", "editorial.0.1"],
          direction: "previous",
        },
      }),
    );

    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "property-preview-content",
          content: expect.objectContaining({
            visualMediaOrder: expect.objectContaining({
              "editorial.0": ["editorial.0.1", "editorial.0.0"],
            }),
          }),
        }),
        window.location.origin,
      ),
    );
  });
});
