import React, { useEffect, useRef, useState } from "react";
import { Block, sampleBrand } from "./types";
import { BlockRenderer } from "./BlockRenderer";
import { Lock } from "lucide-react";

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
}

const A4_HEIGHT = 1123;

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
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Measure content to dynamically render A4 Page Breaks
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        const pagesNeeded = Math.max(1, Math.ceil(height / A4_HEIGHT));
        if (pagesNeeded !== totalPages) {
          setTotalPages(pagesNeeded);
        }
      }
    });

    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [totalPages]);

  const renderLockedHeader = () => (
    <div className="relative group mb-8 pointer-events-none select-none">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-gray-300">
        <Lock size={16} />
      </div>
      <div style={{ backgroundColor: "#1a1a1a", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#1a1a1a] text-[15px]">
            {sampleBrand.initials}
          </div>
          <div>
            <div className="text-white font-bold text-[18px]">{sampleBrand.companyName}</div>
            <div className="text-white/60 text-[12px]">{sampleBrand.tagline}</div>
          </div>
        </div>
        <div className="text-white text-[11px] text-right opacity-80 leading-relaxed">
          {sampleBrand.email}<br/>
          {sampleBrand.phone}<br/>
          {sampleBrand.website}<br/>
          {sampleBrand.address}
        </div>
      </div>
      <div style={{ height: "3px", backgroundColor: sampleBrand.secondaryColor, width: "100%" }} />
    </div>
  );

  const renderLockedFooter = () => (
    <div className="relative group mt-12 pointer-events-none select-none w-full">
      <div className="absolute flex flex-col justify-center top-0 right-4 opacity-0 group-hover:opacity-100 text-gray-300 -translate-y-full pb-2">
        <Lock size={16} />
      </div>
      <div style={{ backgroundColor: "#ffffff", padding: "14px 32px 0 32px", borderTop: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div className="text-[11px] text-gray-400">{sampleBrand.website}</div>
        <div className="flex-1 mx-4 h-[1px] bg-[#1a1a1a] opacity-20"></div>
        <div className="text-[11px] text-gray-400">{sampleBrand.companyName}</div>
      </div>
      <div style={{ height: "4px", backgroundColor: "#1a1a1a", width: "100%", marginTop: "14px" }} />
    </div>
  );

  return (
    <div 
      className="flex-1 overflow-y-auto bg-gray-100 p-8 flex flex-col items-center relative"
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelectCallback(null);
      }}
    >
      {/* Background Page Mattes (Seamless Pageless View) */}
      <div 
        className="absolute top-8 w-[794px] pointer-events-none z-0 flex flex-col bg-white shadow-md border border-gray-200" 
        style={{ minHeight: `${totalPages * A4_HEIGHT}px` }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <div 
            key={i} 
            className="w-full relative" 
            style={{ 
              height: `${A4_HEIGHT}px`,
              borderBottom: i < totalPages - 1 ? '1px dashed #d1d5db' : 'none'
            }} 
          >
            {i < totalPages - 1 && (
              <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">Page {i + 1}</span>
            )}
          </div>
        ))}
      </div>

      <div 
        ref={canvasRef}
        className="w-[794px] bg-transparent flex flex-col origin-top z-10 min-h-[1123px] relative"
        onClick={() => onSelectCallback(null)}
      >
        {renderLockedHeader()}
        
        <div className={`flex-1 flex flex-col mx-12 ${blocks.length === 0 ? 'border-2 border-dashed border-gray-200' : ''}`}>
          {blocks.length === 0 && (
            <div 
              className="flex-1 flex items-center justify-center text-gray-400 font-medium"
              onDragOver={(e) => handleDragOver(e, 0)}
              onDrop={(e) => handleDrop(e, 0)}
            >
              Drag a block here to start, or click to type
            </div>
          )}
          
          {blocks.map((block, index) => (
            <BlockRenderer 
              key={block.id}
              block={block} 
              index={index}
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
            />
          ))}
          
          {/* Drop zone at the very bottom */}
          <div 
            className="h-8 w-full mt-2 relative"
            onDragOver={(e) => handleDragOver(e, blocks.length)}
            onDrop={(e) => handleDrop(e, blocks.length)}
          >
            {dropIndicator === blocks.length && (
              <div className="absolute inset-0 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 z-10" />
                <div className="h-[2px] bg-blue-500 w-full" />
              </div>
            )}
          </div>
        </div>

        {renderLockedFooter()}
      </div>
    </div>
  );
}
