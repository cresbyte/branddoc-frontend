import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import * as Slider from '@radix-ui/react-slider';
import { useDropzone } from 'react-dropzone';
import { 
  Trash2, Copy, Move, Maximize, RotateCw, 
  Type, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Upload, Image as ImageIcon, Search as SearchIcon, Shapes
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { KonvaElement } from '@/hooks/useTemplateCanvas';
import { adminUploadAsset, getIcons } from '@/services/templates';
import IconLibraryPanel from './IconLibraryPanel';
import type { IconWithVariants, IconVariantDetail } from '@/lib/svgUtils';

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

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Convert to base64 for immediate preview (as requested)
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      onChange({ asset_url: dataUrl });
      
      // TODO: replace with actual S3 upload when ready
      try {
        // We could also call the API here if we want to persist it as an asset
        // await adminUploadAsset({ name: file.name, file_url: dataUrl, asset_type: 'image', template: templateId });
      } catch (err) {
        console.error('Asset upload failed', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'image/svg+xml': [] },
    multiple: false,
  });

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
            <button onClick={onDuplicate} className="p-1 text-gray-400 hover:text-blue-600"><Copy size={16} /></button>
            <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500">Placeholder Hint</label>
          <input
            type="text"
            value={element.placeholder_hint || ''}
            onChange={(e) => onChange({ placeholder_hint: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="e.g. {{company_name}}"
          />
        </div>

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
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Position & Size</h4>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="X" value={element.x} subLabel={`${pctX}%`} onChange={(v) => onChange({ x: v })} />
          <NumberInput label="Y" value={element.y} subLabel={`${pctY}%`} onChange={(v) => onChange({ y: v })} />
          <NumberInput label="Width" value={element.width} subLabel={`${pctW}%`} onChange={(v) => onChange({ width: v })} />
          <NumberInput label="Height" value={element.height} subLabel={`${pctH}%`} onChange={(v) => onChange({ height: v })} />
        </div>
        <div className="space-y-1 mt-2">
          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <RotateCw size={12} /> Rotation
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={Math.round(element.rotation)}
              onChange={(e) => onChange({ rotation: parseInt(e.target.value) || 0 })}
              className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <span className="text-xs text-gray-400">degrees</span>
          </div>
        </div>
      </div>

      {/* Section 3b: Contact Block Properties */}
      {element.element_type === 'contact_block' && (
        <div className="p-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Contact Block Properties</h4>
          
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500">Current Icon</label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded capitalize">
                  {element.placeholder_hint || 'Contact'}
                </span>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Variant</label>
                <div className="flex gap-1 flex-wrap">
                  {availableVariants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => onChange({ 
                        icon_variant_id: v.id, 
                        icon_variant_detail: { ...v, icon_name: currentIcon?.name || element.placeholder_hint } 
                      })}
                      className={`px-2 py-1 rounded bg-gray-50 border text-[10px] font-medium transition-all capitalize ${
                        element.icon_variant_id === v.id ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {v.variant}
                    </button>
                  ))}
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Icon Color</label>
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-2 text-sm"
                  >
                    <div className="h-6 w-6 rounded-md border border-gray-100 shadow-inner" style={{ backgroundColor: element.icon_color || '#000000' }} />
                    <span className="font-mono">{element.icon_color || '#000000'}</span>
                  </button>
                  {showColorPicker && (
                    <div className="absolute right-0 top-full z-20 mt-2 rounded-xl bg-white p-3 shadow-2xl ring-1 ring-black/5">
                      <HexColorPicker color={element.icon_color || '#000000'} onChange={(c) => onChange({ icon_color: c })} />
                    </div>
                  )}
                </div>
             </div>

             <RangeSlider label="Icon Size" value={element.icon_size} min={10} max={64} step={1} onChange={(v) => onChange({ icon_size: v })} />
             <RangeSlider label="Gap" value={element.icon_text_gap} min={0} max={40} step={1} onChange={(v) => onChange({ icon_text_gap: v })} />

             <div className="pt-2">
                <button
                  onClick={() => setShowIconPickerModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Shapes size={14} />
                  CHANGE ICON
                </button>
             </div>
          </div>

          <div className="h-px bg-gray-100 my-2" />

          <div className="space-y-3">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Label Text</h4>
             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Content</label>
                <input
                  type="text"
                  value={element.content || ''}
                  onChange={(e) => onChange({ content: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
             </div>

             <RangeSlider label="Font Size" value={element.font_size} min={6} max={48} step={0.5} onChange={(v) => onChange({ font_size: v })} />
             
             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Text Color</label>
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-2 text-sm"
                  >
                    <div className="h-6 w-6 rounded-md border border-gray-100 shadow-inner" style={{ backgroundColor: element.color }} />
                    <span className="font-mono">{element.color}</span>
                  </button>
                  {showColorPicker && (
                    <div className="absolute right-0 top-full z-20 mt-2 rounded-xl bg-white p-3 shadow-2xl ring-1 ring-black/5">
                      <HexColorPicker color={element.color} onChange={(c) => onChange({ color: c })} />
                    </div>
                  )}
                </div>
             </div>

             <div className="flex gap-2">
                <SegmentedControl 
                  options={[{ label: <Bold size={14} />, value: 'bold' }, { label: 'N', value: 'normal' }]}
                  value={element.font_weight === 'bold' ? 'bold' : 'normal'}
                  onChange={(v) => onChange({ font_weight: v as string })}
                />
                <SegmentedControl 
                  options={[{ label: <Italic size={14} />, value: 'italic' }, { label: 'N', value: 'normal' }]}
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
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Style Properties</h4>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Color</label>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-2 text-sm"
              >
                <div className="h-6 w-6 rounded-md border border-gray-100 shadow-inner" style={{ backgroundColor: element.background_color }} />
                <span className="font-mono">{element.background_color}</span>
              </button>
              {showColorPicker && (
                <div className="absolute right-0 top-full z-20 mt-2 rounded-xl bg-white p-3 shadow-2xl ring-1 ring-black/5">
                  <HexColorPicker color={element.background_color} onChange={(c) => onChange({ background_color: c })} />
                </div>
              )}
            </div>
          </div>

          {element.element_type === 'shape' && (
            <RangeSlider label="Border Radius" value={element.border_radius} min={0} max={100} step={1} onChange={(v) => onChange({ border_radius: v })} />
          )}
          <RangeSlider label="Opacity" value={element.opacity} min={0} max={1} step={0.01} onChange={(v) => onChange({ opacity: v })} />
        </div>
      )}

      {/* Section 5: Image/SVG */}
      {(element.element_type === 'image' || element.element_type === 'svg') && (
        <div className="p-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Asset Properties</h4>
          
          <div className="flex gap-4 items-center">
            <div className="h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
              {element.asset_url ? (
                <img src={element.asset_url} className="w-full h-full object-contain" alt="Asset" />
              ) : (
                <ImageIcon className="text-gray-300" size={24} />
              )}
            </div>
            <div className="flex-1 space-y-2">
               <div {...getRootProps()} className={`p-3 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors ${isDragActive ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}>
                  <input {...getInputProps()} />
                  <Upload size={16} className="text-blue-600" />
                  <span className="text-[10px] font-bold text-blue-700">UPLOAD ASSET</span>
               </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Asset URL</label>
            <input
              type="text"
              value={element.asset_url || ''}
              onChange={(e) => onChange({ asset_url: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Object Fit</label>
            <SegmentedControl 
              options={[{ label: 'Contain', value: 'contain' }, { label: 'Cover', value: 'cover' }, { label: 'Fill', value: 'fill' }]}
              value={element.object_fit}
              onChange={(v) => onChange({ object_fit: v as string })}
            />
          </div>

          <RangeSlider label="Opacity" value={element.opacity} min={0} max={1} step={0.01} onChange={(v) => onChange({ opacity: v })} />
        </div>
      )}

      {/* Section 6: Z-Index */}
      <div className="p-4 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Layering</h4>
        <div className="space-y-1 mt-2">
          <label className="text-xs font-semibold text-gray-500">Z-Index</label>
          <input
            type="number"
            value={element.z_index}
            onChange={(e) => onChange({ z_index: parseInt(e.target.value) || 0 })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'text': return 'bg-blue-100 text-blue-600';
    case 'contact_block': return 'bg-indigo-100 text-indigo-600';
    case 'shape': return 'bg-purple-100 text-purple-600';
    case 'line': return 'bg-gray-100 text-gray-600';
    case 'image': return 'bg-amber-100 text-amber-600';
    case 'svg': return 'bg-emerald-100 text-emerald-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function NumberInput({ label, value, subLabel, onChange }: { label: string, value: number, subLabel: string, onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <div className="text-[10px] text-gray-400 font-medium">{subLabel}</div>
    </div>
  );
}

function BooleanToggle({ label, value, onChange }: { label: string, value: boolean, onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div 
        onClick={() => onChange(!value)}
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${value ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'}`}
      >
        {value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors font-medium">{label}</span>
    </label>
  );
}

function SegmentedControl({ options, value, onChange }: { options: { label: React.ReactNode, value: string }[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-50 p-1 border border-gray-200">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex items-center justify-center py-1 px-3 rounded-md text-xs font-medium transition-all ${
            value === opt.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
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
      <div className="flex justify-between items-center text-xs">
        <label className="font-semibold text-gray-500">{label}</label>
        <span className="font-medium text-gray-900">{typeof value === 'number' && (label.includes('Opacity') ? `${Math.round(value * 100)}%` : value.toFixed(1))}</span>
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
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-500 shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </Slider.Root>
    </div>
  );
}
