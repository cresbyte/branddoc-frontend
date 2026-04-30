import React from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { BlockType } from "./types";
import { BLOCK_CATEGORIES } from "./constants";

interface EditorLeftSidebarProps {
  handleDragStart: (e: React.DragEvent, item: { type?: BlockType, isSidebar?: boolean }) => void;
}

export function EditorLeftSidebar({ handleDragStart }: EditorLeftSidebarProps) {
  return (
    <div className="w-[260px] bg-white border-r flex flex-col flex-shrink-0 z-10 hidden md:flex">
      <div className="p-4 border-b font-medium text-sm flex-shrink-0">
        Add blocks
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {BLOCK_CATEGORIES.map(category => (
          <div key={category.name}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {category.name}
            </div>
            <div className="space-y-2">
              {category.items.map(item => (
                <div 
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, { type: item.type as BlockType, isSidebar: true })}
                  className="flex items-center gap-3 w-full h-[40px] bg-gray-50 border border-gray-100 rounded px-2 cursor-grab hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all group"
                >
                  <GripVertical size={14} className="text-gray-300 mx-1 flex-shrink-0" />
                  <item.icon size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 flex-1 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="text-xs font-semibold text-gray-400 tracking-wider mb-3">
            Saved blocks
          </div>
          <div className="space-y-2">
            {["Standard footer note", "Payment terms"].map((name, i) => (
              <div key={i} className="flex items-center gap-3 w-full h-[40px] bg-blue-50 border border-blue-100 rounded px-2 cursor-pointer hover:bg-blue-100/50 transition-all group">
                <GripVertical size={14} className="text-blue-300 mx-1 flex-shrink-0" />
                <span className="text-sm font-medium text-blue-900 flex-1 truncate">{name}</span>
                <Trash2 size={12} className="text-blue-300 hover:text-red-500 mx-1 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
