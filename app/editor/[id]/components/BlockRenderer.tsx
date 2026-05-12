"use client";

import React, { useEffect, useRef, useState } from "react";
import { Block, sampleBrand } from "./types";
import {
  GripVertical,
  Trash2,
  Copy,
  Plus,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEditorContext } from "./EditorContext";
import { BlockAddMenu } from "./BlockAddMenu";

interface BlockRendererProps {
  block: Block;
  index: number;
  isSelected: boolean;
  isPreview: boolean;
  onSelect: (id: string) => void;
  updateBlockContent: (id: string, updates: any) => void;
  deleteBlock: (id: string, e?: React.MouseEvent) => void;
  duplicateBlock: (id: string, e?: React.MouseEvent) => void;
  addBlockAbove: (id: string, type: string, e?: React.MouseEvent) => void;
  handleDragStart: (e: React.DragEvent, item: any) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  dropIndicator: number | null;
  onHeightMeasured?: (id: string, height: number) => void;
}

function getSplitFlex(split: string, side: "left" | "right"): number {
  const map: Record<string, [number, number]> = {
    "50/50": [1, 1],
    "60/40": [1.5, 1],
    "40/60": [1, 1.5],
    "70/30": [2.33, 1],
    "30/70": [1, 2.33],
  };
  const [l, r] = map[split] ?? [1, 1];
  return side === "left" ? l : r;
}

