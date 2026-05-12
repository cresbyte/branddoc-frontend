"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Block, sampleBrand } from "./types";
import { BlockRenderer } from "./BlockRenderer";
import { Lock } from "lucide-react";
import { MARGIN_PRESETS, MarginPreset } from "./constants";

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectCallback: (id: string | null) => void;
  updateBlockContent: (id: string, updates: any) => void;
  deleteBlock: (id: string, e?: React.MouseEvent) => void;
  duplicateBlock: (id: string, e?: React.MouseEvent) => void;
  addBlockAbove: (id: string, type: string, e?: React.MouseEvent) => void;
  handleDragStart: (e: React.DragEvent, item: any) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  dropIndicator: number | null;
  zoom: number;
  marginId: string;
}

// A4 at 96 dpi
const A4_HEIGHT = 1123;
const A4_WIDTH = 794;
const PAGE_GAP = 24; // px gap between page cards
// Approximate fixed heights – these get updated once from refs
const APPROX_HEADER_H = 116;
const APPROX_FOOTER_H = 98;

/** Distribute blocks across pages given per-block heights */
function distributeToPages(
  blocks: Block[],
  heights: Map<string, number>,
  usableH: number,
): Block[][] {
  if (blocks.length === 0) return [[]];
  const pages: Block[][] = [[]];
  let used = 0;

  for (const block of blocks) {
    const bh = heights.get(block.id) ?? 60;
    if (used + bh > usableH && pages[pages.length - 1].length > 0) {
      pages.push([]);
      used = 0;
    }
    pages[pages.length - 1].push(block);
    used += bh;
  }
  return pages;
}

function LockedHeader() {
  return (
    <div className="pointer-events-none select-none relative group">
      <div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-white/30 transition-opacity"
        title="Locked brand header"
      >
        <Lock size={12} />
      </div>
      <div
        style={{
          backgroundColor: sampleBrand.primaryColor,
          padding: "18px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 14,
              color: sampleBrand.primaryColor,
              flexShrink: 0,
            }}
          >
            {sampleBrand.initials}
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>
              {sampleBrand.companyName}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>
              {sampleBrand.tagline}
            </div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, textAlign: "right", lineHeight: 1.7 }}>
          {sampleBrand.email}<br />
          {sampleBrand.phone}<br />
          {sampleBrand.website}<br />
          {sampleBrand.address}
        </div>
      </div>
      <div style={{ height: 3, backgroundColor: sampleBrand.secondaryColor }} />
    </div>
  );
}

function LockedFooter() {
  return (
    <div className="pointer-events-none select-none relative group">
      <div className="absolute -top-4 right-4 opacity-0 group-hover:opacity-100 text-gray-300 transition-opacity">
        <Lock size={12} />
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "13px 36px 0",
          borderTop: "1px solid #eeeeee",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "#aaaaaa" }}>{sampleBrand.website}</span>
        <div style={{ flex: 1, height: 1, backgroundColor: "#ebebeb", margin: "0 16px" }} />
        <span style={{ fontSize: 11, color: "#aaaaaa" }}>{sampleBrand.companyName}</span>
      </div>
      <div style={{ height: 4, backgroundColor: sampleBrand.primaryColor, marginTop: 13 }} />
    </div>
  );
}

