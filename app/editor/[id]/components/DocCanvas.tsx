"use client"

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"

/* ─────────────────────────────────────────────
   CONSTANTS  (all in px, matching Google Docs)
───────────────────────────────────────────── */
const PAGE_WIDTH_PX = 816 // 8.5 inches @ 96 dpi
const PAGE_HEIGHT_PX = 1056 // 11 inches  @ 96 dpi
const PAGE_MARGIN_PX = 96 // 1-inch margin
const PAGE_GAP_PX = 16 // gap between pages
const CANVAS_H_PAD = 48 // horizontal padding around page
const SCROLLBAR_W = 14 // custom scrollbar width

/* ─────────────────────────────────────────────
   PAGE SEPARATOR
───────────────────────────────────────────── */
function PageSeparator() {
  return (
    <div
      style={{
        width: PAGE_WIDTH_PX,
        height: PAGE_GAP_PX,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "#c0c0c0",
        }}
      />
      {/* bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "#c0c0c0",
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   CUSTOM SCROLLBAR + PAGE TOOLTIP
───────────────────────────────────────────── */
function CustomScrollbar({
  scrollTop,
  scrollHeight,
  clientHeight,
  numPages,
  pageHeight,
  pageGap,
  onScroll,
}: {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  numPages: number
  pageHeight: number
  pageGap: number
  onScroll: (top: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>()
  const dragStart = useRef({ y: 0, scrollTop: 0 })

  const ratio = clientHeight / scrollHeight
  const thumbH = Math.max(30, clientHeight * ratio)
  const maxThumbTop = clientHeight - thumbH
  const thumbTop =
    scrollHeight > clientHeight
      ? (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop
      : 0

  // Current page (1-based)
  const pageUnitH = pageHeight + pageGap
  const currentPage = Math.min(numPages, Math.floor(scrollTop / pageUnitH) + 1)

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const newScrollTop =
      ((clickY - thumbH / 2) / maxThumbTop) * (scrollHeight - clientHeight)
    onScroll(Math.max(0, Math.min(scrollHeight - clientHeight, newScrollTop)))
  }

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    dragStart.current = { y: e.clientY, scrollTop }
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      const dy = e.clientY - dragStart.current.y
      const newScrollTop =
        dragStart.current.scrollTop +
        (dy / maxThumbTop) * (scrollHeight - clientHeight)
      onScroll(Math.max(0, Math.min(scrollHeight - clientHeight, newScrollTop)))
    }
    const onUp = () => setDragging(false)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [dragging, maxThumbTop, scrollHeight, clientHeight, onScroll])

  // Show tooltip while scrolling
  useEffect(() => {
    setShowTooltip(true)
    clearTimeout(tooltipTimer.current)
    tooltipTimer.current = setTimeout(() => setShowTooltip(false), 1200)
  }, [scrollTop])

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: SCROLLBAR_W,
        backgroundColor: "#f1f3f4",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Up arrow */}
      <button
        onMouseDown={() => onScroll(Math.max(0, scrollTop - 40))}
        style={{
          height: 14,
          width: SCROLLBAR_W,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width={8} height={5} viewBox="0 0 8 5">
          <path d="M4 0L8 5H0z" fill="#5f6368" />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        onMouseDown={handleTrackClick}
        style={{ flex: 1, position: "relative", cursor: "pointer" }}
      >
        {/* Thumb */}
        <div
          onMouseDown={handleThumbMouseDown}
          style={{
            position: "absolute",
            top: thumbTop,
            left: 2,
            right: 2,
            height: thumbH,
            borderRadius: 7,
            backgroundColor: dragging ? "#80868b" : "#bdc1c6",
            cursor: "grab",
            transition: dragging ? "none" : "background 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "#9aa0a6")
          }
          onMouseLeave={(e) => {
            if (!dragging)
              (e.currentTarget as HTMLElement).style.backgroundColor = "#bdc1c6"
          }}
        />

        {/* Page tooltip pill */}
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              right: SCROLLBAR_W + 2,
              top: thumbTop + thumbH / 2 - 12,
              backgroundColor: "#202124",
              color: "#fff",
              fontSize: 12,
              fontFamily: "'Google Sans', Arial, sans-serif",
              padding: "3px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 50,
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {currentPage} of {numPages}
          </div>
        )}
      </div>

      {/* Down arrow */}
      <button
        onMouseDown={() =>
          onScroll(Math.min(scrollHeight - clientHeight, scrollTop + 40))
        }
        style={{
          height: 14,
          width: SCROLLBAR_W,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width={8} height={5} viewBox="0 0 8 5">
          <path d="M4 5L0 0H8z" fill="#5f6368" />
        </svg>
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN: DocsCanvas
───────────────────────────────────────────── */
interface DocsCanvasProps {
  numPages?: number
  children?: (pageIndex: number) => ReactNode
}

export function DocsCanvas({ numPages = 2, children }: DocsCanvasProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(600)

  const pageUnitH = PAGE_HEIGHT_PX + PAGE_GAP_PX
  const totalContentH = numPages * PAGE_HEIGHT_PX + (numPages - 1) * PAGE_GAP_PX
  // add vertical padding above first page and below last
  const VERT_PAD = 24
  const scrollHeight = totalContentH + VERT_PAD * 2

  const handleScroll = useCallback((top: number) => {
    setScrollTop(top)
    if (outerRef.current) outerRef.current.scrollTop = top
  }, [])

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const onScroll = () => setScrollTop(el.scrollTop)
    const onResize = () => setClientHeight(el.clientHeight)
    el.addEventListener("scroll", onScroll)
    const ro = new ResizeObserver(onResize)
    ro.observe(el)
    setClientHeight(el.clientHeight)
    return () => {
      el.removeEventListener("scroll", onScroll)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        overflow: "hidden",
        backgroundColor: "#e8eaed",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Scrollable area (hidden native scrollbar) */}
      <div
        ref={outerRef}
        style={{
          flex: 1,
          overflowY: "scroll",
          overflowX: "auto",
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE */,
          position: "relative",
        }}
      >
        {/* Inner content column — centers the pages */}
        <div
          style={{
            minWidth: PAGE_WIDTH_PX + CANVAS_H_PAD * 2,
            paddingTop: VERT_PAD,
            paddingBottom: VERT_PAD,
            paddingLeft: CANVAS_H_PAD,
            paddingRight: CANVAS_H_PAD + SCROLLBAR_W,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Hamburger / outline menu icon — top-left */}
          <div
            style={{
              position: "absolute",
              top: VERT_PAD + 12,
              left: 12,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "pointer",
              color: "#5f6368",
              zIndex: 2,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "#e0e0e0")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent")
            }
            title="Document outline"
          >
            {/* Three-line hamburger */}
            <svg width="16" height="14" viewBox="0 0 16 14">
              <rect
                x="0"
                y="0"
                width="16"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="0"
                y="6"
                width="12"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="0"
                y="12"
                width="10"
                height="2"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Pages */}
          {Array.from({ length: numPages }).map((_, idx) => (
            <React.Fragment key={idx}>
              {/* Page */}
              <div
                data-page={idx + 1}
                style={{
                  width: PAGE_WIDTH_PX,
                  minHeight: PAGE_HEIGHT_PX,
                  backgroundColor: "#ffffff",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.20), 0 1px 1px rgba(0,0,0,0.14)",
                  border: "1px solid #c7c7c7",
                  position: "relative",
                  flexShrink: 0,
                  // inner padding = 1 inch
                  padding: `${PAGE_MARGIN_PX}px`,
                  boxSizing: "border-box",
                }}
              >
                {children ? children(idx) : null}
              </div>

              {/* Page separator gap (not after last page) */}
              {idx < numPages - 1 && <PageSeparator />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Custom scrollbar overlaid on the right */}
      <CustomScrollbar
        scrollTop={scrollTop}
        scrollHeight={scrollHeight}
        clientHeight={clientHeight}
        numPages={numPages}
        pageHeight={PAGE_HEIGHT_PX}
        pageGap={PAGE_GAP_PX}
        onScroll={handleScroll}
      />

      {/* Hide native webkit scrollbar */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
