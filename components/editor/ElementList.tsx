"use client";

import { clsx } from "clsx";
import { Box, Image, Lock, Minus, Triangle, Type } from "lucide-react";
import React from "react";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={13} />,
  image: <Image size={13} />,
  svg: <Triangle size={13} />,
  line: <Minus size={13} />,
  shape: <Box size={13} />,
};

interface Element {
  id: string;
  element_type: string;
  is_editable?: boolean;
  is_locked?: boolean;
  placeholder_hint?: string;
  content?: string;
}

interface ElementListProps {
  elements: Element[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ElementList({ elements, selectedId, onSelect }: ElementListProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {elements.map((el) => {
        const locked = el.is_locked || !el.is_editable;
        const label = el.placeholder_hint || el.content?.slice(0, 30) || el.element_type;
        const isSelected = selectedId === el.id;

        return (
          <button
            key={el.id}
            id={`element-list-item-${el.id}`}
            onClick={() => !locked && onSelect(el.id)}
            disabled={locked}
            className={clsx(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors",
              isSelected
                ? "bg-blue-50 text-blue-700 font-medium"
                : locked
                ? "text-gray-300 cursor-default"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <span className={isSelected ? "text-blue-600" : locked ? "text-gray-300" : "text-gray-400"}>
              {TYPE_ICONS[el.element_type] ?? <Box size={13} />}
            </span>
            <span className="flex-1 truncate">{label}</span>
            {locked && <Lock size={10} className="text-gray-300 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
