"use client";

/**
 * BrandKitEditor v3 — Hybrid Canva-style letterhead editor
 *
 * Strategy:
 * ─────────────────────────────────────────────────────────────────────────────
 * • Header & footer are rendered as real DOM via dangerouslySetInnerHTML so
 *   the backend's flexbox / flow layout is preserved pixel-perfectly.
 * • After each render an "overlay scanner" walks every text node and <img>
 *   inside header/footer, measures its bounding rect relative to the page div,
 *   and builds an array of transparent OverlayNode records.
 * • Those records are rendered as absolutely-positioned transparent <div>s on
 *   top of the page.  Clicking one "selects" it (blue ring); dragging moves it
 *   by updating a CSS translate() stored per-node; the context toolbar lets
 *   you change colour / font / size / bg directly on the real DOM node.
 * • Brand-colour changes re-interpolate the raw template HTML and re-render —
 *   the overlay scanner re-runs automatically on the next layout effect.
 * • Body zone stays contentEditable as before.
 * • Full undo/redo via JSON snapshots of (overlayNodes state + body innerHTML).
 */

import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, ChevronDown,
  Copy, Italic, Palette, Redo, Save, Trash2, Underline, Undo, Upload,
} from "lucide-react";
import { useDashboard } from "@/app/dashboard/components/DashboardContext";
import { saveBrandKit } from "@/lib/api";
import { interpolate } from "@/lib/utils";

// ─── Page constants ───────────────────────────────────────────────────────────
const PAGE_W = 794;
const PAGE_H = 1123;
const SNAP_THRESHOLD = 6;

// ─── Types ────────────────────────────────────────────────────────────────────
type NodeKind = "text-block" | "image";

interface OverlayNode {
  id: string;
  kind: NodeKind;
  zone: "header" | "footer";
  // position & size relative to the 794×1123 page (page-space px)
  x: number; y: number; w: number; h: number;
  // drag offsets (page-space px)
  dx: number; dy: number;
  // live style overrides we write back to the real DOM node
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right";
  opacity?: number;
  // reference to the real DOM element (not serialized)
  _el?: HTMLElement;
}

interface SnapGuide { type: "v" | "h"; pos: number; }

interface BrandColors {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
}

// ─── Snap engine ─────────────────────────────────────────────────────────────
function computeSnap(
  drag: { x: number; y: number; w: number; h: number },
  others: OverlayNode[],
  ctrl: boolean,
): { x: number; y: number; guides: SnapGuide[] } {
  if (ctrl) return { x: drag.x, y: drag.y, guides: [] };
  const vs = [0, PAGE_W / 2, PAGE_W];
  const hs = [0, PAGE_H / 2, PAGE_H];
  for (const o of others) {
    vs.push(o.x + o.dx, o.x + o.dx + o.w / 2, o.x + o.dx + o.w);
    hs.push(o.y + o.dy, o.y + o.dy + o.h / 2, o.y + o.dy + o.h);
  }
  const { x, y, w, h } = drag;
  let bx = SNAP_THRESHOLD + 1, by = SNAP_THRESHOLD + 1;
  let sx = x, sy = y;
  const guides: SnapGuide[] = [];
  for (const pt of [x, x + w / 2, x + w])
    for (const c of vs) { const d = Math.abs(pt - c); if (d < bx) { bx = d; sx = c - (pt - x); } }
  for (const pt of [y, y + h / 2, y + h])
    for (const c of hs) { const d = Math.abs(pt - c); if (d < by) { by = d; sy = c - (pt - y); } }
  if (bx <= SNAP_THRESHOLD)
    for (const p of [sx, sx + w / 2, sx + w])
      if (vs.some(v => Math.abs(v - p) < 1)) guides.push({ type: "v", pos: p });
  if (by <= SNAP_THRESHOLD)
    for (const p of [sy, sy + h / 2, sy + h])
      if (hs.some(h => Math.abs(h - p) < 1)) guides.push({ type: "h", pos: p });
  return { x: sx, y: sy, guides };
}

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Toolbar primitives ───────────────────────────────────────────────────────
function Sep() {
  return <div style={{ width: 1, height: 20, background: "#e0e0e0", flexShrink: 0, margin: "0 3px" }} />;
}

