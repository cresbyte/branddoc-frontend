import React from "react";
import { BlockType } from "./types";
import {
  Type,
  AlignLeft,
  List,
  ListOrdered,
  Minus,
  Table,
  Heading2,
  Quote,
} from "lucide-react";

const QUICK_BLOCKS: Array<{ type: BlockType; label: string; icon: React.ElementType }> = [
  { type: "heading", label: "Heading", icon: Type },
  { type: "subheading", label: "Subheading", icon: Heading2 },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "bullet-list", label: "Bullets", icon: List },
  { type: "numbered-list", label: "Numbered", icon: ListOrdered },
  { type: "blockquote", label: "Quote", icon: Quote },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "table", label: "Table", icon: Table },
];

interface BlockAddMenuProps {
  blockId: string;
  onAdd: (blockId: string, type: string) => void;
  onClose: () => void;
}

export function BlockAddMenu({ blockId, onAdd, onClose }: BlockAddMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Menu */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-1.5 flex gap-0.5 min-w-max">
        {QUICK_BLOCKS.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={(e) => {
              e.stopPropagation();
              onAdd(blockId, type);
              onClose();
            }}
            title={label}
            className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors min-w-[54px]"
          >
            <Icon size={14} />
            <span className="text-[9px] font-semibold leading-none tracking-wide uppercase text-gray-400 group-hover:text-gray-700">
              {label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
