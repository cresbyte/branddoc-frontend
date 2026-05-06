"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  X,
  FileText,
  Download,
  ChevronDown,
  Eye,
} from "lucide-react";
import { Block, BlockType } from "./components/types";
import { initialBlocks, getDefaultForType } from "./components/constants";
import { EditorLeftSidebar } from "./components/EditorLeftSidebar";
import { EditorRightSidebar } from "./components/EditorRightSidebar";
import { EditorCanvas } from "./components/EditorCanvas";
import { BlockRenderer } from "./components/BlockRenderer";

const ZOOM_STEPS = [50, 75, 90, 100, 110, 125, 150, 175, 200];

export default function EditorPage() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{
    id?: string;
    type?: BlockType;
    isSidebar?: boolean;
  } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<number | null>(null);
  const [history, setHistory] = useState<Block[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [documentTitle, setDocumentTitle] = useState("Untitled document");
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [exportFormat, setExportFormat] = useState("docx");
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  /* ── History ─────────────────────────────────────────────────────── */

  const saveHistory = (newBlocks: Block[]) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newBlocks);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
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

  /* ── Block mutations ──────────────────────────────────────────────── */

  const updateBlockContent = (id: string, contentUpdates: any) => {
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, content: { ...b.content, ...contentUpdates } } : b,
    );
    setBlocks(newBlocks);
    saveHistory(newBlocks);
  };

  const updateBlockStyle = (id: string, styleUpdates: any) => {
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, style: { ...b.style, ...styleUpdates } } : b,
    );
    setBlocks(newBlocks);
    saveHistory(newBlocks);
  };

  const deleteBlock = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    if (selectedBlockId === id) setSelectedBlockId(null);
    saveHistory(newBlocks);
  };

  const duplicateBlock = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const copy = { ...blocks[idx], id: `b-${Date.now()}` };
    const newBlocks = [...blocks.slice(0, idx + 1), copy, ...blocks.slice(idx + 1)];
    setBlocks(newBlocks);
    setSelectedBlockId(copy.id);
    saveHistory(newBlocks);
  };

  const addBlockAbove = (id: string, type: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const bt = type as BlockType;
    const def = getDefaultForType(bt);
    const newBlock: Block = { id: `b-${Date.now()}`, type: bt, ...def };
    const newBlocks = [...blocks.slice(0, idx), newBlock, ...blocks.slice(idx)];
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    saveHistory(newBlocks);
  };

  /** Append a new block at the end of the document (used by left sidebar click) */
  const insertBlock = (type: BlockType) => {
    const def = getDefaultForType(type);
    const newBlock: Block = { id: `b-${Date.now()}`, type, ...def };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    saveHistory(newBlocks);
  };

  /* ── Drag & drop ──────────────────────────────────────────────────── */

  const handleDragStart = (
    e: React.DragEvent,
    item: { id?: string; type?: BlockType; isSidebar?: boolean },
  ) => {
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
      const def = getDefaultForType(draggedItem.type);
      const newBlock: Block = { id: `b-${Date.now()}`, type: draggedItem.type, ...def };
      newBlocks.splice(dropIndex, 0, newBlock);
      setSelectedBlockId(newBlock.id);
    } else if (draggedItem.id) {
      const cur = newBlocks.findIndex((b) => b.id === draggedItem.id);
      if (cur === -1) return;
      const [moved] = newBlocks.splice(cur, 1);
      const adj = cur < dropIndex ? dropIndex - 1 : dropIndex;
      newBlocks.splice(adj, 0, moved);
    }

    setBlocks(newBlocks);
    saveHistory(newBlocks);
    setDraggedItem(null);
    setDropIndicator(null);
  };

  /* ── Zoom helpers ─────────────────────────────────────────────────── */

  const zoomIn = () => {
    const next = ZOOM_STEPS.find((z) => z > zoom);
    if (next) setZoom(next);
  };

  const zoomOut = () => {
    const prev = [...ZOOM_STEPS].reverse().find((z) => z < zoom);
    if (prev) setZoom(prev);
  };

  /* ── Export format display ────────────────────────────────────────── */

  const FORMAT_OPTIONS = [
    { value: "docx", label: "Word (.docx)" },
    { value: "pdf", label: "PDF" },
    { value: "gdocs", label: "Google Docs (.docx)" },
  ];

  const currentFormat = FORMAT_OPTIONS.find((f) => f.value === exportFormat)!;

  /* ── Render ───────────────────────────────────────────────────────── */

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">

      {/* ── TOOLBAR ── */}
      <div className="h-[54px] bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 flex-shrink-0 z-20">

        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors flex-shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </a>
          <div className="h-5 w-px bg-gray-200 flex-shrink-0" />
          <FileText size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-[14px] font-semibold text-gray-800 border-none outline-none focus:ring-2 focus:ring-blue-100 rounded-md px-2 py-1 placeholder-gray-300 min-w-0 max-w-[200px] bg-transparent"
            placeholder="Untitled document"
          />
        </div>

        {/* Center: undo/redo + zoom */}
        <div className="flex items-center gap-1 text-gray-400">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            title="Undo"
            className={`p-1.5 rounded-md transition-colors ${
              historyIndex > 0
                ? "hover:bg-gray-100 text-gray-600"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            title="Redo"
            className={`p-1.5 rounded-md transition-colors ${
              historyIndex < history.length - 1
                ? "hover:bg-gray-100 text-gray-600"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <Redo2 size={15} />
          </button>

          <div className="h-5 w-px bg-gray-200 mx-1.5 flex-shrink-0" />

          <button
            onClick={zoomOut}
            disabled={zoom <= ZOOM_STEPS[0]}
            title="Zoom out"
            className={`p-1.5 rounded-md transition-colors ${
              zoom > ZOOM_STEPS[0]
                ? "hover:bg-gray-100 text-gray-600"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="w-12 text-center text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md py-1.5 transition-colors tabular-nums"
            title="Reset zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            title="Zoom in"
            className={`p-1.5 rounded-md transition-colors ${
              zoom < ZOOM_STEPS[ZOOM_STEPS.length - 1]
                ? "hover:bg-gray-100 text-gray-600"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Right: preview + format + download */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 bg-white text-gray-600 transition-all shadow-sm"
          >
            <Eye size={13} />
            Preview
          </button>

          <div className="h-5 w-px bg-gray-200" />

          {/* Format picker */}
          <div className="relative">
            <button
              onClick={() => setShowFormatMenu((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 bg-white text-gray-600 transition-all shadow-sm"
            >
              {currentFormat.label}
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            {showFormatMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowFormatMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-40 bg-white border border-gray-100 rounded-xl shadow-2xl py-1 min-w-[170px]">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setExportFormat(opt.value);
                        setShowFormatMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${
                        exportFormat === opt.value
                          ? "text-blue-600 bg-blue-50/60"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Download CTA */}
          <button className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-black active:scale-95 transition-all shadow-sm">
            <Download size={13} />
            Download $4.99
          </button>
        </div>
      </div>

      {/* ── WORKSPACE ── */}
      <div className="flex flex-1 overflow-hidden">
        <EditorLeftSidebar
          handleDragStart={handleDragStart}
          onInsertBlock={insertBlock}
        />

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
          zoom={zoom}
        />

        <EditorRightSidebar
          selectedBlockId={selectedBlockId}
          blocks={blocks}
          updateBlockContent={updateBlockContent}
          updateBlockStyle={updateBlockStyle}
        />
      </div>

      {/* ── PREVIEW MODAL ── */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="w-[720px] max-h-[90vh] bg-white rounded-2xl shadow-2xl relative flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 flex-shrink-0">
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Document Preview</h2>
                <p className="text-xs text-gray-400 mt-0.5">{documentTitle}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Preview body */}
            <div className="flex-1 overflow-y-auto bg-[#f0f0f0] flex justify-center py-8">
              <div
                className="bg-white"
                style={{
                  width: "680px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  padding: "48px 56px",
                  pointerEvents: "none",
                }}
              >
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

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-2 flex-shrink-0">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
              >
                Close
              </button>
              <button className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg hover:bg-black transition-all">
                <Download size={14} />
                Download {currentFormat.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
