"use client";

import { Check } from "lucide-react";
import { useState } from "react";

interface Template {
  id: string;
  name: string;
  style_tag: string;
  is_premium: boolean;
  header_html: string;
  footer_html: string;
  template_css: string;
  description: string;
}

interface TemplateCardProps {
  template: Template;
  onSelect: (temp: Template) => void;
  selected?: boolean;
  isSelecting?: boolean;
}

export function TemplateCard({ template, onSelect, selected, isSelecting }: TemplateCardProps) {
  // We combine CSS + Header + Spacer + Footer for the iframe preview
  const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; }
          ${template.template_css || ""}
        </style>
      </head>
      <body style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; justify-content: space-between; background: #f8fafc;">
        <div style="width: 100%;">
          ${template.header_html || ""}
        </div>
        <div style="flex: 1; padding: 20px; color: #94a3b8; font-size: 14px; text-align: center; border-left: 1px dashed #cbd5e1; border-right: 1px dashed #cbd5e1; margin: 0 40px; display: flex; align-items: center; justify-content: center;">
          [ Document Content ]
        </div>
        <div style="width: 100%;">
          ${template.footer_html || ""}
        </div>
      </body>
    </html>
  `;

  return (
    <div
      className={`relative flex flex-col bg-white rounded-xl overflow-hidden border ${
        selected ? "border-brand-primary ring-2 ring-brand-primary" : "border-slate-200"
      } shadow-sm hover:shadow-md transition-all duration-200`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center z-10 shadow">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Preview Container: We scale the iframe down using transform */}
      <div className="w-full aspect-[4/3] bg-slate-50 relative border-b border-slate-100 overflow-hidden">
        <div
          className="w-[1000px] h-[750px] origin-top-left absolute top-0 left-0"
          style={{ transform: "scale(0.35)", pointerEvents: "none" }}
        >
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{template.name}</h3>
            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-slate-100 text-slate-800 uppercase tracking-wide">
              {template.style_tag}
            </span>
          </div>
          {template.is_premium && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
              PREMIUM
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {template.description}
        </p>

        <div className="mt-auto">
          <button
            onClick={() => onSelect(template)}
            disabled={isSelecting}
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              selected
                ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
          >
            {isSelecting ? "Applying..." : selected ? "Applied Template" : "Select Template"}
          </button>
        </div>
      </div>
    </div>
  );
}
