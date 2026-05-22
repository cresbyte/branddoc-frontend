import React from 'react';
import { 
  Type, Square, Minus, Image as ImageIcon, Code2, 
  Lock, EyeOff 
} from 'lucide-react';
import { KonvaElement } from '@/hooks/useTemplateCanvas';

interface ElementsLayerPanelProps {
  elements: KonvaElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TYPE_ICONS: Record<string, any> = {
  text: Type,
  shape: Square,
  line: Minus,
  image: ImageIcon,
  svg: Code2,
};

export default function ElementsLayerPanel({
  elements,
  selectedId,
  onSelect,
}: ElementsLayerPanelProps) {
  // Sort descending by z_index
  const sortedElements = [...elements].sort((a, b) => b.z_index - a.z_index);

  return (
    <div className="flex flex-col">
      {sortedElements.map((el) => {
        const Icon = TYPE_ICONS[el.element_type] || Square;
        const isSelected = selectedId === el.id;

        return (
          <button
            key={el.id}
            onClick={() => onSelect(el.id)}
            className={`flex items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-white/50 ${
              isSelected ? 'bg-blue-50/50 ring-1 ring-inset ring-blue-500/20' : ''
            }`}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-md ${
              isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <Icon size={14} />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className={`truncate text-sm font-medium ${
                isSelected ? 'text-blue-900' : 'text-gray-700'
              }`}>
                {el.placeholder_hint || el.element_type.toUpperCase()}
              </div>
              {!el.placeholder_hint && el.content && (
                <div className="truncate text-[10px] text-gray-400">
                  {el.content}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 opacity-50">
              {el.is_locked && <Lock size={12} className="text-gray-500" />}
              {!el.is_visible && <EyeOff size={12} className="text-gray-500" />}
            </div>
          </button>
        );
      })}
      
      {elements.length === 0 && (
        <div className="px-4 py-8 text-center text-xs text-gray-400">
          No layers yet
        </div>
      )}
    </div>
  );
}
