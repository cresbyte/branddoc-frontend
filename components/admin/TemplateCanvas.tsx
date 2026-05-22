import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { Loader2, Lock } from 'lucide-react';
import { useTemplateCanvas } from '@/hooks/useTemplateCanvas';
import CanvasToolbar from './CanvasToolbar';
import CanvasElement from './CanvasElement';
import ElementPropertiesPanel from './ElementPropertiesPanel';
import ElementsLayerPanel from './ElementsLayerPanel';

interface TemplateCanvasProps {
  templateId: string;
  canvasWidth: number;
  canvasHeight: number;
}

const DISPLAY_WIDTH = 580;

export default function TemplateCanvas({ 
  templateId, 
  canvasWidth, 
  canvasHeight 
}: TemplateCanvasProps) {
  const hook = useTemplateCanvas(templateId, canvasWidth, canvasHeight);
  const scale = DISPLAY_WIDTH / canvasWidth;
  const displayHeight = canvasHeight * scale;

  const selectedElement = hook.elements.find(e => e.id === hook.selectedId && !e._deleted) || null;

  if (hook.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-in fade-in duration-500">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-sm font-medium text-gray-500">Loading canvas elements...</p>
      </div>
    );
  }

  const handleStageMouseDown = (e: any) => {
    // clicked on stage directly
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      hook.selectElement(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* 1. Sticky Toolbar */}
      <CanvasToolbar
        isDirty={hook.isDirty}
        isSaving={hook.isSaving}
        selectedElement={selectedElement}
        onAddElement={hook.addElement}
        onDuplicate={() => selectedElement && hook.duplicateElement(selectedElement.id)}
        onDelete={() => selectedElement && hook.deleteElement(selectedElement.id)}
        onMoveUp={() => selectedElement && hook.moveElementLayer(selectedElement.id, 'up')}
        onMoveDown={() => selectedElement && hook.moveElementLayer(selectedElement.id, 'down')}
        onSave={hook.saveAll}
      />

      {/* 2. Main Layout Container */}
      <div className="flex flex-1 gap-0 overflow-hidden border border-gray-200 rounded-2xl mt-4 bg-white shadow-xl ring-1 ring-black/5">
        
        {/* Left Sidebar: Layers */}
        <div className="w-64 border-r border-gray-100 bg-gray-50/50 flex flex-col">
          <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 flex justify-between items-center bg-white/10">
            Layers 
            <span className="bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded text-[8px]">{hook.elements.filter(e => !e._deleted).length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ElementsLayerPanel
              elements={hook.elements.filter(e => !e._deleted)}
              selectedId={hook.selectedId}
              onSelect={hook.selectElement}
            />
          </div>
        </div>

        {/* Center: Canvas Area */}
        <div className="flex-1 bg-gray-100/30 overflow-auto flex items-start justify-center p-12 custom-scrollbar">
          <div
            className="flex-shrink-0"
            style={{
              width: DISPLAY_WIDTH,
              height: displayHeight,
              boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)',
              borderRadius: 2,
              backgroundColor: 'white',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
          >
            <Stage
              width={DISPLAY_WIDTH}
              height={displayHeight}
              onMouseDown={handleStageMouseDown}
              onTouchStart={handleStageMouseDown}
            >
              <Layer scaleX={scale} scaleY={scale}>
                {/* White Paper Area */}
                <Rect
                  width={canvasWidth}
                  height={canvasHeight}
                  fill="white"
                />
                
                {/* Visual Elements */}
                {hook.elements
                  .filter(el => !el._deleted && el.is_visible)
                  .sort((a, b) => a.z_index - b.z_index) // Render in z-index order
                  .map(el => (
                    <CanvasElement
                      key={el.id}
                      element={el}
                      isSelected={hook.selectedId === el.id}
                      onSelect={() => hook.selectElement(el.id)}
                      onChange={(changes) => hook.updateElement(el.id, changes)}
                    />
                  ))
                }
              </Layer>
            </Stage>

            {/* Lock Overlays */}
            {hook.elements
              .filter(e => e.is_locked && !e._deleted)
              .map(e => (
                <div
                  key={`lock-${e.id}`}
                  className="bg-white/80 rounded-full p-1 shadow-sm border border-gray-200"
                  style={{
                    position: 'absolute',
                    left: (e.x * scale) - 6,
                    top: (e.y * scale) - 6,
                    pointerEvents: 'none',
                    zIndex: 5,
                  }}
                >
                  <Lock size={8} className="text-gray-400" />
                </div>
              ))
            }
          </div>
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-80 border-l border-gray-100 bg-white flex flex-col">
          <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
            Properties
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ElementPropertiesPanel
              element={selectedElement}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onChange={(changes) => selectedElement && hook.updateElement(selectedElement.id, changes)}
              onDelete={() => selectedElement && hook.deleteElement(selectedElement.id)}
              onDuplicate={() => selectedElement && hook.duplicateElement(selectedElement.id)}
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
