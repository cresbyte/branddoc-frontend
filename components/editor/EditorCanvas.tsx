"use client";

import React, { useRef, useEffect, useState } from "react";
import ElementRenderer from "./ElementRenderer";

interface Element {
  id: string;
  element_type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z_index?: number;
  is_editable?: boolean;
  is_locked?: boolean;
  is_visible?: boolean;
  [key: string]: any;
}

interface EditorCanvasProps {
  elements: Element[];
  canvasWidth?: number;
  canvasHeight?: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onElementChange: (id: string, value: string) => void;
}

const BASE_W = 794;
const BASE_H = 1123;

export default function EditorCanvas({
  elements,
  canvasWidth = BASE_W,
  canvasHeight = BASE_H,
  selectedId,
  onSelect,
  onElementChange,
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Recalculate scale to fit the container
  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const scaleX = (width - 48) / canvasWidth;
      const scaleY = (height - 48) / canvasHeight;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [canvasWidth, canvasHeight]);

  const sorted = [...elements].sort((a, b) => (a.z_index ?? 0) - (b.z_index ?? 0));

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden bg-slate-200"
      onClick={() => onSelect(null)}
    >
      {/* Drop shadow to simulate paper */}
      <div
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          position: "relative",
          background: "#ffffff",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.1), 0 20px 60px -10px rgba(0,0,0,0.25)",
        }}
      >
        {sorted.map((el) => (
          <ElementRenderer
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            onSelect={onSelect}
            onChange={(id, value) => onElementChange(id, value)}
          />
        ))}
      </div>
    </div>
  );
}