function TextBubbleMenu({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;
  return (
    <BubbleMenu
      editor={editor}
      className="flex bg-white shadow-xl border border-gray-100 rounded-lg p-1 gap-0.5 z-50"
    >
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`px-2 py-1 rounded-md text-sm font-bold hover:bg-gray-100 transition-colors ${editor.isActive("bold") ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
      >
        B
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`px-2 py-1 rounded-md text-sm italic hover:bg-gray-100 transition-colors ${editor.isActive("italic") ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
      >
        I
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`px-2 py-1 rounded-md text-sm underline hover:bg-gray-100 transition-colors ${editor.isActive("underline") ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
      >
        U
      </button>
      <div className="w-px bg-gray-200 h-5 mx-0.5 self-center" />
      {[
        { color: "#ef4444", bg: "bg-red-500" },
        { color: "#3b82f6", bg: "bg-blue-500" },
        { color: "#10b981", bg: "bg-emerald-500" },
        { color: "#f59e0b", bg: "bg-amber-400" },
        { color: "#1a1a1a", bg: "bg-gray-900" },
      ].map(({ color, bg }) => (
        <button
          key={color}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setColor(color).run();
          }}
          className={`w-5 h-5 rounded-full ${bg} self-center border border-white/50 hover:scale-110 transition-transform shadow-sm`}
        />
      ))}
    </BubbleMenu>
  );
}

export function BlockRenderer({
  block,
  index,
  isSelected,
  isPreview,
  onSelect,
  updateBlockContent,
  deleteBlock,
  duplicateBlock,
  addBlockAbove,
  handleDragStart,
  handleDragOver,
  handleDrop,
  dropIndicator,
  onHeightMeasured,
}: BlockRendererProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !onHeightMeasured) return;
    const el = wrapperRef.current;
    const obs = new ResizeObserver(() => {
      onHeightMeasured(block.id, el.offsetHeight);
    });
    obs.observe(el);
    onHeightMeasured(block.id, el.offsetHeight);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id]);

  const isEditableText = ["heading", "subheading", "paragraph", "blockquote"].includes(
    block.type,
  );

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: block.content.text || "",
    editable: !isPreview && isEditableText,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      updateBlockContent(block.id, { text: editor.getHTML() });
    },
  });

  useEffect(() => {
    if (editor && block.content.text !== editor.getHTML()) {
      if (document.activeElement?.closest(".ProseMirror") === editor.view.dom)
        return;
      editor.commands.setContent(block.content.text);
    }
  }, [block.content.text, editor]);

  const { registerEditor } = useEditorContext();

  useEffect(() => {
    if (isSelected && editor) {
      registerEditor(editor);
    } else if (!isSelected && editor) {
      // Optional: unregister when deselected if needed, 
      // but FormattingToolbar hides entirely if !selectedBlock
      // registerEditor(null);
    }
  }, [isSelected, editor, registerEditor]);

  let innerContent: React.ReactNode = null;

  switch (block.type) {
    case "heading":
    case "subheading":
    case "paragraph":
      innerContent = (
        <div
          style={{
            fontSize: `${block.style.fontSize}px`,
            fontWeight:
              block.style.fontWeight ??
              (block.type === "heading" ? 700 : block.type === "subheading" ? 600 : 400),
            color: block.style.color,
            textAlign: block.style.textAlign || "left",
            lineHeight: block.style.lineHeight || 1.5,
            margin: 0,
          }}
        >
          {editor && !isPreview && <TextBubbleMenu editor={editor} />}
          <EditorContent editor={editor} className="outline-none" />
        </div>
      );
      break;

    case "blockquote":
      innerContent = (
        <div
          style={{
            borderLeft: `4px solid ${block.style.borderColor || sampleBrand.secondaryColor}`,
            paddingLeft: "20px",
            margin: "0",
            fontStyle: block.style.fontStyle ?? "italic",
            fontSize: `${block.style.fontSize || 14}px`,
            color: block.style.color || "#555555",
            lineHeight: block.style.lineHeight || 1.7,
          }}
        >
          {editor && !isPreview && <TextBubbleMenu editor={editor} />}
          <EditorContent editor={editor} className="outline-none" />
        </div>
      );
      break;

    case "divider":
      innerContent = (
        <div
          style={{
            padding: `${block.style.marginTop ?? 8}px 0 ${block.style.marginBottom ?? 8}px 0`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width:
                block.style.width === "75%"
                  ? "75%"
                  : block.style.width === "50%"
                    ? "50%"
                    : "100%",
              borderBottom: `${block.style.thickness ?? 1}px ${block.style.style || "solid"} ${block.style.color || "#e5e5e5"}`,
            }}
          />
        </div>
      );
      break;

    case "spacer":
      innerContent = (
        <div
          style={{ height: `${block.style.height}px` }}
          className={
            !isPreview
              ? "flex items-center justify-center text-gray-300 text-xs font-medium select-none"
              : ""
          }
        >
          {!isPreview && `↕ ${block.style.height}px spacer`}
        </div>
      );
      break;

    case "two-columns":
      innerContent = (
        <div style={{ display: "flex", gap: `${block.style.gap ?? 24}px` }}>
          <div style={{ flex: getSplitFlex(block.style.split, "left") }}>
            {block.content.left?.heading && (
              <h3
                style={{ fontWeight: 600, marginBottom: "8px", color: "#1a1a1a", fontSize: "14px" }}
              >
                {block.content.left.heading}
              </h3>
            )}
            {block.content.left?.items?.length > 0 && (
              <ul className="list-disc pl-5" style={{ fontSize: "14px", color: "#444444" }}>
                {block.content.left.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {!block.content.left?.heading && !block.content.left?.items?.length && (
              <p className="text-gray-300 italic text-sm">Left column…</p>
            )}
          </div>
          <div style={{ flex: getSplitFlex(block.style.split, "right") }}>
            {block.content.right?.heading && (
              <h3
                style={{ fontWeight: 600, marginBottom: "8px", color: "#1a1a1a", fontSize: "14px" }}
              >
                {block.content.right.heading}
              </h3>
            )}
            {block.content.right?.items?.length > 0 && (
              <ul className="list-disc pl-5" style={{ fontSize: "14px", color: "#444444" }}>
                {block.content.right.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {!block.content.right?.heading && !block.content.right?.items?.length && (
              <p className="text-gray-300 italic text-sm">Right column…</p>
            )}
          </div>
        </div>
      );
      break;

    case "three-columns": {
      const cols = [
        { key: "col1", value: block.content.col1 || "" },
        { key: "col2", value: block.content.col2 || "" },
        { key: "col3", value: block.content.col3 || "" },
      ];
      innerContent = (
        <div style={{ display: "flex", gap: `${block.style.gap ?? 24}px` }}>
          {cols.map(({ key, value }, i) => (
            <div
              key={key}
              style={{
                flex: 1,
                fontSize: "14px",
                color: "#444444",
                lineHeight: 1.6,
                minHeight: "48px",
                outline: "none",
                borderBottom: !isPreview ? "1px dashed #e5e5e5" : "none",
                paddingBottom: "4px",
              }}
              contentEditable={!isPreview}
              suppressContentEditableWarning
              onBlur={(e) =>
                updateBlockContent(block.id, {
                  [key]: e.currentTarget.textContent || "",
                })
              }
              dangerouslySetInnerHTML={{
                __html: value || (!isPreview ? `<span style="color:#ccc">Column ${i + 1}…</span>` : ""),
              }}
            />
          ))}
        </div>
      );
      break;
    }

    case "table":
      innerContent = (
        <table
          className="w-full text-left border-collapse"
          style={{ 
            fontSize: "14px", 
            border: block.style.outerBorderColor && block.style.outerBorderColor !== "transparent" 
              ? `1px solid ${block.style.outerBorderColor}` 
              : "none"
          }}
        >
          <thead>
            <tr style={{ 
              backgroundColor: block.style.headerBg || "#f5f5f5",
              color: block.style.headerColor || "#1a1a1a"
            }}>
              {block.content.headers?.map((h: string, i: number) => (
                <th
                  key={i}
                  className="p-3 font-semibold"
                  style={{
                    borderBottom: block.style.borderColor && block.style.borderColor !== "transparent" 
                      ? `2px solid ${block.style.borderColor}`
                      : `1px solid ${block.style.headerBg === "transparent" ? "#e5e5e5" : "transparent"}`,
                    borderRight: block.style.borderColor && block.style.borderColor !== "transparent" && i < block.content.headers.length - 1
                      ? `1px solid ${block.style.borderColor}`
                      : "none",
                  }}
                  contentEditable={!isPreview}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newHeaders = [...block.content.headers];
                    newHeaders[i] = e.currentTarget.textContent || "";
                    updateBlockContent(block.id, { headers: newHeaders });
                  }}
                  dangerouslySetInnerHTML={{ __html: h }}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {block.content.rows?.map((row: string[], ri: number) => (
              <tr
                key={ri}
                style={{
                  backgroundColor: block.style.alternating && ri % 2 === 1 
                    ? (block.style.altRowBg || "#fafafa") 
                    : "transparent",
                  color: "#1a1a1a"
                }}
              >
                {row.map((cell: string, ci: number) => (
                  <td
                    key={ci}
                    className="p-3"
                    style={{
                      borderBottom: block.style.borderColor && block.style.borderColor !== "transparent" && ri < block.content.rows.length - 1
                        ? `1px solid ${block.style.borderColor}` 
                        : (ri < block.content.rows.length - 1 ? "1px solid #f0f0f0" : "none"),
                      borderRight: block.style.borderColor && block.style.borderColor !== "transparent" && ci < row.length - 1
                        ? `1px solid ${block.style.borderColor}`
                        : "none",
                      boxShadow: ci === 0 && block.style.accentLeft ? `inset 2px 0 0 0 ${block.style.accentLeft}` : "none",
                    }}
                    contentEditable={!isPreview}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newRows = block.content.rows.map(
                        (r: string[], rIdx: number) =>
                          rIdx === ri
                            ? r.map((c: string, cIdx: number) =>
                                cIdx === ci ? e.currentTarget.textContent || "" : c,
                              )
                            : r,
                      );
                      updateBlockContent(block.id, { rows: newRows });
                    }}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
            {block.content.totalsRow && (
              <tr>
                <td
                  colSpan={block.content.headers?.length || 1}
                  className="p-3 text-right font-semibold"
                  style={{
                    borderTop: block.style.borderColor && block.style.borderColor !== "transparent" 
                      ? `2px solid ${block.style.borderColor}` 
                      : "2px solid #e5e5e5",
                  }}
                >
                  {block.content.totalsRow}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
      break;

    case "bullet-list":
    case "numbered-list": {
      const isOrdered = block.type === "numbered-list";
      const ListTag = isOrdered ? "ol" : "ul";
      const items: string[] = block.content.items || [];

      innerContent = (
        <ListTag
          style={{
            listStyleType: isOrdered
              ? block.style.listStyleType || "decimal"
              : block.style.listStyleType || "disc",
            paddingLeft: "1.5rem",
            fontSize: `${block.style.fontSize || 14}px`,
            color: block.style.color || "#444444",
            lineHeight: block.style.lineHeight || 1.7,
          }}
        >
          {items.map((item: string, i: number) => (
            <li key={i} className="group/listitem py-0.5">
              <span className="flex items-start gap-1">
                <span
                  contentEditable={!isPreview}
                  suppressContentEditableWarning
                  style={{ flex: 1, outline: "none", minWidth: 0 }}
                  onBlur={(e) => {
                    const newItems = [...items];
                    newItems[i] = e.currentTarget.textContent || "";
                    updateBlockContent(block.id, { items: newItems });
                  }}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
                {!isPreview && (
                  <button
                    className="opacity-0 group-hover/listitem:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newItems = items.filter((_: string, idx: number) => idx !== i);
                      updateBlockContent(block.id, { items: newItems });
                    }}
                  >
                    <MinusCircle size={13} />
                  </button>
                )}
              </span>
            </li>
          ))}
          {!isPreview && (
            <li className="list-none -ml-4 mt-2">
              <button
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlockContent(block.id, { items: [...items, "New item"] });
                }}
              >
                <PlusCircle size={13} />
                Add item
              </button>
            </li>
          )}
        </ListTag>
      );
      break;
    }

    case "signature":
      innerContent = (
        <div style={{ marginTop: "24px", color: "#1a1a1a", fontSize: "14px" }}>
          <p style={{ color: "#666666" }}>{block.content.closing || "Sincerely,"}</p>
          {block.style.showLine ? (
            <div
              style={{
                marginTop: "44px",
                marginBottom: "8px",
                width: "220px",
                borderBottom:
                  block.style.lineStyle === "dotted"
                    ? "2px dotted #aaaaaa"
                    : "1px solid #aaaaaa",
              }}
            />
          ) : (
            <div style={{ height: "44px" }} />
          )}
          {block.style.lineStyle === "Sign here" && (
            <p className="text-xs text-gray-400 mt-[-4px] mb-2">Sign here</p>
          )}
          <p style={{ fontWeight: 600 }}>{block.content.name || "Name"}</p>
          {block.content.title && (
            <p style={{ color: "#666666" }}>{block.content.title}</p>
          )}
          {block.content.email && (
            <p style={{ color: "#888888", fontSize: "13px" }}>{block.content.email}</p>
          )}
        </div>
      );
      break;

    case "button":
      innerContent = (
        <div style={{ textAlign: block.style.textAlign || "left" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: block.style.bgColor || sampleBrand.primaryColor,
              color: block.style.color || "#ffffff",
              padding: `${block.style.paddingY ?? 10}px ${block.style.paddingX ?? 24}px`,
              borderRadius: `${block.style.borderRadius ?? 6}px`,
              fontSize: `${block.style.fontSize || 14}px`,
              fontWeight: 600,
              letterSpacing: "0.01em",
              cursor: "default",
            }}
          >
            {block.content.text || "Click here"}
          </div>
        </div>
      );
      break;

    case "image-placeholder":
      innerContent = (
        <div
          style={{
            width: block.style.width || "100%",
            height: `${block.style.height || 200}px`,
            border: "2px dashed #d1d5db",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9fafb",
            color: "#9ca3af",
            fontSize: "13px",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <svg
            width="36"
            height="36"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="font-medium">Click to add image</span>
        </div>
      );
      break;

    case "brand-color-bar": {
      const barColor =
        block.style.color === "Secondary"
          ? sampleBrand.secondaryColor
          : sampleBrand.primaryColor;
      innerContent = (
        <div
          style={{
            width: "100%",
            height: `${block.style.height || 4}px`,
            backgroundColor: barColor,
            borderRadius: "2px",
          }}
        />
      );
      break;
    }

    case "company-stamp":
      innerContent = (
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: `${block.style.size || 80}px`,
              height: `${block.style.size || 80}px`,
              borderRadius: "50%",
              backgroundColor: sampleBrand.primaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: `${Math.floor((block.style.size || 80) * 0.35)}px`,
              fontWeight: 800,
              flexShrink: 0,
              letterSpacing: "0.05em",
            }}
          >
            {sampleBrand.initials}
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: "16px", color: sampleBrand.primaryColor }}
            >
              {sampleBrand.companyName}
            </div>
            <div style={{ fontSize: "12px", color: "#888888", marginTop: "2px" }}>
              {sampleBrand.tagline}
            </div>
            <div style={{ fontSize: "11px", color: "#aaaaaa", marginTop: "4px" }}>
              {sampleBrand.website}
            </div>
          </div>
        </div>
      );
      break;

    default:
      innerContent = (
        <div className="text-gray-300 italic text-xs">[{block.type}]</div>
      );
  }

  if (isPreview) {
    return (
      <div style={{ padding: "5px 0" }}>
        {innerContent}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative group/block">

      {/* ── Drop zone above ──────────────────────────────────────── */}
      <div
        style={{ height: 8, position: "relative" }}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
      >
        {dropIndicator === index && (
          <div
            className="drop-line"
            style={{
              position: "absolute",
              inset: "1px 0",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                flex: 1,
                height: 2,
                backgroundColor: "#3b82f6",
                borderRadius: 1,
                opacity: 0.8,
              }}
            />
          </div>
        )}
      </div>

      {/* ── Block body — zero visual chrome ──────────────────────── */}
      <div
        className="relative rounded-sm"
        style={{
          backgroundColor: isSelected ? "rgba(59,130,246,0.04)" : "transparent",
          paddingTop: 1,
          paddingBottom: 1,
          transition: "background-color 0.15s ease",
          cursor: "text",
        }}
        onClick={() => {
          onSelect(block.id);
          if (isEditableText) editor?.commands.focus();
        }}
      >
        {/* ── Left gutter: drag handle + add block (hover only) ──── */}
        <div
          className="absolute opacity-0 group-hover/block:opacity-100 transition-opacity duration-100 pointer-events-none group-hover/block:pointer-events-auto select-none"
          style={{ left: -34, top: 0, display: "flex", flexDirection: "column", gap: 1 }}
        >
          {/* Drag handle */}
          <div
            draggable
            onDragStart={(e) =>
              handleDragStart(e, { id: block.id, type: block.type, isSidebar: false })
            }
            className="p-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 rounded hover:bg-gray-100/90 transition-colors"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={13} />
          </div>

          {/* Add block */}
          <div style={{ position: "relative" }}>
            <button
              className="p-1 text-gray-300 hover:text-blue-500 rounded hover:bg-blue-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddMenu((v) => !v);
              }}
              title="Add block"
            >
              <Plus size={12} />
            </button>
            {showAddMenu && (
              <div style={{ position: "absolute", left: 28, top: 0, zIndex: 50 }}>
                <BlockAddMenu
                  blockId={block.id}
                  onAdd={(id, type) => {
                    addBlockAbove(id, type);
                    setShowAddMenu(false);
                  }}
                  onClose={() => setShowAddMenu(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Right actions: duplicate + delete (hover only) ──────── */}
        <div
          className="absolute opacity-0 group-hover/block:opacity-100 transition-opacity duration-100 flex gap-px pointer-events-none group-hover/block:pointer-events-auto z-10"
          style={{ top: 0, right: 0 }}
        >
          <button
            className="p-1.5 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={(e) => duplicateBlock(block.id, e)}
            title="Duplicate block"
          >
            <Copy size={11} />
          </button>
          <button
            className="p-1.5 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            onClick={(e) => deleteBlock(block.id, e)}
            title="Delete block"
          >
            <Trash2 size={11} />
          </button>
        </div>

        {innerContent}
      </div>
    </div>
  );
}
