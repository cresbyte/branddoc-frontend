import React, { useState } from "react";
import { BlockType } from "./types";
import { BLOCK_CATEGORIES } from "./constants";
import { GripVertical, Search, Trash2 } from "lucide-react";

interface EditorLeftSidebarProps {
  handleDragStart: (
    e: React.DragEvent,
    item: { type?: BlockType; isSidebar?: boolean },
  ) => void;
  onInsertBlock: (type: BlockType) => void;
}

export function EditorLeftSidebar({
  handleDragStart,
  onInsertBlock,
}: EditorLeftSidebarProps) {
  const [query, setQuery] = useState("");

  const filteredCategories = BLOCK_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="w-[248px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0 z-10 hidden md:flex">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0 space-y-2.5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Add blocks
        </p>
        {/* Search */}
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks…"
            className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-gray-50/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {filteredCategories.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6 italic">
            No blocks match "{query}"
          </p>
        )}
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              {category.name}
            </div>
            <div className="space-y-1">
              {category.items.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, {
                      type: item.type as BlockType,
                      isSidebar: true,
                    })
                  }
                  onClick={() => onInsertBlock(item.type as BlockType)}
                  className="flex items-center gap-2.5 w-full h-9 bg-gray-50/80 border border-gray-100 rounded-lg px-2 cursor-grab hover:bg-white hover:shadow-sm hover:border-gray-200 active:cursor-grabbing transition-all group select-none"
                >
                  <GripVertical
                    size={12}
                    className="text-gray-300 flex-shrink-0 group-hover:text-gray-400 transition-colors"
                  />
                  <item.icon
                    size={14}
                    className="text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors"
                  />
                  <span className="text-xs font-medium text-gray-600 flex-1 truncate group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Saved blocks */}
        {!query && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              Saved blocks
            </div>
            <div className="space-y-1">
              {["Standard footer note", "Payment terms"].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 w-full h-9 bg-blue-50/60 border border-blue-100 rounded-lg px-2 cursor-pointer hover:bg-blue-100/60 transition-all group select-none"
                >
                  <GripVertical
                    size={12}
                    className="text-blue-300 flex-shrink-0"
                  />
                  <span className="text-xs font-medium text-blue-800 flex-1 truncate">
                    {name}
                  </span>
                  <Trash2
                    size={11}
                    className="text-blue-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
