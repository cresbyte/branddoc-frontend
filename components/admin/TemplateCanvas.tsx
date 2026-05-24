import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { 
  Loader2, Lock, Layers as LayersIcon, 
  Settings, Type, Shapes, Plus, Save, ChevronLeft,
  Square, Minus, Image as ImageIcon, Code2,
  Bold, Italic, Underline, Strikethrough, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, Palette,
  RotateCcw
} from 'lucide-react';
import { useTemplateCanvas, KonvaElement } from '@/hooks/useTemplateCanvas';
import CanvasElement from './CanvasElement';
import ElementPropertiesPanel from './ElementPropertiesPanel';
import ElementsLayerPanel from './ElementsLayerPanel';
import IconLibraryPanel from './IconLibraryPanel';
import { Button } from '@/components/DesignSystem/Button';
import { TextField } from '@/components/DesignSystem/TextField';
import { SelectField } from '@/components/DesignSystem/SelectField';
import { TextAreaField } from '@/components/DesignSystem/TextAreaField';
import { ImageUpload } from '@/components/DesignSystem/ImageUpload';
import { useRouter } from 'next/navigation';
import type { IconVariantDetail } from '@/lib/svgUtils';
import { getSnappingGuides, Guide } from '@/lib/snappingUtils';
import { HexColorPicker } from 'react-colorful';

interface TemplateCanvasProps {
  templateId: string;
  canvasWidth: number;
  canvasHeight: number;
  templateData?: Record<string, any>;
  onTemplateUpdate?: (field: string, val: any) => void;
  onSaveTemplate?: () => void;
  isSavingTemplate?: boolean;
}

const DISPLAY_WIDTH = 580;
const CATEGORIES = ["letterhead", "invoice", "certificate", "proposal", "other"];
const STATUSES = ["draft", "published", "archived"];
const FONT_FAMILIES = [
  'Inter', 'Georgia', 'Times New Roman', 'Arial', 'Helvetica',
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display'
];

