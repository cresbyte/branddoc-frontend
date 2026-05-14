"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import FontFamily from "@tiptap/extension-font-family"
import { useEditorContext } from "./EditorContext"

/* ─────────────────────────────────────────────────────────
   Page geometry  (US Letter @ 96 dpi)
───────────────────────────────────────────────────────── */
export const PAGE_W    = 816
export const PAGE_H    = 1056
export const MARGIN_X  = 96
export const MARGIN_V  = 72
const CANVAS_X  = 72
const SCROLLBAR_W = 14
const VERT_PAD  = 36

/* ─────────────────────────────────────────────────────────
   FontSize – extends TextStyle, adds setFontSize command
───────────────────────────────────────────────────────── */
const FontSizeExtension = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (el) => el.style.fontSize || null,
        renderHTML: (attrs) =>
          attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
      },
    }
  },
  addCommands() {
    return {
      ...(this.parent?.() ?? {}),
      setFontSize:
        (size: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    } as any
  },
})

/* ─────────────────────────────────────────────────────────
   Custom Scrollbar
───────────────────────────────────────────────────────── */
function CustomScrollbar({
  scrollTop,
  scrollHeight,
  clientHeight,
  currentPage,
  numPages,
  onScroll,
}: {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  currentPage: number
  numPages: number
  onScroll: (top: number) => void
}) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [showTip,  setShowTip]  = useState(false)
  const tipTimer  = useRef<any>(null)
  const origin    = useRef({ y: 0, st: 0 })

  const range  = Math.max(1, scrollHeight - clientHeight)
  const thumbH = Math.max(28, (clientHeight / scrollHeight) * clientHeight)
  const maxTop = clientHeight - thumbH
  const thumbTop = (scrollTop / range) * maxTop

  useEffect(() => {
    setShowTip(true)
    clearTimeout(tipTimer.current)
    tipTimer.current = setTimeout(() => setShowTip(false), 1200)
  }, [scrollTop])

  useEffect(() => {
    if (!dragging) return
    const move = (e: MouseEvent) => {
      const dy   = e.clientY - origin.current.y
      const next = origin.current.st + (dy / maxTop) * range
      onScroll(Math.max(0, Math.min(range, next)))
    }
    const up = () => setDragging(false)
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup",   up)
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup",   up)
    }
  }, [dragging, maxTop, range, onScroll])

  const btn = (delta: number, icon: React.ReactNode) => (
    <button
      onMouseDown={() => onScroll(Math.max(0, Math.min(range, scrollTop + delta)))}
      style={{ height: 14, width: SCROLLBAR_W, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
    >{icon}</button>
  )

  return (
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: SCROLLBAR_W, backgroundColor: "#f1f3f4", zIndex: 30, display: "flex", flexDirection: "column" }}>
      {btn(-40, <svg width={8} height={5} viewBox="0 0 8 5"><path d="M4 0L8 5H0z" fill="#5f6368"/></svg>)}
      <div ref={trackRef} style={{ flex: 1, position: "relative", cursor: "pointer" }}
        onMouseDown={(e) => {
          const rect = trackRef.current!.getBoundingClientRect()
          const y    = e.clientY - rect.top
          onScroll(Math.max(0, Math.min(range, ((y - thumbH / 2) / maxTop) * range)))
        }}>
        <div
          onMouseDown={(e) => { e.preventDefault(); setDragging(true); origin.current = { y: e.clientY, st: scrollTop } }}
          style={{ position: "absolute", top: thumbTop, left: 2, right: 2, height: thumbH, borderRadius: 7, backgroundColor: dragging ? "#80868b" : "#bdc1c6", cursor: "grab" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#9aa0a6" }}
          onMouseLeave={(e) => { if (!dragging) (e.currentTarget as HTMLElement).style.backgroundColor = "#bdc1c6" }}
        />
        {showTip && (
          <div style={{ position: "absolute", right: SCROLLBAR_W + 4, top: thumbTop + thumbH / 2 - 11, backgroundColor: "#202124", color: "#fff", fontSize: 11, fontFamily: "Arial, sans-serif", padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 50 }}>
            {currentPage} / {numPages}
          </div>
        )}
      </div>
      {btn(40, <svg width={8} height={5} viewBox="0 0 8 5"><path d="M4 5L0 0H8z" fill="#5f6368"/></svg>)}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   DocsCanvas
───────────────────────────────────────────────────────── */
interface DocsCanvasProps {
  content: string
  onContentChange: (html: string) => void
}

export function DocsCanvas({ content, onContentChange }: DocsCanvasProps) {
  const { registerEditor } = useEditorContext()
  const outerRef    = useRef<HTMLDivElement>(null)
  const paperRef    = useRef<HTMLDivElement>(null)
  const [scrollTop,    setScrollTop]    = useState(0)
  const [clientHeight, setClientHeight] = useState(600)
  /* numPages derived from the PAPER's natural height – no min-height feedback */
  const [numPages,     setNumPages]     = useState(1)

  /* ── Measure paper height to compute numPages ─────────────────────
     We watch paperRef (which has NO min-height tied to numPages), so
     there is NO feedback loop. numPages only drives the scrollbar label
     and the page-separator overlays – not the paper's own size.        */
  useEffect(() => {
    const el = paperRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const h = el.scrollHeight
      setNumPages(Math.max(1, Math.ceil(h / PAGE_H)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* ── Outer scroll sync ─────────────────────────────────────────── */
  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const onScroll = () => setScrollTop(el.scrollTop)
    const onResize = () => setClientHeight(el.clientHeight)
    el.addEventListener("scroll", onScroll, { passive: true })
    const ro = new ResizeObserver(onResize)
    ro.observe(el)
    setClientHeight(el.clientHeight)
    return () => { el.removeEventListener("scroll", onScroll); ro.disconnect() }
  }, [])

  const handleScroll = useCallback((top: number) => {
    setScrollTop(top)
    if (outerRef.current) outerRef.current.scrollTop = top
  }, [])

  const currentPage  = Math.min(numPages, Math.floor(Math.max(0, scrollTop - VERT_PAD) / PAGE_H) + 1)
  const scrollHeight = VERT_PAD * 2 + numPages * PAGE_H

  /* ── TipTap ─────────────────────────────────────────────────────── */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      FontSizeExtension, // replaces TextStyle (extends it)
      Color,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    immediatelyRender: false,
    onUpdate:  ({ editor }) => onContentChange(editor.getHTML()),
    onCreate:  ({ editor }) => registerEditor(editor),
    onFocus:   ({ editor }) => registerEditor(editor),
  })

  /* ─────────────────────────────────────────────────────────────────
     Page-break rulers: 1 px gray line every PAGE_H from paper top.
     Implemented as a CSS repeating-gradient on the paper background –
     completely non-interactive, cursor is NEVER blocked.
  ───────────────────────────────────────────────────────────────── */
  const breakGradient = `repeating-linear-gradient(
    to bottom,
    transparent           0px,
    transparent           calc(${PAGE_H}px - 1px),
    #d0d3d8               calc(${PAGE_H}px - 1px),
    #d0d3d8               ${PAGE_H}px
  )`

  return (
    <div style={{ position: "relative", flex: 1, overflow: "hidden", backgroundColor: "#e8eaed", display: "flex", flexDirection: "column" }}>
      <style>{`
        div::-webkit-scrollbar { display: none; }
        .docs-prosemirror .ProseMirror { outline: none; min-height: 120px; font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.6; color: #1a1a1a; word-break: break-word; }
        .docs-prosemirror .ProseMirror > * + * { margin-top: 0; }
        .docs-prosemirror .ProseMirror p { margin: 0 0 6px; }
        .docs-prosemirror .ProseMirror h1 { font-size: 22pt; font-weight: 700; margin: 0 0 10px; line-height: 1.2; }
        .docs-prosemirror .ProseMirror h2 { font-size: 16pt; font-weight: 600; margin: 0 0 8px; line-height: 1.3; }
        .docs-prosemirror .ProseMirror h3 { font-size: 13pt; font-weight: 600; margin: 0 0 6px; }
        .docs-prosemirror .ProseMirror ul, .docs-prosemirror .ProseMirror ol { padding-left: 1.4rem; margin: 0 0 6px; }
        .docs-prosemirror .ProseMirror li { margin: 2px 0; }
        .docs-prosemirror .ProseMirror blockquote { border-left: 3px solid #d0d3d8; padding-left: 14px; color: #5f6368; margin: 8px 0; font-style: italic; }
        .docs-prosemirror .ProseMirror code { background: #f1f3f4; border-radius: 3px; padding: 1px 5px; font-family: 'Courier New', monospace; font-size: 0.88em; }
        .docs-prosemirror .ProseMirror hr { border: none; border-top: 1px solid #dadce0; margin: 10px 0; }
        .docs-prosemirror .ProseMirror p.is-editor-empty:first-child::before { content: 'Start typing…'; color: #c0c4cc; pointer-events: none; float: left; height: 0; }
        .docs-prosemirror .ProseMirror:focus { outline: none; }
      `}</style>

      <div
        ref={outerRef}
        style={{ flex: 1, overflowY: "scroll", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div style={{ minWidth: PAGE_W + CANVAS_X * 2, paddingTop: VERT_PAD, paddingBottom: VERT_PAD, paddingLeft: CANVAS_X, paddingRight: CANVAS_X + SCROLLBAR_W, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* ── Paper – grows naturally with content ── */}
          <div
            ref={paperRef}
            style={{
              width: PAGE_W,
              backgroundColor: "#ffffff",
              /* Page-break rulers via CSS gradient – no DOM elements, no z-index clash */
              backgroundImage: breakGradient,
              boxShadow: "0 1px 3px rgba(0,0,0,0.15), 0 6px 20px rgba(0,0,0,0.08)",
              border: "1px solid #c8cbcf",
              position: "relative",
            }}
          >
            {/* Right-margin page-number badges, one per break */}
            {Array.from({ length: numPages - 1 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: (i + 1) * PAGE_H + 4,
                  right: 10,
                  fontSize: 10,
                  color: "#adb5bd",
                  fontFamily: "monospace",
                  userSelect: "none",
                  pointerEvents: "none",
                  lineHeight: 1,
                }}
              >
                {i + 2}
              </div>
            ))}

            {/* ── TipTap editor ── */}
            <div
              className="docs-prosemirror"
              style={{ padding: `${MARGIN_V}px ${MARGIN_X}px` }}
            >
              {editor && (
                <BubbleMenu editor={editor} className="flex bg-white shadow-xl border border-gray-100 rounded-lg p-1 gap-0.5 z-50">
                  {(["bold","italic","underline"] as const).map((mark) => (
                    <button
                      key={mark}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (mark === "bold")      editor.chain().focus().toggleBold().run();
                        else if (mark === "italic")    editor.chain().focus().toggleItalic().run();
                        else if (mark === "underline") editor.chain().focus().toggleUnderline().run();
                      }}
                      style={{ padding: "2px 8px", borderRadius: 5, border: "none", fontSize: 13, cursor: "pointer", background: editor.isActive(mark) ? "#e8f0fe" : "transparent", color: editor.isActive(mark) ? "#1a73e8" : "#3c4043", fontWeight: mark === "bold" ? 700 : 400, fontStyle: mark === "italic" ? "italic" : "normal", textDecoration: mark === "underline" ? "underline" : "none" }}
                    >
                      {mark[0].toUpperCase()}
                    </button>
                  ))}
                  <div style={{ width: 1, background: "#e8e8e8", alignSelf: "stretch", margin: "2px 3px" }} />
                  {["#ef4444","#3b82f6","#10b981","#f59e0b","#1a1a1a"].map(c => (
                    <button key={c} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(c).run() }}
                      style={{ width: 17, height: 17, borderRadius: "50%", border: "2px solid white", background: c, cursor: "pointer", flexShrink: 0, boxShadow: "0 0 0 1px #ddd" }} />
                  ))}
                </BubbleMenu>
              )}
              <EditorContent editor={editor} />
            </div>
          </div>

        </div>
      </div>

      <CustomScrollbar
        scrollTop={scrollTop}
        scrollHeight={scrollHeight}
        clientHeight={clientHeight}
        currentPage={currentPage}
        numPages={numPages}
        onScroll={handleScroll}
      />
    </div>
  )
}
