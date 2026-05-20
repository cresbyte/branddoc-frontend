"use client";

import { Check, Edit2 } from "lucide-react";
import { interpolate } from "@/lib/utils";

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
  context?: any;
}

export function TemplateCard({ template, onSelect, selected, isSelecting, context }: TemplateCardProps) {
  // Use provided context or a generic fallback for the preview
  const ctx = context && Object.keys(context).length > 0 ? {
    ...context,
    logo_url: context.logo_url || context.logo
  } : {
    company_name: "Mockup Corp",
    logo_url: "https://via.placeholder.com/150",
    email: "hello@mockup.com",
    website: "mockup.com"
  };

  const headerHtml = interpolate(template.header_html || "", ctx);
  const footerHtml = interpolate(template.footer_html || "", ctx);
  const templateCss = interpolate(template.template_css || "", ctx);

  // Combine CSS + Header + Spacer + Footer for the iframe preview
  const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; }
          ${templateCss}
        </style>
      </head>
      <body style="display: flex; flex-direction: column; min-height: 100vh; overflow: hidden; justify-content: space-between; background: #ffffff;">
        <div style="width: 100%;">
          ${headerHtml}
        </div>
        <div style="flex: 1; padding: 20px; color: #94a3b8; font-size: 14px; text-align: center; border-left: 1px dashed #cbd5e1; border-right: 1px dashed #cbd5e1; margin: 40px 60px; display: flex; align-items: center; justify-content: center; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
          [ Document Content ]
        </div>
        <div style="width: 100%;">
          ${footerHtml}
        </div>
      </body>
    </html>
  `;

  return (
    <div
      className={`group relative flex flex-col bg-white overflow-hidden border ${
        selected ? "border-brand-primary ring-2 ring-brand-primary" : "border-slate-200"
      } shadow-sm hover:shadow-xl transition-all duration-300 w-full aspect-[4/5] cursor-pointer`}
      onClick={() => !isSelecting && onSelect(template)}
    >
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-4 left-4 w-7 h-7 bg-brand-primary text-white rounded-full flex items-center justify-center z-20 shadow-md">
          <Check className="w-4 h-4" strokeWidth={3} />
        </div>
      )}

      {/* Premium Badge */}
      {template.is_premium && (
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center px-2 py-1 rounded bg-slate-900/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 tracking-wider shadow-sm">
            PREMIUM
          </span>
        </div>
      )}

      {/* Preview Container: scaled to fit gracefullly */}
      <div className="w-full h-full bg-slate-50 relative overflow-hidden">
        <div
          className="w-[1050px] h-[1312px] origin-top-left absolute top-0 left-0 bg-white"
          style={{ transform: "scale(0.333)", pointerEvents: "none" }}
        >
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Overlay Action Button (like the "Edit" button in screenshot) */}
      <div className="absolute bottom-4 right-4 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <button
          disabled={isSelecting}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-[13px] shadow-md transition-colors ${
            selected
              ? "bg-brand-primary text-white"
              : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
          }`}
        >
          {isSelecting ? "Applying..." : selected ? "Applied" : "Select"}
        </button>
      </div>

    </div>
  );
}
