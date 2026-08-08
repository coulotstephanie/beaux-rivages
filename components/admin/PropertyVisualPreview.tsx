"use client";

import { useEffect, useRef, useState } from "react";
import { getProperty } from "@/data";
import { PropertyPage } from "@/components/PropertyPage";
import {
  applyVisualContent,
  visualContentFromProperty,
  type EditablePropertySlug,
  type PropertyVisualContent,
} from "@/platform/property-editor/contracts";

export function PropertyVisualPreview({ slug }: { slug: EditablePropertySlug }) {
  const [content, setContent] = useState(() => visualContentFromProperty(getProperty(slug)));
  const [editing, setEditing] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const receive = (event: MessageEvent<{ type?: string; content?: PropertyVisualContent }>) => {
      if (
        event.origin === window.location.origin &&
        event.data.type === "property-preview-content" &&
        event.data.content
      )
        setContent(event.data.content);
      if (event.origin === window.location.origin && event.data.type === "property-preview-editing")
        setEditing(Boolean((event.data as { editing?: boolean }).editing));
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "property-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>("[data-editor-media-field]").forEach((item) => {
      item.draggable = editing;
      item.setAttribute("aria-grabbed", "false");
    });
  }, [content, editing]);
  const click = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!editing) return;
    const addMedia = (event.target as HTMLElement).closest<HTMLElement>("[data-editor-add-media]");
    if (addMedia) {
      event.preventDefault();
      event.stopPropagation();
      const mosaic = addMedia.parentElement;
      const fields = mosaic
        ? [...mosaic.querySelectorAll<HTMLElement>("[data-editor-media-field]")]
            .map((node) => node.dataset.editorMediaField)
            .filter((field): field is string => !!field)
        : [];
      window.parent.postMessage(
        { type: "property-preview-add-media", field: addMedia.dataset.editorAddMedia, fields },
        window.location.origin,
      );
      return;
    }
    const removeMedia = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-editor-remove-media]",
    );
    if (removeMedia) {
      event.preventDefault();
      event.stopPropagation();
      window.parent.postMessage(
        { type: "property-preview-remove-media", field: removeMedia.dataset.editorRemoveMedia },
        window.location.origin,
      );
      return;
    }
    const reorder = (event.target as HTMLElement).closest<HTMLElement>("[data-editor-reorder]");
    if (reorder) {
      event.preventDefault();
      event.stopPropagation();
      const item = reorder.closest<HTMLElement>("[data-editor-media-field]");
      const mosaic = item?.parentElement;
      const fields = mosaic
        ? [...mosaic.querySelectorAll<HTMLElement>("[data-editor-media-field]")]
            .map((node) => node.dataset.editorMediaField)
            .filter((field): field is string => !!field)
        : [];
      const field = item?.dataset.editorMediaField;
      if (field)
        window.parent.postMessage(
          {
            type: "property-preview-reorder",
            field,
            fields,
            direction: reorder.dataset.editorReorder,
          },
          window.location.origin,
        );
      return;
    }
    const editorialText = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-editor-text-field]",
    );
    if (editorialText) {
      event.preventDefault();
      event.stopPropagation();
      editorialText.contentEditable = "plaintext-only";
      editorialText.focus();
      const selection = window.getSelection();
      selection?.selectAllChildren(editorialText);
      selection?.collapseToEnd();
      const finish = () => {
        editorialText.contentEditable = "false";
        editorialText.removeEventListener("blur", finish);
        window.parent.postMessage(
          {
            type: "property-preview-text-change",
            field: editorialText.dataset.editorTextField,
            value: editorialText.innerText.trim(),
          },
          window.location.origin,
        );
      };
      editorialText.addEventListener("blur", finish);
      return;
    }
    const mediaTarget = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-editor-media-field]",
    );
    if (mediaTarget) {
      event.preventDefault();
      event.stopPropagation();
      window.parent.postMessage(
        { type: "property-preview-media", field: mediaTarget.dataset.editorMediaField },
        window.location.origin,
      );
      return;
    }
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-editor-field]");
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    const field = target.dataset.editorField as keyof PropertyVisualContent;
    if (target.dataset.editorKind === "image") {
      window.parent.postMessage({ type: "property-preview-media", field }, window.location.origin);
      return;
    }
    target.contentEditable = "plaintext-only";
    target.focus();
    const selection = window.getSelection();
    selection?.selectAllChildren(target);
    selection?.collapseToEnd();
    const finish = () => {
      target.contentEditable = "false";
      target.removeEventListener("blur", finish);
      window.parent.postMessage(
        { type: "property-preview-change", field, value: target.innerText.trim() },
        window.location.origin,
      );
    };
    target.addEventListener("blur", finish);
  };
  const dragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (!editing) return;
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-editor-media-field]");
    if (!item?.dataset.editorMediaField) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/x-property-media", item.dataset.editorMediaField);
    item.setAttribute("aria-grabbed", "true");
  };
  const dragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (editing && (event.target as HTMLElement).closest("[data-editor-media-field]")) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }
  };
  const drop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!editing) return;
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-editor-media-field]");
    const sourceField = event.dataTransfer.getData("text/x-property-media");
    const targetField = target?.dataset.editorMediaField;
    if (!sourceField || !targetField || sourceField === targetField) return;
    const mosaic = target.parentElement;
    const fields = mosaic
      ? [...mosaic.querySelectorAll<HTMLElement>("[data-editor-media-field]")]
          .map((node) => node.dataset.editorMediaField)
          .filter((field): field is string => !!field)
      : [];
    if (!fields.includes(sourceField) || !fields.includes(targetField)) return;
    event.preventDefault();
    const ordered = fields.filter((field) => field !== sourceField);
    ordered.splice(ordered.indexOf(targetField), 0, sourceField);
    const group = targetField.split(".").slice(0, 2).join(".");
    window.parent.postMessage(
      { type: "property-preview-order", field: group, fields: ordered },
      window.location.origin,
    );
  };
  const dragEnd = () =>
    root.current
      ?.querySelectorAll<HTMLElement>("[aria-grabbed='true']")
      .forEach((item) => item.setAttribute("aria-grabbed", "false"));
  return (
    <div
      ref={root}
      className={`property-visual-preview${editing ? " is-editing" : ""}`}
      onClickCapture={click}
      onDragStartCapture={dragStart}
      onDragOverCapture={dragOver}
      onDropCapture={drop}
      onDragEndCapture={dragEnd}
    >
      <PropertyPage property={applyVisualContent(getProperty(slug), content)} />
    </div>
  );
}
