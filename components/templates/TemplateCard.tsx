"use client";

import React from "react";
import { FileText, ArrowRight } from "lucide-react";

interface Template {
  id: string;
  title: string;
  category: string;
  thumbnail_url?: string;
  element_count?: number;
}

interface TemplateCardProps {
  template: Template;
  onSelect: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  letterhead: "bg-blue-100 text-blue-700",
  invoice: "bg-green-100 text-green-700",
  certificate: "bg-purple-100 text-purple-700",
  proposal: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-600",
};

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const badgeColor = CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.other;

  return (
    <div
      id={`template-card-${template.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Thumbnail */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
        {template.thumbnail_url ? (
          <img
            src={template.thumbnail_url}
            alt={template.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <FileText size={40} />
            <span className="text-xs font-medium uppercase tracking-widest">Preview</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 leading-snug">
            {template.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeColor}`}
          >
            {template.category}
          </span>
        </div>

        {template.element_count !== undefined && (
          <p className="text-xs text-gray-400">{template.element_count} elements</p>
        )}

        <button
          id={`use-template-${template.id}`}
          onClick={() => onSelect(template.id)}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 active:scale-95"
        >
          Use This Template
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
