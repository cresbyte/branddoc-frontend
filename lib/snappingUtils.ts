import { KonvaElement } from "@/hooks/useTemplateCanvas";

export interface SnappingGuide {
  lineGuide: number;
  offset: number;
  orientation: 'V' | 'H';
  snap: 'start' | 'center' | 'end';
}

export const SNAP_THRESHOLD = 5;

export interface Guide {
    type: 'V' | 'H';
    pos: number;
}

export function getSnappingGuides(
  draggingElement: KonvaElement,
  otherElements: KonvaElement[],
  canvasWidth: number,
  canvasHeight: number
) {
  const resultV: SnappingGuide[] = [];
  const resultH: SnappingGuide[] = [];

  // 1. Possible snapping lines on the canvas
  const guidesV = [0, canvasWidth / 2, canvasWidth];
  const guidesH = [0, canvasHeight / 2, canvasHeight];

  // 2. Possible snapping lines from other elements
  otherElements.forEach((el) => {
    if (el._deleted || !el.is_visible) return;
    
    // Vertical
    guidesV.push(el.x);
    guidesV.push(el.x + el.width / 2);
    guidesV.push(el.x + el.width);

    // Horizontal
    guidesH.push(el.y);
    guidesH.push(el.y + el.height / 2);
    guidesH.push(el.y + el.height);
  });

  const draggingBox = {
    x: draggingElement.x,
    y: draggingElement.y,
    width: draggingElement.width,
    height: draggingElement.height,
  };

  // Find vertical snap
  const itemGuidesV = [
    { line: draggingBox.x, snap: 'start', offset: 0 },
    { line: draggingBox.x + draggingBox.width / 2, snap: 'center', offset: draggingBox.width / 2 },
    { line: draggingBox.x + draggingBox.width, snap: 'end', offset: draggingBox.width },
  ] as const;

  itemGuidesV.forEach((item) => {
    guidesV.forEach((guide) => {
      const diff = Math.abs(item.line - guide);
      if (diff < SNAP_THRESHOLD) {
        resultV.push({
          lineGuide: guide,
          offset: guide - item.offset,
          orientation: 'V',
          snap: item.snap,
        });
      }
    });
  });

  // Find horizontal snap
  const itemGuidesH = [
    { line: draggingBox.y, snap: 'start', offset: 0 },
    { line: draggingBox.y + draggingBox.height / 2, snap: 'center', offset: draggingBox.height / 2 },
    { line: draggingBox.y + draggingBox.height, snap: 'end', offset: draggingBox.height },
  ] as const;

  itemGuidesH.forEach((item) => {
    guidesH.forEach((guide) => {
      const diff = Math.abs(item.line - guide);
      if (diff < SNAP_THRESHOLD) {
        resultH.push({
          lineGuide: guide,
          offset: guide - item.offset,
          orientation: 'H',
          snap: item.snap,
        });
      }
    });
  });

  return {
    v: resultV[0] || null,
    h: resultH[0] || null,
  };
}
