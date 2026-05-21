"use client";

import React from "react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Image as ImageIcon } from "lucide-react";

interface Element {
  id: string;
  element_type: string;
  content?: string;
  font_size?: number;
  font_weight?: string;
  text_align?: string;
  color?: string;
  asset_url?: string;
  placeholder_hint?: string;
}

interface PropertiesPanelProps {
  element: Element | null;
  onChange: (id: string, field: string, value: any) => void;
}

export default function PropertiesPanel({ element, onChange }: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <span className="text-2xl">✏️</span>
        </div>
        <p className="text-sm font-medium text-gray-500">Select an element to edit its properties</p>
      </div>
    );
  }

  const isText = element.element_type === "text";
  const isImage = element.element_type === "image" || element.element_type === "svg";

  return (
    <div className="flex flex-col gap-5 p-4">
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Element Type
        </p>
        <p className="text-sm font-semibold capitalize text-gray-700">{element.element_type}</p>
        {element.placeholder_hint && (
          <p className="mt-0.5 text-xs text-gray-400">{element.placeholder_hint}</p>
        )}
      </div>

      {/* ── Text properties ──────────────────────────────────────────────── */}
      {isText && (
        <>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Content
            </label>
            <textarea
              id={`prop-content-${element.id}`}
              value={element.content || ""}
              onChange={(e) => onChange(element.id, "content", e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Font Size
              </label>
              <input
                id={`prop-font-size-${element.id}`}
                type="number"
                value={element.font_size ?? ""}
                onChange={(e) => onChange(element.id, "font_size", parseFloat(e.target.value))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Color
              </label>
              <input
                id={`prop-color-${element.id}`}
                type="color"
                value={element.color || "#000000"}
                onChange={(e) => onChange(element.id, "color", e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-0.5 outline-none"
              />
            </div>
          </div>

          {/* Font weight */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Font Weight
            </label>
            <button
              id={`prop-bold-${element.id}`}
              onClick={() =>
                onChange(element.id, "font_weight", element.font_weight === "bold" ? "normal" : "bold")
              }
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                element.font_weight === "bold"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Bold size={12} /> Bold
            </button>
          </div>

          {/* Text align */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Text Align
            </label>
            <div className="flex gap-1">
              {[
                { value: "left", icon: <AlignLeft size={13} /> },
                { value: "center", icon: <AlignCenter size={13} /> },
                { value: "right", icon: <AlignRight size={13} /> },
                { value: "justify", icon: <AlignJustify size={13} /> },
              ].map(({ value, icon }) => (
                <button
                  key={value}
                  id={`prop-align-${value}-${element.id}`}
                  onClick={() => onChange(element.id, "text_align", value)}
                  className={`flex flex-1 items-center justify-center rounded-lg p-2 transition ${
                    element.text_align === value
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Image properties ─────────────────────────────────────────────── */}
      {isImage && (
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Image URL
          </label>
          {element.asset_url && (
            <img
              src={element.asset_url}
              alt="preview"
              className="mb-2 h-16 w-full rounded-lg border border-gray-200 object-contain bg-gray-50"
            />
          )}
          <input
            id={`prop-asset-url-${element.id}`}
            type="url"
            value={element.asset_url || ""}
            placeholder="https://…"
            onChange={(e) => onChange(element.id, "asset_url", e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      )}
    </div>
  );
}
