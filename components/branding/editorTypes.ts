// ─── Element model ────────────────────────────────────────────────────────────
export type ElementType = "text" | "image" | "shape" | "logo"

export interface ElementStyle {
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: "normal" | "bold"
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline"
  textAlign?: "left" | "center" | "right"
  opacity?: number
  borderRadius?: number
  objectFit?: "contain" | "cover" | "fill"
  zIndex?: number
}

export interface CanvasElement {
  id: string
  type: ElementType
  zone: "header" | "footer" | "body"
  x: number      // pixels in page space (794×1123)
  y: number
  w: number
  h: number
  content: string  // text content OR image src
  style: ElementStyle
  locked?: boolean
}

// ─── Snap engine ─────────────────────────────────────────────────────────────
export const SNAP_THRESHOLD = 6  // px in page-space

export interface SnapGuide {
  type: "vertical" | "horizontal"
  position: number  // px in page-space
}

/** Given a dragging element's proposed position + all other elements,
 *  return the snapped {x,y} and any guide lines to render. */
export function computeSnap(
  dragging: { x: number; y: number; w: number; h: number },
  others: CanvasElement[],
  pageW: number,
  pageH: number,
  ctrlHeld: boolean,
): { x: number; y: number; guides: SnapGuide[] } {
  if (ctrlHeld) return { x: dragging.x, y: dragging.y, guides: [] }

  const { x, y, w, h } = dragging

  // ── Candidate snap lines ──────────────────────────────────────────────────
  // Page edges + center lines
  const verticals: number[] = [0, pageW / 2, pageW]
  const horizontals: number[] = [0, pageH / 2, pageH]

  // All other elements' 6 snap points (left/center/right & top/mid/bottom)
  for (const el of others) {
    verticals.push(el.x, el.x + el.w / 2, el.x + el.w)
    horizontals.push(el.y, el.y + el.h / 2, el.y + el.h)
  }

  // ── Dragging element's 6 snap points ─────────────────────────────────────
  const elV = [x, x + w / 2, x + w]
  const elH = [y, y + h / 2, y + h]

  let bestDX = SNAP_THRESHOLD + 1
  let bestDY = SNAP_THRESHOLD + 1
  let snapX = x
  let snapY = y
  const guides: SnapGuide[] = []

  // Vertical snap
  for (const elPt of elV) {
    for (const candidate of verticals) {
      const d = Math.abs(elPt - candidate)
      if (d < bestDX) {
        bestDX = d
        // offset from element origin to this snap point, then adjust
        snapX = candidate - (elPt - x)
      }
    }
  }

  // Horizontal snap
  for (const elPt of elH) {
    for (const candidate of horizontals) {
      const d = Math.abs(elPt - candidate)
      if (d < bestDY) {
        bestDY = d
        snapY = candidate - (elPt - y)
      }
    }
  }

  // ── Build guide lines only where we actually snapped ─────────────────────
  if (bestDX <= SNAP_THRESHOLD) {
    // Find which vertical line we snapped to
    const snappedElV = snapX + (elV[0] - x) // left
    const pts = [snappedElV, snapX + w / 2, snapX + w]
    for (const pt of pts) {
      if (verticals.some((v) => Math.abs(v - pt) < 1)) {
        guides.push({ type: "vertical", position: pt })
      }
    }
  }
  if (bestDY <= SNAP_THRESHOLD) {
    const pts = [snapY, snapY + h / 2, snapY + h]
    for (const pt of pts) {
      if (horizontals.some((h) => Math.abs(h - pt) < 1)) {
        guides.push({ type: "horizontal", position: pt })
      }
    }
  }

  return { x: snapX, y: snapY, guides }
}

// ─── unique id ────────────────────────────────────────────────────────────────
export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}