/** A single A4 page card */
function PageCard({
  pageIndex,
  pageBlocks,
  globalStartIndex,
  totalBlocks,
  selectedBlockId,
  onSelectCallback,
  updateBlockContent,
  deleteBlock,
  duplicateBlock,
  addBlockAbove,
  handleDragStart,
  handleDragOver,
  handleDrop,
  dropIndicator,
  onHeightMeasured,
  isLastPage,
  margin,
}: {
  pageIndex: number;
  pageBlocks: Block[];
  globalStartIndex: number;
  totalBlocks: number;
  selectedBlockId: string | null;
  onSelectCallback: (id: string | null) => void;
  updateBlockContent: (id: string, updates: any) => void;
  deleteBlock: (id: string, e?: React.MouseEvent) => void;
  duplicateBlock: (id: string, e?: React.MouseEvent) => void;
  addBlockAbove: (id: string, type: string, e?: React.MouseEvent) => void;
  handleDragStart: (e: React.DragEvent, item: any) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  dropIndicator: number | null;
  onHeightMeasured: (id: string, h: number) => void;
  isLastPage: boolean;
  margin: MarginPreset;
}) {
  return (
    <div
      style={{
        width: A4_WIDTH,
        minHeight: A4_HEIGHT,
        backgroundColor: "#ffffff",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 4px rgba(0,0,0,0.10), 0 4px 24px rgba(0,0,0,0.06)",
        position: "relative",
      }}
    >
      {/* Page number */}
      <div
        style={{
          position: "absolute",
          top: -18,
          right: 0,
          fontSize: 10,
          color: "#aaaaaa",
          userSelect: "none",
          fontFamily: "monospace",
        }}
      >
        {pageIndex + 1}
      </div>

      <LockedHeader />

      {/* Content area */}
      <div
        style={{
          flex: 1,
          padding: `${margin.top / 2}px ${margin.left}px 0`,
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onSelectCallback(null);
        }}
      >
        {pageBlocks.length === 0 && isLastPage && (
          <div
            className="flex-1 flex flex-col items-center justify-center select-none"
            style={{ color: "#cccccc", gap: 8 }}
            onDragOver={(e) => handleDragOver(e, globalStartIndex)}
            onDrop={(e) => handleDrop(e, globalStartIndex)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              Drag blocks here or click one in the sidebar
            </span>
          </div>
        )}

        {pageBlocks.map((block, localIdx) => {
          const globalIdx = globalStartIndex + localIdx;
          return (
            <BlockRenderer
              key={block.id}
              block={block}
              index={globalIdx}
              isSelected={selectedBlockId === block.id}
              isPreview={false}
              onSelect={onSelectCallback}
              updateBlockContent={updateBlockContent}
              deleteBlock={deleteBlock}
              duplicateBlock={duplicateBlock}
              addBlockAbove={addBlockAbove}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              dropIndicator={dropIndicator}
              onHeightMeasured={onHeightMeasured}
            />
          );
        })}

        {/* Drop zone at page bottom */}
        <div
          style={{ minHeight: margin.bottom / 2, flex: 1, position: "relative" }}
          onDragOver={(e) => handleDragOver(e, globalStartIndex + pageBlocks.length)}
          onDrop={(e) => handleDrop(e, globalStartIndex + pageBlocks.length)}
        >
          {dropIndicator === globalStartIndex + pageBlocks.length && (
            <div
              className="drop-line"
              style={{
                position: "absolute",
                top: 4,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#3b82f6",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: "#3b82f6",
                  borderRadius: 1,
                  opacity: 0.8,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <LockedFooter />
    </div>
  );
}

export function EditorCanvas({
  blocks,
  selectedBlockId,
  onSelectCallback,
  updateBlockContent,
  deleteBlock,
  duplicateBlock,
  addBlockAbove,
  handleDragStart,
  handleDragOver,
  handleDrop,
  dropIndicator,
  zoom,
  marginId,
}: EditorCanvasProps) {
  const [blockHeights, setBlockHeights] = useState<Map<string, number>>(new Map());
  const marginPreset = MARGIN_PRESETS.find((m) => m.id === marginId) || MARGIN_PRESETS[0];

  const [usableH, setUsableH] = useState(
    A4_HEIGHT - APPROX_HEADER_H - APPROX_FOOTER_H - marginPreset.top / 2 - marginPreset.bottom / 2
  );

  // Measure one header + footer to get accurate usable height
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hh = headerRef.current?.offsetHeight ?? APPROX_HEADER_H;
    const fh = footerRef.current?.offsetHeight ?? APPROX_FOOTER_H;
    setUsableH(A4_HEIGHT - hh - fh - marginPreset.top / 2 - marginPreset.bottom / 2);
  }, [marginPreset]);

  const handleBlockHeight = useCallback((id: string, h: number) => {
    setBlockHeights((prev) => {
      if (prev.get(id) === h) return prev;
      const next = new Map(prev);
      next.set(id, h);
      return next;
    });
  }, []);

  const pageGroups = distributeToPages(blocks, blockHeights, usableH);

  // globalStartIndex for each page
  const pageOffsets: number[] = [];
  let offset = 0;
  for (const pg of pageGroups) {
    pageOffsets.push(offset);
    offset += pg.length;
  }

  return (
    <>
      <style>{`
        @keyframes dropLineIn {
          from { opacity: 0; transform: scaleX(0.92); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        .drop-line {
          animation: dropLineIn 0.1s ease-out;
          transform-origin: left center;
        }
      `}</style>
      <div
        className="flex-1 overflow-auto bg-[#e8e8e8] flex flex-col items-center py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelectCallback(null);
      }}
    >
      {/* Zoom wrapper */}
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: PAGE_GAP,
          paddingBottom: 40,
          flexShrink: 0,
        }}
      >
        {/* Hidden refs to measure header/footer heights accurately */}
        <div ref={headerRef} style={{ position: "absolute", visibility: "hidden", width: A4_WIDTH }}>
          <LockedHeader />
        </div>
        <div ref={footerRef} style={{ position: "absolute", visibility: "hidden", width: A4_WIDTH }}>
          <LockedFooter />
        </div>

        {pageGroups.map((pageBlocks, pageIdx) => (
          <PageCard
            key={pageIdx}
            pageIndex={pageIdx}
            pageBlocks={pageBlocks}
            globalStartIndex={pageOffsets[pageIdx]}
            totalBlocks={blocks.length}
            selectedBlockId={selectedBlockId}
            onSelectCallback={onSelectCallback}
            updateBlockContent={updateBlockContent}
            deleteBlock={deleteBlock}
            duplicateBlock={duplicateBlock}
            addBlockAbove={addBlockAbove}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            dropIndicator={dropIndicator}
            onHeightMeasured={handleBlockHeight}
            isLastPage={pageIdx === pageGroups.length - 1}
            margin={marginPreset}
          />
        ))}
      </div>
      </div>
    </>
  );
}
