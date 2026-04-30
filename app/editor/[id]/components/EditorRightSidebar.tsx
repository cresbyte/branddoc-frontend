import React from "react";
import { Block, sampleBrand } from "./types";
import { AlignLeft } from "lucide-react";

interface EditorRightSidebarProps {
  selectedBlockId: string | null;
  blocks: Block[];
  updateBlockContent: (id: string, updates: any) => void;
  updateBlockStyle: (id: string, updates: any) => void;
}

export function EditorRightSidebar({ selectedBlockId, blocks, updateBlockContent, updateBlockStyle }: EditorRightSidebarProps) {
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="w-[280px] bg-white border-l flex flex-col flex-shrink-0 hidden md:flex">
      <div className="p-4 border-b font-medium text-sm flex-shrink-0 bg-gray-50/50">
        {selectedBlockId ? 'Block properties' : 'Document settings'}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {!selectedBlockId && (
          <>
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Document state</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-500 mb-1">Page size</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="size" defaultChecked className="accent-[#1a1a1a]" /> A4</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="size" disabled /> Letter</label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Margins</label>
                  <select className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Normal (2.54cm)</option>
                    <option>Narrow (1.27cm)</option>
                    <option>Wide (3.81cm)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Font family</label>
                  <select className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Poppins</option>
                    <option>Inter</option>
                    <option>Lato</option>
                    <option>Playfair Display</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Base font size</label>
                  <input type="number" defaultValue={14} className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Line height</label>
                  <select className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" defaultValue="1.7">
                    <option>1.5</option>
                    <option>1.6</option>
                    <option>1.7</option>
                    <option>1.8</option>
                    <option>2.0</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Brand</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-gray-500 mb-2">
                  <span>Colors</span>
                  <a href="#" className="text-blue-500 hover:underline">Edit brand</a>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: sampleBrand.primaryColor }} title="Primary" />
                   <div className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: sampleBrand.secondaryColor }} title="Secondary" />
                </div>
                <div className="mt-4 text-gray-500">
                  Font: <span className="font-medium text-gray-900">{sampleBrand.font}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedBlock && selectedBlock.type === 'heading' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Text Attributes</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-gray-500 mb-1">Size</label>
                    <input type="number" value={selectedBlock.style.fontSize} onChange={(e) => updateBlockStyle(selectedBlockId!, { fontSize: Number(e.target.value) })} className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-500 mb-1">Color</label>
                    <input type="color" value={selectedBlock.style.color} onChange={(e) => updateBlockStyle(selectedBlockId!, { color: e.target.value })} className="w-full h-[32px] border rounded" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Weight</label>
                  <div className="flex bg-gray-100 p-1 rounded">
                    <button className={`flex-1 py-1 rounded text-xs ${selectedBlock.style.fontWeight === 400 ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`} onClick={() => updateBlockStyle(selectedBlockId!, { fontWeight: 400 })}>Reg</button>
                    <button className={`flex-1 py-1 rounded text-xs ${selectedBlock.style.fontWeight === 500 ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`} onClick={() => updateBlockStyle(selectedBlockId!, { fontWeight: 500 })}>Med</button>
                    <button className={`flex-1 py-1 rounded text-xs ${selectedBlock.style.fontWeight === 600 ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`} onClick={() => updateBlockStyle(selectedBlockId!, { fontWeight: 600 })}>Bold</button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Alignment</label>
                  <div className="flex bg-gray-100 p-1 rounded w-fit">
                    <button className={`px-3 py-1 rounded ${selectedBlock.style.textAlign === 'left' ? 'bg-white shadow-sm' : 'text-gray-500'}`} onClick={() => updateBlockStyle(selectedBlockId!, { textAlign: 'left' })}><AlignLeft size={14} /></button>
                    <button className={`px-3 py-1 rounded ${selectedBlock.style.textAlign === 'center' ? 'bg-white shadow-sm' : 'text-gray-500'}`} onClick={() => updateBlockStyle(selectedBlockId!, { textAlign: 'center' })}>C</button>
                    <button className={`px-3 py-1 rounded ${selectedBlock.style.textAlign === 'right' ? 'bg-white shadow-sm' : 'text-gray-500'}`} onClick={() => updateBlockStyle(selectedBlockId!, { textAlign: 'right' })}>R</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedBlock && selectedBlock.type === 'paragraph' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Text Attributes</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-gray-500 mb-1">Size</label>
                    <input type="number" value={selectedBlock.style.fontSize} onChange={(e) => updateBlockStyle(selectedBlockId!, { fontSize: Number(e.target.value) })} className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-500 mb-1">Line Height</label>
                    <input type="number" step="0.1" value={selectedBlock.style.lineHeight} onChange={(e) => updateBlockStyle(selectedBlockId!, { lineHeight: Number(e.target.value) })} className="w-full border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedBlock && selectedBlock.type === 'table' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Table</h3>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={selectedBlock.style.alternating} onChange={(e) => updateBlockStyle(selectedBlockId!, { alternating: e.target.checked })} /> Alternating rows</label>
                <div>
                  <label className="block text-gray-500 mb-1">Header background</label>
                  <input type="color" value={selectedBlock.style.headerBg} onChange={(e) => updateBlockStyle(selectedBlockId!, { headerBg: e.target.value })} className="w-full h-[32px] border rounded" />
                </div>
                <p className="text-xs text-gray-400">Advanced table editing is done on the canvas.</p>
              </div>
            </div>
          </div>
        )}
        
        {selectedBlock && !['heading', 'paragraph', 'table'].includes(selectedBlock.type) && (
          <div className="text-sm text-gray-500 italic">
            Properties panel for {selectedBlock.type} selected. Editing text content is done inline on the canvas.
          </div>
        )}
      </div>
    </div>
  );
}
