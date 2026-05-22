import React from 'react';
import { 
  Type, Square, Minus, Image as ImageIcon, Code2, 
  Copy, Trash2, ChevronUp, ChevronDown, Save, Loader2, Shapes
} from 'lucide-react';
import { KonvaElement } from '@/hooks/useTemplateCanvas';

interface CanvasToolbarProps {
  isDirty: boolean;
  isSaving: boolean;
  selectedElement: KonvaElement | null;
  onAddElement: (type: KonvaElement['element_type']) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSave: () => void;
  showIconLibrary: boolean;
  onOpenIconLibrary: () => void;
}

export default function CanvasToolbar({
  isDirty,
  isSaving,
  selectedElement,
  onAddElement,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSave,
  showIconLibrary,
  onOpenIconLibrary,
}: CanvasToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Group 1: Add Elements */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => onAddElement('text')} icon={Type} label="Text" />
          <ToolbarButton onClick={() => onAddElement('shape')} icon={Square} label="Shape" />
          <ToolbarButton onClick={() => onAddElement('line')} icon={Minus} label="Line" />
          <ToolbarButton onClick={() => onAddElement('image')} icon={ImageIcon} label="Image" />
          <ToolbarButton onClick={() => onAddElement('svg')} icon={Code2} label="SVG" />
        </div>
        
        {/* Group 2: Icon Library */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
          <ToolbarButton 
            onClick={onOpenIconLibrary} 
            icon={Shapes} 
            label="Icons" 
            active={showIconLibrary}
          />
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Group 2: Actions */}
        <div className="flex items-center gap-1">
          <ToolbarButton 
            onClick={onDuplicate} 
            icon={Copy} 
            label="Duplicate" 
            disabled={!selectedElement} 
          />
          <ToolbarButton 
            onClick={onDelete} 
            icon={Trash2} 
            label="Delete" 
            disabled={!selectedElement} 
            variant="danger"
          />
          <ToolbarButton 
            onClick={onMoveUp} 
            icon={ChevronUp} 
            label="Forward" 
            disabled={!selectedElement} 
          />
          <ToolbarButton 
            onClick={onMoveDown} 
            icon={ChevronDown} 
            label="Backward" 
            disabled={!selectedElement} 
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isDirty && (
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
            Unsaved changes
          </div>
        )}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All
        </button>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: any;
  label: string;
  disabled?: boolean;
  active?: boolean;
  variant?: 'default' | 'danger';
}

function ToolbarButton({ onClick, icon: Icon, label, disabled, active, variant = 'default' }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-30 ${
        active 
          ? 'bg-blue-50 text-blue-600'
          : variant === 'danger' 
            ? 'text-red-600 hover:bg-red-50' 
            : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