export default function TemplateCanvas({
  templateId,
  canvasWidth,
  canvasHeight,
  templateData,
  onTemplateUpdate,
  onSaveTemplate,
  isSavingTemplate
}: TemplateCanvasProps) {
  const hook = useTemplateCanvas(templateId, canvasWidth, canvasHeight);
  const scale = DISPLAY_WIDTH / canvasWidth;
  const displayHeight = canvasHeight * scale;
  const router = useRouter();

  const [leftTab, setLeftTab] = useState<'layers' | 'add' | 'icons'>('layers');
  const [rightTab, setRightTab] = useState<'properties' | 'settings'>('properties');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const editOverlayRef = useRef<HTMLDivElement>(null);
  const textColorPickerRef = useRef<HTMLDivElement>(null);

  const selectedElement = hook.elements.find(e => e.id === hook.selectedId && !e._deleted) || null;
  const editingElement = hook.elements.find(e => e.id === editingId && !e._deleted) || null;

  // Auto-switch to properties tab when an element is selected
  useEffect(() => {
    if (hook.selectedId) setRightTab('properties');
  }, [hook.selectedId]);

  // Close text-color picker on outside click
  useEffect(() => {
    if (!showTextColorPicker) return;
    const handler = (e: MouseEvent) => {
      if (textColorPickerRef.current && !textColorPickerRef.current.contains(e.target as Node)) {
        setShowTextColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTextColorPicker]);

  // When inline editing starts, populate the overlay with element content and focus
  useEffect(() => {
    if (!editingId || !editOverlayRef.current || !editingElement) return;
    // Set initial content only when entering edit mode
    editOverlayRef.current.innerText = editingElement.content || '';
    editOverlayRef.current.focus();
    // Place cursor at end
    const range = document.createRange();
    range.selectNodeContents(editOverlayRef.current);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]); // intentionally only on editingId change

  const commitTextEdit = useCallback(() => {
    if (!editingId || !editOverlayRef.current) return;
    const text = editOverlayRef.current.innerText;
    if (text.trim() !== '') {
      hook.updateElement(editingId, { content: text });
    }
    setEditingId(null);
    setShowTextColorPicker(false);
  }, [editingId, hook]);

  const handleStageMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      hook.selectElement(null);
      if (editingId) commitTextEdit();
    }
  };

  const handleCanvasAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking the canvas area bg (not a child element), deselect
    if (e.target === canvasAreaRef.current) {
      hook.selectElement(null);
      if (editingId) commitTextEdit();
    }
  };

  const handleDoubleClick = useCallback((id: string) => {
    const el = hook.elements.find(e => e.id === id);
    if (!el || el.element_type !== 'text' || el.is_locked) return;
    hook.selectElement(id);
    setEditingId(id);
  }, [hook]);

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      commitTextEdit();
    }
  };

  // Rich text commands
  const execCmd = (cmd: string, value?: string) => {
    editOverlayRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/contact-block')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/contact-block');
    if (!raw) return;

    try {
      const { variantDetail, iconColor } = JSON.parse(raw);
      const canvasAreaEl = canvasAreaRef.current;
      if (!canvasAreaEl) return;

      const canvasEl = canvasAreaEl.querySelector('[data-canvas-paper]') as HTMLElement;
      if (!canvasEl) {
        hook.addContactBlock(variantDetail, iconColor, 60, 60);
        return;
      }
      const rect = canvasEl.getBoundingClientRect();
      const dropX = (e.clientX - rect.left) / scale;
      const dropY = (e.clientY - rect.top) / scale;

      hook.addContactBlock(
        variantDetail,
        iconColor,
        Math.max(0, Math.min(dropX, canvasWidth - 240)),
        Math.max(0, Math.min(dropY, canvasHeight - 28)),
      );
    } catch (err) {
      console.error('Icon drop parse error', err);
    }
  }, [hook, scale, canvasWidth, canvasHeight]);

  const handleAddFromPanel = useCallback((
    variantDetail: IconVariantDetail & { icon_name: string },
    iconColor: string
  ) => {
    hook.addContactBlock(variantDetail, iconColor, 60, 80);
  }, [hook]);

  const handleDragMove = useCallback((id: string, e: any) => {
    const draggingElement = hook.elements.find(el => el.id === id);
    if (!draggingElement) return;

    const node = e.target;
    const tempElement = {
      ...draggingElement,
      x: node.x(),
      y: node.y(),
    };

    const snapResult = getSnappingGuides(
      tempElement,
      hook.elements.filter(el => el.id !== id),
      canvasWidth,
      canvasHeight
    );

    const newGuides: Guide[] = [];
    if (snapResult.v) {
      node.x(snapResult.v.offset);
      newGuides.push({ type: 'V', pos: snapResult.v.lineGuide });
    }
    if (snapResult.h) {
      node.y(snapResult.h.offset);
      newGuides.push({ type: 'H', pos: snapResult.h.lineGuide });
    }
    setGuides(newGuides);
  }, [hook.elements, canvasWidth, canvasHeight]);

  const handleDragEnd = useCallback(() => {
    setGuides([]);
  }, []);

  // Compute overlay position for inline text editor
  const getOverlayStyle = (): React.CSSProperties => {
    if (!editingElement || !canvasAreaRef.current) return { display: 'none' };
    const paper = canvasAreaRef.current.querySelector('[data-canvas-paper]') as HTMLElement;
    if (!paper) return { display: 'none' };
    const paperRect = paper.getBoundingClientRect();
    const containerRect = canvasAreaRef.current.getBoundingClientRect();

    const left = paperRect.left - containerRect.left + editingElement.x * scale;
    const top = paperRect.top - containerRect.top + editingElement.y * scale;

    return {
      position: 'absolute',
      left,
      top,
      width: editingElement.width * scale,
      minHeight: editingElement.height * scale,
      fontSize: editingElement.font_size * scale,
      fontFamily: editingElement.font_family,
      fontWeight: editingElement.font_weight,
      fontStyle: editingElement.font_style,
      color: editingElement.color,
      textAlign: editingElement.text_align as any,
      lineHeight: editingElement.line_height,
      letterSpacing: editingElement.letter_spacing * scale,
      outline: '2px solid #6366f1',
      outlineOffset: 2,
      borderRadius: 2,
      padding: 0,
      margin: 0,
      background: 'rgba(255,255,255,0.05)',
      zIndex: 50,
      cursor: 'text',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflow: 'visible',
      boxSizing: 'border-box',
    };
  };

  if (hook.isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white animate-in fade-in duration-500">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
        <p className="mt-4 text-sm font-bold text-slate-500">Loading canvas editor...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white selection:bg-slate-900/10">
      {/* 1. Left Sidebar */}
      <div className="flex w-72 flex-col border-r border-slate-100 bg-slate-50/50">
        <div className="flex border-b border-slate-100 bg-white p-1">
          <SidebarTab active={leftTab === 'layers'} onClick={() => setLeftTab('layers')} icon={LayersIcon} label="Layers" />
          <SidebarTab active={leftTab === 'add'} onClick={() => setLeftTab('add')} icon={Plus} label="Add" />
          <SidebarTab active={leftTab === 'icons'} onClick={() => setLeftTab('icons')} icon={Shapes} label="Icons" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {leftTab === 'layers' && (
            <ElementsLayerPanel
              elements={hook.elements.filter(e => !e._deleted)}
              selectedId={hook.selectedId}
              onSelect={hook.selectElement}
            />
          )}

          {leftTab === 'add' && (
            <div className="grid grid-cols-1 gap-2 p-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <AddButton onClick={() => hook.addElement('text')} icon={Type} label="Text Content" sub="Add headlines or body text" />
              <AddButton onClick={() => hook.addElement('shape')} icon={Square} label="Rectangle Shape" sub="Add backgrounds or accents" />
              <AddButton onClick={() => hook.addElement('line')} icon={Minus} label="Divider Line" sub="Separate sections visually" />
              <AddButton onClick={() => hook.addElement('image')} icon={ImageIcon} label="Photo Asset" sub="Upload or link images" />
              <AddButton onClick={() => hook.addElement('svg')} icon={Code2} label="Vector Graphics" sub="Upload custom SVG shapes" />
            </div>
          )}

          {leftTab === 'icons' && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300 h-full">
               <div className="p-4 bg-slate-100/50 border-b border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Drag icons onto the canvas</p>
               </div>
               <div className="sidebar-icons-container h-full overflow-hidden">
                  <IconLibraryPanel
                    isOpen={true}
                    onClose={() => setLeftTab('layers')}
                    onAddContactBlock={handleAddFromPanel}
                    inlineMode={true}
                  />
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Center Canvas */}
      <div 
        className="flex-1 bg-slate-50/30 overflow-auto flex items-start justify-center p-12 custom-scrollbar relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={canvasAreaRef}
        onClick={handleCanvasAreaClick}
      >
        {/* Rich Text Toolbar — shown only when inline editing */}
        {editingId && editingElement && (
          <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-white border border-slate-200 rounded-xl shadow-xl px-3 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseDown={(e) => e.preventDefault()} // prevent overlay blur
          >
            {/* Font Family */}
            <select
              className="text-[11px] font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 mr-1"
              value={editingElement.font_family}
              onChange={(e) => {
                hook.updateElement(editingId, { font_family: e.target.value });
                editOverlayRef.current?.focus();
              }}
            >
              {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            {/* Font Size */}
            <div className="flex items-center gap-0.5 border border-slate-200 rounded-lg overflow-hidden mr-1">
              <button
                className="w-6 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 text-lg font-bold"
                onMouseDown={(e) => { e.preventDefault(); hook.updateElement(editingId, { font_size: Math.max(6, editingElement.font_size - 1) }); }}
              >−</button>
              <input
                type="number"
                className="w-10 h-7 text-center text-[11px] font-bold text-slate-900 border-0 focus:outline-none bg-white"
                value={editingElement.font_size}
                onChange={(e) => hook.updateElement(editingId, { font_size: parseInt(e.target.value) || 12 })}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <button
                className="w-6 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 text-lg font-bold"
                onMouseDown={(e) => { e.preventDefault(); hook.updateElement(editingId, { font_size: editingElement.font_size + 1 }); }}
              >+</button>
            </div>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Bold */}
            <ToolbarBtn
              active={editingElement.font_weight === 'bold'}
              onMouseDown={(e) => {
                e.preventDefault();
                const next = editingElement.font_weight === 'bold' ? 'normal' : 'bold';
                hook.updateElement(editingId, { font_weight: next });
              }}
              title="Bold"
            >
              <Bold size={14} />
            </ToolbarBtn>

            {/* Italic */}
            <ToolbarBtn
              active={editingElement.font_style === 'italic'}
              onMouseDown={(e) => {
                e.preventDefault();
                const next = editingElement.font_style === 'italic' ? 'normal' : 'italic';
                hook.updateElement(editingId, { font_style: next });
              }}
              title="Italic"
            >
              <Italic size={14} />
            </ToolbarBtn>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Alignment */}
            {(['left', 'center', 'right', 'justify'] as const).map((align) => {
              const icons = { left: AlignLeft, center: AlignCenter, right: AlignRight, justify: AlignJustify };
              const Icon = icons[align];
              return (
                <ToolbarBtn
                  key={align}
                  active={editingElement.text_align === align}
                  onMouseDown={(e) => { e.preventDefault(); hook.updateElement(editingId, { text_align: align }); }}
                  title={`Align ${align}`}
                >
                  <Icon size={14} />
                </ToolbarBtn>
              );
            })}

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Text Color */}
            <div className="relative" ref={textColorPickerRef}>
              <button
                className="flex items-center justify-center w-8 h-7 rounded-lg hover:bg-slate-50 transition-colors relative"
                onMouseDown={(e) => { e.preventDefault(); setShowTextColorPicker(v => !v); }}
                title="Text color"
              >
                <Palette size={14} className="text-slate-600" />
                <div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
                  style={{ backgroundColor: editingElement.color }}
                />
              </button>
              {showTextColorPicker && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[200] rounded-xl bg-white p-3 shadow-2xl ring-1 ring-black/5">
                  <HexColorPicker
                    color={editingElement.color}
                    onChange={(c) => hook.updateElement(editingId, { color: c })}
                  />
                  <div className="mt-2">
                    <input
                      className="w-full text-[11px] font-mono text-center border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      value={editingElement.color}
                      onChange={(e) => hook.updateElement(editingId, { color: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Done */}
            <button
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wide hover:bg-slate-700 transition-colors"
              onMouseDown={(e) => { e.preventDefault(); commitTextEdit(); }}
            >
              Done
            </button>
          </div>
        )}

        <div
          data-canvas-paper
          className="flex-shrink-0"
          style={{
            width: DISPLAY_WIDTH,
            height: displayHeight,
            boxShadow: '0 30px 60px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.06)',
            borderRadius: 2,
            backgroundColor: 'white',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Stage
            width={DISPLAY_WIDTH}
            height={displayHeight}
            onMouseDown={handleStageMouseDown}
            onTouchStart={handleStageMouseDown}
          >
            <Layer scaleX={scale} scaleY={scale}>
              <Rect width={canvasWidth} height={canvasHeight} fill="white" />
              {hook.elements
                .filter(el => !el._deleted && el.is_visible)
                .sort((a, b) => a.z_index - b.z_index)
                .map(el => (
                  <CanvasElement
                    key={el.id}
                    element={el}
                    isSelected={hook.selectedId === el.id}
                    onSelect={() => {
                      if (editingId && editingId !== el.id) commitTextEdit();
                      hook.selectElement(el.id);
                    }}
                    onChange={(changes) => hook.updateElement(el.id, changes)}
                    onDragMove={(e) => handleDragMove(el.id, e)}
                    onDragEnd={handleDragEnd}
                    onDoubleClick={() => handleDoubleClick(el.id)}
                  />
                ))
              }
              {guides.map((g, i) => (
                <Line
                  key={i}
                  points={g.type === 'V' ? [g.pos, 0, g.pos, canvasHeight] : [0, g.pos, canvasWidth, g.pos]}
                  stroke="#6366f1"
                  strokeWidth={1}
                  dash={[4, 2]}
                />
              ))}
            </Layer>
          </Stage>

          {/* Inline text editing overlay */}
          {editingId && editingElement && (
            <div
              ref={editOverlayRef}
              contentEditable
              suppressContentEditableWarning
              style={getOverlayStyle()}
              onKeyDown={handleOverlayKeyDown}
              onBlur={commitTextEdit}
              dangerouslySetInnerHTML={
                editOverlayRef.current ? undefined : { __html: editingElement.content || '' }
              }
            />
          )}

          {hook.elements
            .filter(e => e.is_locked && !e._deleted)
            .map(e => (
              <div
                key={`lock-${e.id}`}
                className="bg-white/90 rounded-full p-1 shadow-sm border border-slate-200"
                style={{
                  position: 'absolute',
                  left: (e.x * scale) - 6,
                  top: (e.y * scale) - 6,
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              >
                <Lock size={8} className="text-slate-400" />
              </div>
            ))
          }

          {/* Double-click hint shown when a text element is selected but not editing */}
          {selectedElement?.element_type === 'text' && !editingId && (
            <div
              className="absolute pointer-events-none z-10"
              style={{
                left: selectedElement.x * scale,
                top: selectedElement.y * scale - 26,
                transform: 'none',
              }}
            >
              <div className="flex items-center gap-1 bg-slate-900/80 text-white text-[9px] font-bold uppercase tracking-wide rounded-md px-2 py-1 backdrop-blur-sm whitespace-nowrap">
                Double-click to edit text
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Sidebar */}
      <div className="flex w-80 flex-col border-l border-slate-100 bg-white">
        <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/30">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => router.push('/dashboard/admin/templates')}
            icon={ChevronLeft}
            className="h-8 px-2 text-[10px] uppercase tracking-tighter font-bold"
          >
            BACK
          </Button>
          <Button
            onClick={() => {
              hook.saveAll();
              onSaveTemplate?.();
            }}
            loading={hook.isSaving || isSavingTemplate}
            icon={Save}
            size="sm"
            variant="primary"
            className="h-8 px-4 text-[10px] uppercase tracking-wide font-bold"
          >
            SAVE ALL
          </Button>
        </div>

        <div className="flex border-b border-slate-100 bg-white p-1">
          <SidebarTab active={rightTab === 'properties'} onClick={() => setRightTab('properties')} icon={Type} label="Properties" />
          <SidebarTab active={rightTab === 'settings'} onClick={() => setRightTab('settings')} icon={Settings} label="Settings" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {rightTab === 'properties' && (
            <ElementPropertiesPanel
              element={selectedElement}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onChange={(changes) => selectedElement && hook.updateElement(selectedElement.id, changes)}
              onDelete={() => selectedElement && hook.deleteElement(selectedElement.id)}
              onDuplicate={() => selectedElement && hook.duplicateElement(selectedElement.id)}
            />
          )}

          {rightTab === 'settings' && templateData && onTemplateUpdate && (
            <div className="p-4 space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Template Settings</h4>
               <TextField
                label="Title"
                value={templateData.title ?? ""}
                onChange={(e) => onTemplateUpdate("title", e.target.value)}
              />
              <TextAreaField
                label="Description"
                value={templateData.description ?? ""}
                onChange={(e) => onTemplateUpdate("description", e.target.value)}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                 <SelectField
                    label="Category"
                    value={templateData.category ?? "letterhead"}
                    onChange={(e) => onTemplateUpdate("category", e.target.value)}
                    options={CATEGORIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
                  />
                  <SelectField
                    label="Status"
                    value={templateData.status ?? "draft"}
                    onChange={(e) => onTemplateUpdate("status", e.target.value)}
                    options={STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
                  />
              </div>
              <ImageUpload
                label="Thumbnail"
                value={templateData.thumbnail_url ?? ""}
                onChange={(url) => onTemplateUpdate("thumbnail_url", url)}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Width (px)" type="number" value={templateData.canvas_width ?? 794} onChange={(e) => onTemplateUpdate("canvas_width", parseInt(e.target.value))} />
                <TextField label="Height (px)" type="number" value={templateData.canvas_height ?? 1123} onChange={(e) => onTemplateUpdate("canvas_height", parseInt(e.target.value))} />
              </div>
            </div>
          )}

          {rightTab === 'properties' && !selectedElement && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
               <div className="mb-4 rounded-full bg-slate-50 p-4">
                  <Type size={32} />
               </div>
               <p className="text-[11px] font-bold uppercase tracking-wide">No element selected</p>
               <p className="mt-1 text-xs text-slate-400">Click any component on the canvas to edit its properties</p>
               <Button 
                variant="secondary" 
                size="sm" 
                className="mt-6 font-bold" 
                onClick={() => setRightTab('settings')}
               >
                 VIEW TEMPLATE SETTINGS
               </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}

function ToolbarBtn({
  children,
  active,
  onMouseDown,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  title?: string;
}) {
  return (
    <button
      title={title}
      onMouseDown={onMouseDown}
      className={`w-8 h-7 flex items-center justify-center rounded-lg transition-colors text-sm ${
        active
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

function SidebarTab({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 py-2.5 transition-all relative ${
        active ? 'text-slate-900 bg-white shadow-sm ring-1 ring-slate-100 rounded-md' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={14} />
      <span className="text-[11px] font-bold uppercase tracking-tight">{label}</span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full mx-6" />}
    </button>
  );
}

function AddButton({ onClick, icon: Icon, label, sub }: { onClick: () => void, icon: any, label: string, sub: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all group text-left"
    >
      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold text-slate-900 uppercase tracking-tighter">{label}</div>
        <div className="text-[10px] text-slate-400 truncate mt-0.5">{sub}</div>
      </div>
    </button>
  );
}