function TBtn({ active, onClick, title, disabled, children, danger }: {
  active?: boolean; onClick?: () => void; title?: string;
  disabled?: boolean; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); if (!disabled && onClick) onClick(); }}
      title={title} disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 28, minWidth: 28, padding: "0 5px", border: "none", borderRadius: 4,
        background: active ? "#e8f0fe" : "transparent",
        color: disabled ? "#bdbdbd" : danger ? "#d93025" : active ? "#1a73e8" : "#3c4043",
        cursor: disabled ? "default" : "pointer", flexShrink: 0, gap: 3, fontSize: 11,
        transition: "background 0.12s",
      }}
    >{children}</button>
  );
}

function GSelect({ value, onChange, options, title, width }: {
  value: string | number; onChange: (v: string) => void;
  options: (string | number)[]; title?: string; width?: number;
}) {
  return (
    <div title={title} style={{
      position: "relative", display: "flex", alignItems: "center", height: 28,
      borderRadius: 4, padding: "0 5px", border: "1px solid #e0e0e0",
      background: "#fff", width: width ?? "auto", minWidth: 50, flexShrink: 0, cursor: "pointer",
    }}>
      <span style={{ fontSize: 11, color: "#3c4043", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", pointerEvents: "none" }}>{value}</span>
      <ChevronDown size={9} style={{ color: "#5f6368", marginLeft: 2, pointerEvents: "none", flexShrink: 0 }} />
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ColorBtn({ value, onChange, title, label }: {
  value: string; onChange: (v: string) => void; title?: string; label?: string;
}) {
  return (
    <div title={title} style={{ position: "relative", display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
      {label && <span style={{ fontSize: 10, color: "#5f6368" }}>{label}</span>}
      <div style={{ width: 20, height: 20, borderRadius: 3, border: "1.5px solid #ccc", background: value }} />
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FONTS = ["Inter", "Georgia", "Playfair Display", "Roboto Slab", "Montserrat", "Lato", "Arial"];
const FONT_SIZES = ["8", "9", "10", "11", "12", "13", "14", "16", "18", "20", "22", "24", "28", "32", "36", "40", "48"];
const ZOOMS = ["50%", "65%", "75%", "85%", "100%", "125%", "150%"];

// ════════════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════════════
export function BrandKitEditor({ initialKit, profile }: { initialKit: any; profile?: any }) {
  const ctx: any = profile ? { ...profile, logo_url: profile.logo_url || profile.logo } : {};
  const { setHeaderTitle, setSearch, setCta, setExtra } = useDashboard();

  // ── Refs ───────────────────────────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ctrlRef = useRef(false);

  // ── Scale / zoom ───────────────────────────────────────────────────────
  const [scale, setScale] = useState(0.85);
  const [zoom, setZoom] = useState(85);

  const recalcScale = useCallback(() => {
    const w = wrapperRef.current; if (!w) return;
    const base = Math.min((w.clientWidth - 80) / PAGE_W, 1.4);
    setScale(base * (zoom / 100));
  }, [zoom]);

  useLayoutEffect(() => {
    recalcScale();
    const ro = new ResizeObserver(recalcScale);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [recalcScale]);

  // ── Brand colours ──────────────────────────────────────────────────────
  const [brandColors, setBrandColors] = useState<BrandColors>({
    primary_color: ctx.primary_color || "#007dc5",
    secondary_color: ctx.secondary_color || "#253141",
    background_color: ctx.background_color || "#ffffff",
    text_color: ctx.text_color || "#292929",
  });

  // ── Raw HTML (re-interpolated when brand colours change) ───────────────
  const rawHeaderHtml = initialKit?.header_html || initialKit?.template?.header_html || "";
  const rawFooterHtml = initialKit?.footer_html || initialKit?.template?.footer_html || "";
  const templateCss = initialKit?.template_css || initialKit?.template?.template_css || "";

  const mergedCtx = { ...ctx, ...brandColors };
  const headerHtml = interpolate(rawHeaderHtml, mergedCtx);
  const footerHtml = interpolate(rawFooterHtml, mergedCtx);
  const interpolatedCss = interpolate(templateCss, mergedCtx);

  // ── Overlay nodes (draggable handles over header/footer elements) ───────
  const [overlayNodes, setOverlayNodes] = useState<OverlayNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guides, setGuides] = useState<SnapGuide[]>([]);

  // ── Body content ───────────────────────────────────────────────────────
  const [bodyHtml, setBodyHtml] = useState<string>("");

  // ── Scan header/footer DOM and build overlay records ───────────────────
  const scanOverlays = useCallback(() => {
    const page = pageRef.current; if (!page) return;
    const pageRect = page.getBoundingClientRect();

    const nodes: OverlayNode[] = [];

    const scanZone = (zone: "header" | "footer", root: HTMLElement | null) => {
      if (!root) return;
      // Find all leaf-ish text containers and images
      const candidates = root.querySelectorAll<HTMLElement>(
        "h1, h2, h3, h4, h5, h6, p, span, div:not(:has(*)), img, a"
      );

      candidates.forEach(el => {
        // Skip empty containers
        if (el.tagName !== "IMG" && !el.textContent?.trim()) return;
        // Skip wrappers that contain further block children
        if (el.tagName !== "IMG" && el.tagName !== "P" && el.tagName !== "H1" &&
          el.tagName !== "H2" && el.tagName !== "H3" && el.tagName !== "SPAN" &&
          el.tagName !== "A") {
          const hasBlockChild = Array.from(el.children).some(c => {
            const d = window.getComputedStyle(c as HTMLElement).display;
            return d === "block" || d === "flex" || d === "grid";
          });
          if (hasBlockChild) return;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) return;

        const x = (rect.left - pageRect.left) / scale;
        const y = (rect.top - pageRect.top) / scale;
        const w = rect.width / scale;
        const h = rect.height / scale;

        const cs = window.getComputedStyle(el);

        nodes.push({
          id: uid(),
          kind: el.tagName === "IMG" ? "image" : "text-block",
          zone,
          x, y, w, h,
          dx: 0, dy: 0,
          color: cs.color,
          backgroundColor: cs.backgroundColor === "rgba(0, 0, 0, 0)" ? "transparent" : cs.backgroundColor,
          fontSize: parseFloat(cs.fontSize),
          fontFamily: cs.fontFamily.replace(/['"]/g, "").split(",")[0].trim(),
          fontWeight: cs.fontWeight === "700" || cs.fontWeight === "bold" ? "bold" : "normal",
          fontStyle: cs.fontStyle === "italic" ? "italic" : "normal",
          textDecoration: cs.textDecoration.includes("underline") ? "underline" : "none",
          textAlign: (cs.textAlign as any) || "left",
          opacity: parseFloat(cs.opacity),
          _el: el,
        });
      });
    };

    scanZone("header", headerRef.current);
    scanZone("footer", footerRef.current);

    setOverlayNodes(nodes);
  }, [scale]);

  // Re-scan after header/footer HTML changes or scale changes
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => scanOverlays());
    return () => cancelAnimationFrame(id);
  }, [headerHtml, footerHtml, scale, scanOverlays]);

  // ── Ctrl key tracking ──────────────────────────────────────────────────
  useEffect(() => {
    const dn = (e: KeyboardEvent) => { if (e.key === "Control" || e.key === "Meta") ctrlRef.current = true; };
    const up = (e: KeyboardEvent) => { if (e.key === "Control" || e.key === "Meta") ctrlRef.current = false; };
    window.addEventListener("keydown", dn); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  // ── History ────────────────────────────────────────────────────────────
  type Snapshot = { nodes: Omit<OverlayNode, "_el">[]; body: string; };
  const histRef = useRef<Snapshot[]>([]);
  const histIdxRef = useRef(-1);

  const pushHistory = useCallback((nodes: OverlayNode[], body: string) => {
    const snap: Snapshot = {
      nodes: nodes.map(({ _el, ...rest }) => rest),
      body,
    };
    histRef.current = histRef.current.slice(0, histIdxRef.current + 1);
    histRef.current.push(snap);
    histIdxRef.current = histRef.current.length - 1;
  }, []);

  // push initial snapshot after first scan
  useEffect(() => {
    if (overlayNodes.length > 0 && histIdxRef.current < 0) {
      pushHistory(overlayNodes, bodyHtml);
    }
  }, [overlayNodes]); // eslint-disable-line

  const handleUndo = useCallback(() => {
    if (histIdxRef.current <= 0) return;
    histIdxRef.current--;
    const snap = histRef.current[histIdxRef.current];
    // Restore positions + styles but keep _el references from current nodes
    setOverlayNodes(prev => prev.map(n => {
      const saved = snap.nodes.find(s => s.id === n.id);
      return saved ? { ...saved, _el: n._el } : n;
    }));
    setBodyHtml(snap.body);
    setSelectedId(null);
  }, []);

  const handleRedo = useCallback(() => {
    if (histIdxRef.current >= histRef.current.length - 1) return;
    histIdxRef.current++;
    const snap = histRef.current[histIdxRef.current];
    setOverlayNodes(prev => prev.map(n => {
      const saved = snap.nodes.find(s => s.id === n.id);
      return saved ? { ...saved, _el: n._el } : n;
    }));
    setBodyHtml(snap.body);
    setSelectedId(null);
  }, []);

  // ── Apply overlay style patch to the real DOM element ─────────────────
  const applyStyleToEl = useCallback((node: OverlayNode) => {
    const el = node._el; if (!el) return;
    if (node.dx !== 0 || node.dy !== 0) {
      el.style.transform = `translate(${node.dx}px, ${node.dy}px)`;
      el.style.position = "relative";
      el.style.zIndex = "10";
    }
    if (node.color) el.style.color = node.color;
    if (node.backgroundColor && node.backgroundColor !== "transparent")
      el.style.backgroundColor = node.backgroundColor;
    if (node.fontSize) el.style.fontSize = `${node.fontSize}px`;
    if (node.fontFamily) el.style.fontFamily = node.fontFamily;
    if (node.fontWeight) el.style.fontWeight = node.fontWeight;
    if (node.fontStyle) el.style.fontStyle = node.fontStyle;
    if (node.textDecoration) el.style.textDecoration = node.textDecoration;
    if (node.textAlign) el.style.textAlign = node.textAlign;
    if (node.opacity !== undefined) el.style.opacity = String(node.opacity);
  }, []);

  const updateNode = useCallback((id: string, patch: Partial<OverlayNode>, commit = false) => {
    setOverlayNodes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, ...patch } : n);
      const updated = next.find(n => n.id === id);
      if (updated) applyStyleToEl(updated);
      if (commit) pushHistory(next, bodyHtml);
      return next;
    });
  }, [applyStyleToEl, pushHistory, bodyHtml]);

  // ── Drag logic ─────────────────────────────────────────────────────────
  const dragState = useRef<{
    id: string; startMouseX: number; startMouseY: number;
    startDx: number; startDy: number;
  } | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedId(id);
    const node = overlayNodes.find(n => n.id === id); if (!node) return;
    dragState.current = {
      id, startMouseX: e.clientX, startMouseY: e.clientY,
      startDx: node.dx, startDy: node.dy,
    };
  }, [overlayNodes]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const ds = dragState.current; if (!ds) return;
      const ddx = (e.clientX - ds.startMouseX) / scale;
      const ddy = (e.clientY - ds.startMouseY) / scale;
      const node = overlayNodes.find(n => n.id === ds.id); if (!node) return;
      const proposed = {
        x: node.x + ds.startDx + ddx, y: node.y + ds.startDy + ddy, w: node.w, h: node.h,
      };
      const others = overlayNodes.filter(n => n.id !== ds.id);
      const { x: sx, y: sy, guides: g } = computeSnap(proposed, others, ctrlRef.current);
      setGuides(g);
      const newDx = sx - node.x;
      const newDy = sy - node.y;
      updateNode(ds.id, { dx: newDx, dy: newDy });
    };
    const onUp = () => {
      if (dragState.current) {
        setGuides([]);
        setOverlayNodes(prev => { pushHistory(prev, bodyHtml); return prev; });
        dragState.current = null;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [overlayNodes, scale, updateNode, pushHistory, bodyHtml]);

  // ── Image replace ──────────────────────────────────────────────────────
  const replaceTargetId = useRef<string | null>(null);
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      if (replaceTargetId.current) {
        const node = overlayNodes.find(n => n.id === replaceTargetId.current);
        if (node?._el && node._el.tagName === "IMG") {
          (node._el as HTMLImageElement).src = src;
        }
        replaceTargetId.current = null;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Save ───────────────────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveBrandKit({
        header_html: headerRef.current?.innerHTML ?? "",
        footer_html: footerRef.current?.innerHTML ?? "",
        body_html: bodyHtml,
        template_css: interpolatedCss,
        brand_colors: brandColors,
      });
      // No intrusive alert — could replace with toast
    } catch (err: any) { alert(err.message || "Save failed"); }
    finally { setIsSaving(false); }
  }, [headerRef, footerRef, bodyHtml, interpolatedCss, brandColors]);

  // ── Dashboard header wiring ────────────────────────────────────────────
  useEffect(() => {
    setHeaderTitle("Brand Visual Editor"); setSearch({ hidden: true });
    return () => { setHeaderTitle(""); setSearch({ hidden: false }); setCta(null); setExtra(null); };
  }, [setHeaderTitle, setSearch, setCta, setExtra]);

  useEffect(() => {
    setCta({ label: isSaving ? "Saving…" : "Save Changes", onClick: handleSave, icon: <Save size={14} /> });
  }, [isSaving, handleSave, setCta]);

  // ── Toolbar ────────────────────────────────────────────────────────────
  const selectedNode = overlayNodes.find(n => n.id === selectedId) ?? null;

  useEffect(() => {
    setExtra(
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "0 8px" }}>
        <TBtn title="Undo" onClick={handleUndo}><Undo size={14} /></TBtn>
        <TBtn title="Redo" onClick={handleRedo}><Redo size={14} /></TBtn>
        <Sep />
        <GSelect value={zoom + "%"} onChange={v => setZoom(parseInt(v))} options={ZOOMS} title="Zoom" width={68} />
        <Sep />
        {/* Brand colour pickers */}
        <Palette size={13} style={{ color: "#5f6368" }} />
        <ColorBtn value={brandColors.primary_color} onChange={v => setBrandColors(c => ({ ...c, primary_color: v }))} title="Primary Color" label="Primary" />
        <ColorBtn value={brandColors.secondary_color} onChange={v => setBrandColors(c => ({ ...c, secondary_color: v }))} title="Secondary Color" label="Accent" />
        <Sep />
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFile} />
      </div>
    );
  }, [setExtra, handleUndo, handleRedo, zoom, brandColors]); // eslint-disable-line

  // ── Selected node context panel ────────────────────────────────────────
  const scaledW = PAGE_W * scale;
  const scaledH = PAGE_H * scale;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;600;700&family=Lato:wght@400;700&family=Roboto+Slab:wght@400;700&display=swap');
        .bk-overlay-node { transition: box-shadow 0.08s; }
        .bk-overlay-node:hover { box-shadow: 0 0 0 1.5px rgba(26,115,232,0.35) !important; cursor: grab; }
        .bk-overlay-node:active { cursor: grabbing; }
        .bk-body-edit:focus { outline: 2px solid #1a73e8; outline-offset: -2px; }
        .bk-body-edit:hover:not(:focus) { outline: 1px dashed rgba(26,115,232,0.4); outline-offset: -1px; }
        #bk-body p { margin: 0 0 0.5em 0; }
      `}</style>

      {/* Outer scroll wrapper */}
      <div
        ref={wrapperRef}
        style={{
          width: "100%", minHeight: "100%", overflowX: "auto", overflowY: "auto",
          background: "#eef0f4", display: "flex", flexDirection: "column",
          alignItems: "center", padding: "40px 40px 80px", boxSizing: "border-box",
        }}
        onClick={() => setSelectedId(null)}
      >
        {/* Scale stage */}
        <div style={{ width: scaledW, height: scaledH, flexShrink: 0, position: "relative" }}>

          {/* A4 Page */}
          <div
            ref={pageRef}
            onClick={e => e.stopPropagation()}
            style={{
              width: PAGE_W, height: PAGE_H, transformOrigin: "top left",
              transform: `scale(${scale})`, position: "absolute", top: 0, left: 0,
              background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            {/* Template CSS */}
            {interpolatedCss && <style>{interpolatedCss}</style>}

            {/* ── HEADER ── */}
            <div
              ref={headerRef}
              id="bk-header"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 1 }}
              dangerouslySetInnerHTML={{ __html: headerHtml }}
            />

            {/* ── BODY ── */}
            <div
              id="bk-body"
              className="bk-body-edit"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onInput={e => setBodyHtml((e.currentTarget as HTMLDivElement).innerHTML)}
              style={{
                position: "absolute", top: 200, left: 63,
                width: PAGE_W - 126, height: 780, overflowY: "hidden",
                fontSize: 13, lineHeight: 1.75, color: "#292929",
                fontFamily: "Inter, sans-serif", zIndex: 2, cursor: "text",
              }}
              dangerouslySetInnerHTML={bodyHtml ? { __html: bodyHtml } : undefined}
            >
              {!bodyHtml && (
                <>
                  <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>20 July 2024</p>
                  <br />
                  <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>Dear Matt Zhang,</p>
                  <br />
                  <p style={{ marginBottom: 8, fontWeight: 700, fontSize: 14 }}>Request for Funding to Build New Cluster Housing</p>
                  <p>Dear Sir/Madam,</p>
                  <p>I am the Head of {ctx.company_name || "Borcelle"} Real Estate, and I am writing to request funding for the construction of a new cluster housing project. We require a total of $200,000,000 (two hundred million US dollars) to complete the project.</p>
                  <p>Please consider our proposal and take action as soon as possible. We look forward to hearing from you soon. Thank you for your time and consideration.</p>
                  <br />
                  <p style={{ fontWeight: 700, fontSize: 14 }}>Sincerely,</p>
                  <br /><br />
                  <p style={{ fontWeight: 700, fontSize: 14 }}>Jamie Chastain</p>
                  <p style={{ fontSize: 13, color: "#555" }}>President of {ctx.company_name || "Borcelle"}</p>
                </>
              )}
            </div>

            {/* ── FOOTER ── */}
            <div
              ref={footerRef}
              id="bk-footer"
              style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 1 }}
              dangerouslySetInnerHTML={{ __html: footerHtml }}
            />

            {/* ── Zone guide lines ── */}
            <div style={{ position: "absolute", top: 200, left: 0, right: 0, height: 1, background: "rgba(26,115,232,0.06)", pointerEvents: "none", zIndex: 9999 }} />
            <div style={{ position: "absolute", bottom: 100, left: 0, right: 0, height: 1, background: "rgba(26,115,232,0.06)", pointerEvents: "none", zIndex: 9999 }} />

            {/* ── Snap guide lines ── */}
            {guides.map((g, i) =>
              g.type === "v"
                ? <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: g.pos, width: 1, background: "#e8175d", pointerEvents: "none", zIndex: 99999, opacity: 0.9 }} />
                : <div key={i} style={{ position: "absolute", left: 0, right: 0, top: g.pos, height: 1, background: "#e8175d", pointerEvents: "none", zIndex: 99999, opacity: 0.9 }} />
            )}

            {/* ── Overlay drag nodes ── */}
            {overlayNodes.map(node => (
              <div
                key={node.id}
                className="bk-overlay-node"
                onMouseDown={e => handleDragStart(e, node.id)}
                onClick={e => { e.stopPropagation(); setSelectedId(node.id); }}
                style={{
                  position: "absolute",
                  left: node.x + node.dx,
                  top: node.y + node.dy,
                  width: node.w,
                  height: node.h,
                  boxSizing: "border-box",
                  border: selectedId === node.id ? "2px solid #1a73e8" : "2px solid transparent",
                  borderRadius: 2,
                  zIndex: 50000,
                  background: "transparent",
                  // Resize handles shown when selected
                  ...(selectedId === node.id ? {
                    boxShadow: "0 0 0 1px rgba(26,115,232,0.3)",
                  } : {}),
                }}
              >
                {/* Corner resize indicators */}
                {selectedId === node.id && (
                  <>
                    {[
                      { top: -4, left: -4, cursor: "nw-resize" },
                      { top: -4, right: -4, cursor: "ne-resize" },
                      { bottom: -4, left: -4, cursor: "sw-resize" },
                      { bottom: -4, right: -4, cursor: "se-resize" },
                    ].map((pos, i) => (
                      <div key={i} style={{
                        position: "absolute", ...pos,
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#fff", border: "2px solid #1a73e8",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        zIndex: 50001,
                      }} />
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* ── Context panel (outside page, in scale space) ── */}
          {selectedNode && (
            <ContextPanel
              node={selectedNode}
              scale={scale}
              onUpdate={(patch) => updateNode(selectedNode.id, patch, true)}
              onReplaceImage={() => { replaceTargetId.current = selectedNode.id; fileInputRef.current?.click(); }}
              onDeselect={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Context Panel
// ════════════════════════════════════════════════════════════════════════════
function ContextPanel({ node, scale, onUpdate, onReplaceImage, onDeselect }: {
  node: OverlayNode; scale: number;
  onUpdate: (patch: Partial<OverlayNode>) => void;
  onReplaceImage: () => void;
  onDeselect: () => void;
}) {
  const panelTop = Math.max(4, (node.y + node.dy) * scale - 48);
  const panelLeft = Math.max(0, (node.x + node.dx) * scale);

  return (
    <div
      style={{
        position: "absolute", top: panelTop, left: panelLeft, zIndex: 200000,
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2,
        background: "#fff", border: "1px solid #dde1e7", borderRadius: 8,
        padding: "4px 8px", boxShadow: "0 3px 16px rgba(0,0,0,0.16)",
        maxWidth: 680,
      }}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      {node.kind === "text-block" && (
        <>
          <GSelect value={node.fontFamily || "Inter"} onChange={v => onUpdate({ fontFamily: v })} options={FONTS} width={108} title="Font" />
          <GSelect value={String(Math.round(node.fontSize || 14))} onChange={v => onUpdate({ fontSize: Number(v) })} options={FONT_SIZES} width={48} title="Size" />
          <Sep />
          <TBtn active={node.fontWeight === "bold"} onClick={() => onUpdate({ fontWeight: node.fontWeight === "bold" ? "normal" : "bold" })} title="Bold">
            <Bold size={13} strokeWidth={2.5} />
          </TBtn>
          <TBtn active={node.fontStyle === "italic"} onClick={() => onUpdate({ fontStyle: node.fontStyle === "italic" ? "normal" : "italic" })} title="Italic">
            <Italic size={13} />
          </TBtn>
          <TBtn active={node.textDecoration === "underline"} onClick={() => onUpdate({ textDecoration: node.textDecoration === "underline" ? "none" : "underline" })} title="Underline">
            <Underline size={13} />
          </TBtn>
          <Sep />
          <TBtn active={node.textAlign === "left"} onClick={() => onUpdate({ textAlign: "left" })}><AlignLeft size={13} /></TBtn>
          <TBtn active={node.textAlign === "center"} onClick={() => onUpdate({ textAlign: "center" })}><AlignCenter size={13} /></TBtn>
          <TBtn active={node.textAlign === "right"} onClick={() => onUpdate({ textAlign: "right" })}><AlignRight size={13} /></TBtn>
          <Sep />
          <ColorBtn
            value={node.color && node.color.startsWith("rgb") ? rgbToHex(node.color) : (node.color || "#000000")}
            onChange={v => onUpdate({ color: v })} title="Text Color" label="T"
          />
          <ColorBtn
            value={!node.backgroundColor || node.backgroundColor === "transparent" ? "#ffffff" :
              node.backgroundColor.startsWith("rgb") ? rgbToHex(node.backgroundColor) : node.backgroundColor}
            onChange={v => onUpdate({ backgroundColor: v })} title="Background" label="BG"
          />
          <Sep />
        </>
      )}

      {node.kind === "image" && (
        <>
          <TBtn onClick={onReplaceImage} title="Replace image">
            <Upload size={12} />
            <span style={{ fontSize: 10, marginLeft: 2 }}>Replace</span>
          </TBtn>
          <Sep />
        </>
      )}

      {/* Opacity */}
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 10, color: "#5f6368" }}>Opacity</span>
        <input type="range" min={10} max={100}
          value={Math.round((node.opacity ?? 1) * 100)}
          onChange={e => onUpdate({ opacity: Number(e.target.value) / 100 })}
          style={{ width: 55, accentColor: "#1a73e8" }}
        />
        <span style={{ fontSize: 10, color: "#5f6368", width: 24 }}>{Math.round((node.opacity ?? 1) * 100)}%</span>
      </div>
      <Sep />

      <TBtn onClick={onDeselect} title="Dismiss">✕</TBtn>
    </div>
  );
}

// ── Utility: rgb(r,g,b) → #rrggbb ────────────────────────────────────────────
function rgbToHex(rgb: string): string {
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return "#000000";
  return "#" + m.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
}
