"use client";

import React, { useState } from "react";
import { ArrowLeft, Undo, Redo, ZoomIn, ZoomOut, X } from "lucide-react";
import { Block, BlockType } from "./components/types";
import { initialBlocks, getDefaultForType } from "./components/constants";
import { EditorLeftSidebar } from "./components/EditorLeftSidebar";
import { EditorRightSidebar } from "./components/EditorRightSidebar";
import { EditorCanvas } from "./components/EditorCanvas";
import { BlockRenderer } from "./components/BlockRenderer";
// Note: We reuse BlockRenderer in the Preview Modal below, so we import it too.

export default function EditorPage() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<{ id?: string, type?: BlockType, isSidebar?: boolean } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<number | null>(null);

  // Undo/Redo (basic history)
  const [history, setHistory] = useState<Block[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [documentTitle, setDocumentTitle] = useState("Untitled document");
  const [showPreview, setShowPreview] = useState(false);
  
  const saveHistory = (newBlocks: Block[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setBlocks(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
      setSelectedBlockId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setBlocks(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
      setSelectedBlockId(null);
    }
  };

  const updateBlockContent = (id: string, contentUpdates: any) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...contentUpdates } } : b);
    setBlocks(newBlocks);
    saveHistory(newBlocks);
  };

  const updateBlockStyle = (id: string, styleUpdates: any) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, style: { ...b.style, ...styleUpdates } } : b);
    setBlocks(newBlocks);
    saveHistory(newBlocks);
  };

  const deleteBlock = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);
    if (selectedBlockId === id) setSelectedBlockId(null);
    saveHistory(newBlocks);
  };

  const duplicateBlock = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const idx = blocks.findIndex(b => b.id === id);
    if (idx === -1) return;
    const blockToCopy = blocks[idx];
    const newBlock = { ...blockToCopy, id: `b-${Date.now()}` };
    const newBlocks = [...blocks.slice(0, idx + 1), newBlock, ...blocks.slice(idx + 1)];
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    saveHistory(newBlocks);
  };

  const addBlockAbove = (id: string, type: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const idx = blocks.findIndex(b => b.id === id);
    if (idx === -1) return;
    const blockType = type as BlockType;
    const newBlock: Block = {
      id: `b-${Date.now()}`,
      type: blockType,
      content: getDefaultForType(blockType).content,
      style: getDefaultForType(blockType).style
    };
    const newBlocks = [...blocks.slice(0, idx), newBlock, ...blocks.slice(idx)];
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    saveHistory(newBlocks);
  };

  const handleDragStart = (e: React.DragEvent, item: { id?: string, type?: BlockType, isSidebar?: boolean }) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropIndicator(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    let newBlocks = [...blocks];

    if (draggedItem.isSidebar && draggedItem.type) {
      const newBlock: Block = {
        id: `b-${Date.now()}`,
        type: draggedItem.type,
        content: getDefaultForType(draggedItem.type).content,
        style: getDefaultForType(draggedItem.type).style
      };
      newBlocks.splice(dropIndex, 0, newBlock);
      setSelectedBlockId(newBlock.id);
    } else if (draggedItem.id) {
      const currentIndex = newBlocks.findIndex(b => b.id === draggedItem.id);
      if (currentIndex === -1) return;
      const [movedBlock] = newBlocks.splice(currentIndex, 1);
      const adjustedDropIndex = currentIndex < dropIndex ? dropIndex - 1 : dropIndex;
      newBlocks.splice(adjustedDropIndex, 0, movedBlock);
    }

    setBlocks(newBlocks);
    saveHistory(newBlocks);
    setDraggedItem(null);
    setDropIndicator(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      {/* TOOLBAR */}
      <div className="h-[52px] bg-white border-b flex items-center justify-between px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft size={16} /> Back to templates
          </a>
          <div className="h-5 w-[1px] bg-gray-200" />
          <input 
            type="text" 
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-[15px] font-medium border-none outline-none focus:ring-1 focus:ring-blue-100 rounded px-2 py-1 placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-3 text-gray-500">
          <button 
            className={`p-1.5 rounded ${historyIndex > 0 ? 'hover:bg-gray-100 text-gray-700' : 'opacity-40 cursor-not-allowed'}`}
            onClick={undo}
            disabled={historyIndex === 0}
          >
            <Undo size={16} />
          </button>
          <button 
            className={`p-1.5 rounded ${historyIndex < history.length - 1 ? 'hover:bg-gray-100 text-gray-700' : 'opacity-40 cursor-not-allowed'}`}
            onClick={redo}
            disabled={historyIndex === history.length - 1}
          >
            <Redo size={16} />
          </button>
          <div className="h-5 w-[1px] bg-gray-200 mx-1" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <button className="p-1 hover:bg-gray-100 rounded"><ZoomOut size={16} /></button>
            <span className="w-10 text-center">100%</span>
            <button className="p-1 hover:bg-gray-100 rounded"><ZoomIn size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowPreview(true)}
            className="px-3 py-1.5 text-sm font-medium border rounded hover:bg-gray-50 bg-white shadow-sm"
          >
            Preview
          </button>
          <div className="h-5 w-[1px] bg-gray-200" />
          <select className="bg-transparent text-sm font-medium outline-none">
            <option>Word (.docx)</option>
            <option>Google Docs (.docx)</option>
            <option>PDF preview</option>
          </select>
          <button className="px-4 py-1.5 text-sm font-medium bg-[#1a1a1a] text-white rounded hover:bg-black shadow-sm">
            Pay $4.99 & download
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        
        <EditorLeftSidebar handleDragStart={handleDragStart} />

        <EditorCanvas 
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectCallback={setSelectedBlockId}
          updateBlockContent={updateBlockContent}
          deleteBlock={deleteBlock}
          duplicateBlock={duplicateBlock}
          addBlockAbove={addBlockAbove}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          dropIndicator={dropIndicator}
        />

        <EditorRightSidebar 
          selectedBlockId={selectedBlockId}
          blocks={blocks}
          updateBlockContent={updateBlockContent}
          updateBlockStyle={updateBlockStyle}
        />

      </div>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-8">
          <div className="w-[700px] max-h-[90vh] bg-white rounded shadow-2xl relative flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-semibold">Document Preview</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-200 rounded text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 bg-gray-100 flex justify-center py-8">
              <div className="w-[680px] bg-white shadow-sm flex flex-col pointer-events-none p-8">
                {/* Note: Simplified fallback for preview, in reality EditorCanvas should separate the locked header/footer logic or we reuse them here */}
                <div className="flex-1 mx-8 py-4">
                  {blocks.map((block, index) => (
                      <BlockRenderer 
                        key={block.id}
                        block={block} 
                        index={index}
                        isSelected={false}
                        isPreview={true}
                        onSelect={() => {}}
                        updateBlockContent={() => {}}
                        deleteBlock={() => {}}
                        duplicateBlock={() => {}}
                        addBlockAbove={() => {}}
                        handleDragStart={() => {}}
                        handleDragOver={() => {}}
                        handleDrop={() => {}}
                        dropIndicator={null}
                      />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-white flex justify-end">
              <button 
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium border rounded hover:bg-gray-50 mr-3"
              >
                Close
              </button>
              <button className="px-6 py-2 text-sm font-medium bg-[#1a1a1a] text-white rounded hover:bg-black">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
