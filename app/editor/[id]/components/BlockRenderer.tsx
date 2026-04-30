import React, { useEffect, useState } from "react";
import { Block, sampleBrand } from "./types";
import { GripVertical, Trash2, Copy, Plus } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

interface BlockRendererProps {
  block: Block;
  index: number;
  isSelected: boolean;
  isPreview: boolean;
  onSelect: (id: string) => void;
  updateBlockContent: (id: string, updates: any) => void;
  deleteBlock: (id: string, e?: React.MouseEvent) => void;
  duplicateBlock: (id: string, e?: React.MouseEvent) => void;
  addBlockAbove: (id: string, type: string, e?: React.MouseEvent) => void;
  handleDragStart: (e: React.DragEvent, item: any) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  dropIndicator: number | null;
}

export function BlockRenderer({
  block,
  index,
  isSelected,
  isPreview,
  onSelect,
  updateBlockContent,
  deleteBlock,
  duplicateBlock,
  addBlockAbove,
  handleDragStart,
  handleDragOver,
  handleDrop,
  dropIndicator
}: BlockRendererProps) {
  
  // Initialize Tiptap Editor for Text Blocks
  const isEditableText = ['heading', 'subheading', 'paragraph', 'blockquote'].includes(block.type);
  
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: block.content.text || "",
    editable: !isPreview,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Keep state in sync without forcing re-renders of the whole page on every keystroke
      updateBlockContent(block.id, { text: editor.getHTML() });
    },
  });

  // Whenever external content changes (e.g. undo), we sync Tiptap
  // This is a simplified reliable sync approach
  useEffect(() => {
    if (editor && block.content.text !== editor.getHTML()) {
       // A deeper check can be done, but keeping it simple to prevent cursor jumps
       // if we only update on external events
       if (document.activeElement?.closest('.ProseMirror') === editor.view.dom) return;
       editor.commands.setContent(block.content.text);
    }
  }, [block.content.text, editor]);

  let innerContent = null;

  switch (block.type) {
    case "heading":
    case "subheading":
    case "paragraph":
      const Tag = block.type === "heading" ? "h1" : block.type === "subheading" ? "h2" : "p";
      // We wrap the tiptap editor with our own inline styles context so it looks right
      innerContent = (
        <div style={{
          fontSize: `${block.style.fontSize}px`,
          fontWeight: block.style.fontWeight || (block.type === 'heading' ? 600 : 400),
          color: block.style.color,
          textAlign: block.style.textAlign || "left",
          lineHeight: block.style.lineHeight || 1.5,
          margin: 0
        }}>
          {editor && !isPreview && isSelected && (
            <BubbleMenu editor={editor} className="flex bg-white shadow-lg border rounded-md p-1 gap-1 -translate-y-2 z-50">
              <button 
                onClick={() => editor.chain().focus().toggleBold().run()} 
                className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
              >
                B
              </button>
              <button 
                onClick={() => editor.chain().focus().toggleItalic().run()} 
                className={`p-1.5 rounded hover:bg-gray-100 italic ${editor.isActive('italic') ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
              >
                I
              </button>
              <button 
                onClick={() => editor.chain().focus().toggleUnderline().run()} 
                className={`p-1.5 rounded hover:bg-gray-100 underline ${editor.isActive('underline') ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
              >
                U
              </button>
              <div className="w-[1px] bg-gray-200 h-6 my-auto mx-1"></div>
              {/* Preset colors for brevity */}
              <button onClick={() => editor.chain().focus().setColor('#ef4444').run()} className="w-6 h-6 rounded-full bg-red-500 my-auto ml-1 border hover:scale-110 transition-transform"></button>
              <button onClick={() => editor.chain().focus().setColor('#3b82f6').run()} className="w-6 h-6 rounded-full bg-blue-500 my-auto border hover:scale-110 transition-transform"></button>
              <button onClick={() => editor.chain().focus().setColor('#1a1a1a').run()} className="w-6 h-6 rounded-full bg-[#1a1a1a] mr-1 my-auto border hover:scale-110 transition-transform"></button>
            </BubbleMenu>
          )}
          <EditorContent editor={editor} className="outline-none" />
        </div>
      );
      break;
    case "divider":
      innerContent = (
        <div style={{ padding: `${block.style.marginTop || 8}px 0 ${block.style.marginBottom || 8}px 0`, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: block.style.width === "75%" ? "75%" : block.style.width === "50%" ? "50%" : "100%",
            borderBottom: `${block.style.thickness}px ${block.style.style || 'solid'} ${block.style.color}`
          }} />
        </div>
      );
      break;
    case "spacer":
      innerContent = <div style={{ height: `${block.style.height}px` }} />;
      break;
    case "two-columns":
      innerContent = (
        <div style={{ display: "flex", gap: `${block.style.gap}px` }}>
          <div style={{ flex: block.style.split === '50/50' ? 1 : block.style.split === '60/40' ? 1.5 : block.style.split === '40/60' ? 0.66 : block.style.split === '70/30' ? 2.33 : 1 }}>
            {block.content.left?.heading && <h3 style={{ fontWeight: 600, marginBottom: "8px", color: "#1a1a1a", fontSize: "14px" }}>{block.content.left.heading}</h3>}
            {block.content.left?.items?.length > 0 && (
              <ul className="list-disc pl-5" style={{ fontSize: "14px", color: "#444444" }}>
                {block.content.left.items.map((item: string, i: number) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
          <div style={{ flex: block.style.split === '50/50' ? 1 : block.style.split === '60/40' ? 0.66 : block.style.split === '40/60' ? 1.5 : block.style.split === '70/30' ? 0.42 : 1 }}>
            {block.content.right?.heading && <h3 style={{ fontWeight: 600, marginBottom: "8px", color: "#1a1a1a", fontSize: "14px" }}>{block.content.right.heading}</h3>}
            {block.content.right?.items?.length > 0 && (
              <ul className="list-disc pl-5" style={{ fontSize: "14px", color: "#444444" }}>
                {block.content.right.items.map((item: string, i: number) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>
      );
      break;
    case "table":
      innerContent = (
        <table className="w-full text-left border-collapse" style={{ fontSize: "14px", color: "#1a1a1a" }}>
          <thead>
            <tr style={{ backgroundColor: block.style.headerBg }}>
              {block.content.headers?.map((h: string, i: number) => (
                <th key={i} className="p-3 border-b" style={{ borderColor: block.style.borderStyle === 'none' ? 'transparent' : '#e5e5e5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.content.rows?.map((row: string[], i: number) => (
              <tr key={i} style={{ backgroundColor: block.style.alternating && i % 2 === 1 ? "#fafafa" : "transparent" }}>
                {row.map((cell: string, j: number) => (
                  <td key={j} className="p-3 border-b" style={{ borderColor: block.style.borderStyle === 'none' ? 'transparent' : '#e5e5e5' }}>{cell}</td>
                ))}
              </tr>
            ))}
            {block.content.totalsRow && (
              <tr>
                <td colSpan={block.content.headers?.length || 1} className="p-3 text-right font-medium" style={{ borderTop: block.style.borderStyle !== 'none' ? '2px solid #e5e5e5' : 'none' }}>
                  {block.content.totalsRow}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
      break;
    case "signature":
      innerContent = (
        <div style={{ marginTop: "24px", color: "#1a1a1a", fontSize: "14px" }}>
          <p>{block.content.closing}</p>
          {block.style.showLine && (
            <div style={{ marginTop: "40px", marginBottom: "8px", width: "200px", borderBottom: block.style.lineStyle === 'dotted' ? '2px dotted #1a1a1a' : '1px solid #1a1a1a' }}></div>
          )}
          {!block.style.showLine && <div style={{ height: "40px" }} />}
          {block.style.lineStyle === "Sign here" && <p className="text-xs text-gray-400 mt-[-4px] mb-2">Sign here</p>}
          <p style={{ fontWeight: 500 }}>{block.content.name} — {block.content.title} — {block.content.email}</p>
        </div>
      );
      break;
    case "bullet-list":
      innerContent = (
        <ul style={{ listStyleType: block.style.listStyleType || "disc", paddingLeft: "1.5rem", fontSize: `${block.style.fontSize || 14}px`, color: block.style.color || "#444444" }}>
          {block.content.items?.map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      );
      break;
    case "brand-color-bar":
      const color = block.style.color === 'Secondary' ? sampleBrand.secondaryColor : sampleBrand.primaryColor;
      innerContent = <div style={{ width: "100%", height: `${block.style.height || 4}px`, backgroundColor: color }} />;
      break;
    default:
      innerContent = <div className="text-gray-400 italic">[{block.type}] block placeholder</div>;
  }

  if (isPreview) {
    return (
      <div key={block.id} style={{ padding: "8px 0" }}>
        {innerContent}
      </div>
    );
  }

  return (
    <div key={block.id}>
      {/* Drop zone above */}
      <div 
        className="h-2 w-full transition-colors relative"
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
      >
        {dropIndicator === index && (
          <div className="absolute inset-0 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 z-10" />
            <div className="h-[2px] bg-blue-500 w-full" />
          </div>
        )}
      </div>

      {/* Block Body */}
      <div 
        className={`relative group cursor-text p-2 -mx-2 transition-all border-l-2 ${isSelected ? 'border-blue-500 bg-blue-50/20' : 'border-transparent hover:border-blue-200'}`}
        onClick={() => {
          onSelect(block.id);
          editor?.commands.focus();
        }}
      >
        {/* Action Bar (Hover) */}
        <div className="absolute top-0 -left-6 opacity-0 group-hover:opacity-100 flex items-center h-full cursor-grab">
          <div 
            draggable 
            onDragStart={(e) => handleDragStart(e, { id: block.id, type: block.type, isSidebar: false })}
            className="p-1 hover:bg-gray-100 rounded text-gray-400"
          >
            <GripVertical size={16} />
          </div>
        </div>

        <div className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10 p-1 bg-white border shadow-sm rounded">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500" onClick={(e) => duplicateBlock(block.id, e)}><Copy size={14} /></button>
          <button className="p-1 hover:bg-red-50 rounded text-red-500" onClick={(e) => deleteBlock(block.id, e)}><Trash2 size={14} /></button>
        </div>

        {/* Add Block Above Button */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 z-10">
          <button 
            className="w-6 h-6 bg-white border border-blue-200 rounded-full flex items-center justify-center text-blue-500 shadow-sm hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              addBlockAbove(block.id, "paragraph", e);
            }}
            title="Add block above"
          >
            <Plus size={14} />
          </button>
        </div>

        {innerContent}
      </div>
    </div>
  );
}
