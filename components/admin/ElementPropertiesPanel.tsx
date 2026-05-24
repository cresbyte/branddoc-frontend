import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import * as Slider from '@radix-ui/react-slider';
import { 
  Trash2, Copy, Move, RotateCw, 
  Bold, Italic, Shapes, Pipette, RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { KonvaElement } from '@/hooks/useTemplateCanvas';
import { getIcons } from '@/services/templates';
import IconLibraryPanel from './IconLibraryPanel';
import type { IconWithVariants } from '@/lib/svgUtils';
import {
  extractSvgColors,
  fetchSvgText,
  recolorSvgText,
  svgTextToDataUrl,
} from '@/lib/svgColorUtils';

// Design System
import { TextField } from '@/components/DesignSystem/TextField';
import { SelectField } from '@/components/DesignSystem/SelectField';
import { Button } from '@/components/DesignSystem/Button';
import { ImageUpload } from '@/components/DesignSystem/ImageUpload';

interface ElementPropertiesPanelProps {
  element: KonvaElement | null;
  canvasWidth: number;
  canvasHeight: number;
  onChange: (changes: Partial<KonvaElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ElementPropertiesPanel({
  element,
  canvasWidth,
  canvasHeight,
  onChange,
  onDelete,
  onDuplicate,
}: ElementPropertiesPanelProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPickerModal, setShowIconPickerModal] = useState(false);
  // SVG color state
  const [svgText, setSvgText] = useState<string | null>(null);
  const [svgColors, setSvgColors] = useState<string[]>([]);
  const [svgColorLoading, setSvgColorLoading] = useState(false);
  const [editingColorIdx, setEditingColorIdx] = useState<number | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const { data: iconsData } = useQuery({
    queryKey: ['icons'],
    queryFn: () => getIcons(),
    staleTime: 10 * 60 * 1000,
    enabled: element?.element_type === 'contact_block',
  });

  const icons: IconWithVariants[] = iconsData?.results ?? iconsData ?? [];

  const currentIcon = icons.find(icon => 
    icon.variants.some(v => v.id === element?.icon_variant_id)
  );

  const availableVariants = currentIcon?.variants ?? 
    (element?.icon_variant_detail ? [element.icon_variant_detail] : []);

  // Fetch and parse SVG colors when an SVG element is selected
  useEffect(() => {
    if (element?.element_type !== 'svg' || !element.asset_url) {
      setSvgText(null);
      setSvgColors([]);
      setEditingColorIdx(null);
      return;
    }

    setSvgColorLoading(true);
    setSvgColors([]);
    setSvgText(null);
    setEditingColorIdx(null);

    fetchSvgText(element.asset_url)
      .then((text) => {
        setSvgText(text);
        setSvgColors(extractSvgColors(text));
      })
      .catch((err) => {
        console.warn('Could not fetch SVG for color extraction', err);
      })
      .finally(() => setSvgColorLoading(false));
  }, [element?.element_type, element?.asset_url]);

  // Close color picker on outside click
  useEffect(() => {
    if (editingColorIdx === null) return;
    const handler = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setEditingColorIdx(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [editingColorIdx]);

  const handleSvgColorChange = (oldColor: string, newColor: string) => {
    if (!svgText) return;
    const recolored = recolorSvgText(svgText, oldColor, newColor);
    setSvgText(recolored);
    setSvgColors(prev => prev.map(c => c.toLowerCase() === oldColor.toLowerCase() ? newColor : c));
    const dataUrl = svgTextToDataUrl(recolored);
    onChange({ asset_url: dataUrl });
  };

  if (!element) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
        <div className="mb-4 rounded-full bg-gray-50 p-4">
          <Move size={32} />
        </div>
        <p className="text-sm">Click any element on the canvas to edit its properties</p>
      </div>
    );
  }

  const pctX = ((element.x / canvasWidth) * 100).toFixed(1);
  const pctY = ((element.y / canvasHeight) * 100).toFixed(1);
  const pctW = ((element.width / canvasWidth) * 100).toFixed(1);
  const pctH = ((element.height / canvasHeight) * 100).toFixed(1);

  return (
    <div className="flex flex-col divide-y divide-gray-100 pb-20">
      {/* Section 1: Identity */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTypeColor(element.element_type)}`}>
            {element.element_type}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onDuplicate} className="p-1 h-8 w-8 text-slate-400 hover:text-slate-900" icon={Copy} />
            <Button variant="ghost" size="sm" onClick={onDelete} className="p-1 h-8 w-8 text-slate-400 hover:text-red-600" icon={Trash2} />
          </div>
        </div>

        <TextField
          label="Placeholder Hint"
          value={element.placeholder_hint || ''}
          onChange={(e) => onChange({ placeholder_hint: e.target.value })}
          placeholder="e.g. {{company_name}}"
        />

        <div className="flex flex-wrap gap-4">
          <BooleanToggle 
            label="Editable" 
            value={element.is_editable} 
            onChange={(val) => onChange({ is_editable: val })} 
          />
          <BooleanToggle 
            label="Locked" 
            value={element.is_locked} 
            onChange={(val) => onChange({ is_locked: val })} 
          />
          <BooleanToggle 
            label="Visible" 
            value={element.is_visible} 
            onChange={(val) => onChange({ is_visible: val })} 
          />
        </div>
      </div>

      {/* Section 2: Position & Size */}
      <div className="p-4 space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Position & Size</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <NumberInput label="X" value={element.x} subLabel={`${pctX}%`} onChange={(v) => onChange({ x: v })} />
          <NumberInput label="Y" value={element.y} subLabel={`${pctY}%`} onChange={(v) => onChange({ y: v })} />
          <NumberInput label="Width" value={element.width} subLabel={`${pctW}%`} onChange={(v) => onChange({ width: v })} />
          <NumberInput label="Height" value={element.height} subLabel={`${pctH}%`} onChange={(v) => onChange({ height: v })} />
        </div>
        <div className="mt-2">
           <TextField
            label="Rotation (degrees)"
            type="number"
            icon={RotateCw}
            value={Math.round(element.rotation)}
            onChange={(e) => onChange({ rotation: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Section 3: Text Properties */}
      {element.element_type === 'text' && (
        <div className="p-4 space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Text Style</h4>

          <TextField
            label="Content"
            value={element.content || ''}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Enter text content…"
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Font Family"
              value={element.font_family}
              onChange={(e) => onChange({ font_family: e.target.value })}
              options={[
                'Inter', 'Georgia', 'Times New Roman', 'Arial', 'Helvetica',
                'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display',
              ].map(f => ({ value: f, label: f }))}
            />
            <TextField
              label="Font Size"
              type="number"
              value={element.font_size}
              onChange={(e) => onChange({ font_size: parseFloat(e.target.value) || 12 })}
            />
          </div>

          <div className="flex gap-2">
            <SegmentedControl
              options={[{ label: <Bold size={14} />, value: 'bold' }, { label: 'Regular', value: 'normal' }]}
              value={element.font_weight === 'bold' ? 'bold' : 'normal'}
              onChange={(v) => onChange({ font_weight: v as string })}
            />
            <SegmentedControl
              options={[{ label: <Italic size={14} />, value: 'italic' }, { label: 'Regular', value: 'normal' }]}
              value={element.font_style === 'italic' ? 'italic' : 'normal'}
              onChange={(v) => onChange({ font_style: v as string })}
            />
          </div>

          <SelectField
            label="Text Align"
            value={element.text_align}
            onChange={(e) => onChange({ text_align: e.target.value })}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' },
            ]}
          />

          <ColorPickerField
            label="Text Color"
            color={element.color}
            onChange={(c) => onChange({ color: c })}
          />

          <RangeSlider label="Line Height" value={element.line_height} min={1} max={3} step={0.05} onChange={(v) => onChange({ line_height: v })} />
          <RangeSlider label="Letter Spacing" value={element.letter_spacing} min={-5} max={20} step={0.5} onChange={(v) => onChange({ letter_spacing: v })} />
          <RangeSlider label="Opacity" value={element.opacity} min={0} max={1} step={0.01} onChange={(v) => onChange({ opacity: v })} />
        </div>
      )}

      {/* Section 3b: Contact Block Properties */}
      {element.element_type === 'contact_block' && (
        <div className="p-4 space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact Block Properties</h4>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-slate-700">Current Icon</label>
                <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded capitalize">
                  {element.placeholder_hint || 'Contact'}
                </span>
             </div>

             <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-700">Variant</label>
                <div className="flex gap-1 flex-wrap">
                  {availableVariants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => onChange({ 
                        icon_variant_id: v.id, 
                        icon_variant_detail: { ...v, icon_name: currentIcon?.name || element.placeholder_hint } 
                      })}
                      className={`px-2 py-1 rounded bg-white border text-[10px] font-medium transition-all capitalize ${
                        element.icon_variant_id === v.id ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {v.variant}
                    </button>
                  ))}
                </div>
             </div>

             <ColorPickerField
               label="Icon Color"
               color={element.icon_color || '#000000'}
               onChange={(c) => onChange({ icon_color: c })}
             />

             <RangeSlider label="Icon Size" value={element.icon_size} min={10} max={64} step={1} onChange={(v) => onChange({ icon_size: v })} />
             <RangeSlider label="Gap" value={element.icon_text_gap} min={0} max={40} step={1} onChange={(v) => onChange({ icon_text_gap: v })} />

             <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowIconPickerModal(true)}
                  icon={Shapes}
                >
                  CHANGE ICON
                </Button>
             </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          <div className="space-y-4">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Label Text</h4>
             
             <TextField
              label="Content"
              value={element.content || ''}
              onChange={(e) => onChange({ content: e.target.value })}
            />

             <RangeSlider label="Font Size" value={element.font_size} min={6} max={48} step={0.5} onChange={(v) => onChange({ font_size: v })} />

             <ColorPickerField
               label="Text Color"
               color={element.color}
               onChange={(c) => onChange({ color: c })}
             />

             <div className="flex gap-2">
                <SegmentedControl 
                  options={[{ label: <Bold size={14} />, value: 'bold' }, { label: 'Regular', value: 'normal' }]}
                  value={element.font_weight === 'bold' ? 'bold' : 'normal'}
                  onChange={(v) => onChange({ font_weight: v as string })}
                />
                <SegmentedControl 
                  options={[{ label: <Italic size={14} />, value: 'italic' }, { label: 'Regular', value: 'normal' }]}
                  value={element.font_style === 'italic' ? 'italic' : 'normal'}
                  onChange={(v) => onChange({ font_style: v as string })}
                />
             </div>
          </div>

          {showIconPickerModal && (
            <IconLibraryPanel
              isOpen={showIconPickerModal}
              onClose={() => setShowIconPickerModal(false)}
              onAddContactBlock={(variant, color) => {
                const icon = icons.find(i => i.variants.some(v => v.id === variant.id));
                onChange({
                  icon_variant_id: variant.id,
                  icon_variant_detail: { ...variant, icon_name: icon?.name || variant.icon_name },
                  placeholder_hint: icon?.name || variant.icon_name,
                });
                setShowIconPickerModal(false);
              }}
            />
          )}
        </div>
      )}

      {/* Section 4: Shape/Background */}
      {(element.element_type === 'shape' || element.element_type === 'line') && (
        <div className="p-4 space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Style Properties</h4>
          
          <ColorPickerField
            label="Color"
            color={element.background_color}
            onChange={(c) => onChange({ background_color: c })}
          />

          {element.element_type === 'shape' && (
            <RangeSlider label="Border Radius" value={element.border_radius} min={0} max={100} step={1} onChange={(v) => onChange({ border_radius: v })} />
          )}
          <RangeSlider label="Opacity" value={element.opacity} min={0} max={1} step={0.01} onChange={(v) => onChange({ opacity: v })} />
        </div>
      )}

      {/* Section 5: Image/SVG */}
      {(element.element_type === 'image' || element.element_type === 'svg') && (
        <div className="p-4 space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Asset Properties</h4>
          
          <ImageUpload
            label="Upload Asset"
            value={element.asset_url || ''}
            onChange={(url) => onChange({ asset_url: url })}
          />

          <TextField
            label="Asset URL"
            value={element.asset_url || ''}
            onChange={(e) => onChange({ asset_url: e.target.value })}
            placeholder="https://..."
          />

          <SelectField
            label="Object Fit"
            value={element.object_fit}
            onChange={(e) => onChange({ object_fit: e.target.value })}
            options={[
              { label: 'Contain', value: 'contain' },
              { label: 'Cover', value: 'cover' },
              { label: 'Fill', value: 'fill' }
            ]}
          />

          <RangeSlider label="Opacity" value={element.opacity} min={0} max={1} step={0.01} onChange={(v) => onChange({ opacity: v })} />

          {/* SVG Color Detection — Canva-style */}
          {element.element_type === 'svg' && element.asset_url && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Pipette size={11} />
                  SVG Colors
                </h4>
                {svgColorLoading && (
                  <span className="text-[10px] text-slate-400 animate-pulse">Detecting…</span>
                )}
                {!svgColorLoading && svgText && (
                  <button
                    className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                    onClick={() => {
                      setSvgColorLoading(true);
                      fetchSvgText(element.asset_url!)
                        .then(t => { setSvgText(t); setSvgColors(extractSvgColors(t)); })
                        .finally(() => setSvgColorLoading(false));
                    }}
                  >
                    <RefreshCw size={9} /> Refresh
                  </button>
                )}
              </div>

              {!svgColorLoading && svgColors.length === 0 && svgText && (
                <p className="text-[11px] text-slate-400 italic">No editable colors detected in this SVG.</p>
              )}

              {!svgColorLoading && svgColors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500">Click a color swatch to edit it</p>
                  <div className="flex flex-wrap gap-2">
                    {svgColors.map((color, idx) => (
                      <div key={`${color}-${idx}`} className="relative" ref={editingColorIdx === idx ? colorPickerRef : undefined}>
                        <button
                          onClick={() => setEditingColorIdx(editingColorIdx === idx ? null : idx)}
                          className={`group relative flex flex-col items-center gap-1 transition-all`}
                          title={color}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl border-2 shadow-sm transition-all ${
                              editingColorIdx === idx
                                ? 'border-indigo-500 scale-110 shadow-indigo-200'
                                : 'border-slate-200 hover:border-slate-400 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-[8px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors">
                            {color.toUpperCase()}
                          </span>
                        </button>

                        {editingColorIdx === idx && (
                          <div className="absolute left-0 top-full mt-2 z-30 rounded-xl bg-white p-3 shadow-2xl ring-1 ring-black/5 min-w-[220px]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                              Replace color
                            </div>
                            <HexColorPicker
                              color={color}
                              onChange={(newColor) => handleSvgColorChange(color, newColor)}
                            />
                            <input
                              className="mt-2 w-full text-[11px] font-mono text-center border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                              value={color}
                              onChange={(e) => {
                                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                                  handleSvgColorChange(color, e.target.value.toLowerCase());
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Section 6: Z-Index */}
      <div className="p-4 space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Layering</h4>
        <TextField
          label="Z-Index"
          type="number"
          value={element.z_index}
          onChange={(e) => onChange({ z_index: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  );
}

// Reusable inline color picker field
function ColorPickerField({ label, color, onChange }: { label: string; color: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="space-y-2">
      <label className="text-[13px] font-semibold text-slate-700">{label}</label>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex w-full items-center gap-3 rounded-[10px] border-[1.5px] border-slate-200 bg-white p-2 text-sm transition-all focus:border-slate-900 hover:border-slate-300"
        >
          <div className="h-6 w-6 rounded-md border border-slate-100 shadow-inner flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="font-mono font-medium text-slate-900 text-[12px]">{color}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-full z-20 mt-2 rounded-xl bg-white p-3 shadow-2xl ring-1 ring-black/5">
            <HexColorPicker color={color} onChange={onChange} />
            <input
              className="mt-2 w-full text-[11px] font-mono text-center border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              value={color}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'text': return 'bg-blue-50 text-blue-600';
    case 'contact_block': return 'bg-purple-50 text-purple-600';
    case 'shape': return 'bg-emerald-50 text-emerald-600';
    case 'line': return 'bg-slate-100 text-slate-600';
    case 'image': return 'bg-amber-50 text-amber-600';
    case 'svg': return 'bg-rose-50 text-rose-600';
    default: return 'bg-slate-100 text-slate-900';
  }
}

function NumberInput({ label, value, subLabel, onChange }: { label: string, value: number, subLabel: string, onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <TextField
        label={label}
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      />
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight pl-1">{subLabel}</div>
    </div>
  );
}

function BooleanToggle({ label, value, onChange }: { label: string, value: boolean, onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div 
        onClick={() => onChange(!value)}
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${value ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300'}`}
      >
        {value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors font-semibold uppercase tracking-tight">{label}</span>
    </label>
  );
}

function SegmentedControl({ options, value, onChange }: { options: { label: React.ReactNode, value: string }[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 rounded-[10px] bg-slate-50 p-1 border border-slate-200">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded-md text-[11px] font-bold uppercase tracking-tight transition-all ${
            value === opt.value ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function RangeSlider({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[13px]">
        <label className="font-semibold text-slate-700">{label}</label>
        <span className="font-bold text-slate-900">{typeof value === 'number' && (label.includes('Opacity') ? `${Math.round(value * 100)}%` : value.toFixed(1))}</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        defaultValue={[value]}
        max={max}
        min={min}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track className="bg-slate-100 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-slate-900 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-slate-900 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
      </Slider.Root>
    </div>
  );
}
