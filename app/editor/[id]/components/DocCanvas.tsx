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
const RULER_H = 22 // horizontal ruler height
const RULER_V_W = 14 // vertical ruler width (left)
const SCROLLBAR_W = 14 // custom scrollbar width

/* Ruler: 8.5 inches, tick every 1/8 inch */
const INCH_PX = 96
const RULER_TOTAL_INCHES = 8.5
const RULER_TICKS: { x: number; label: string; major: boolean }[] = []
for (let i = 0; i <= RULER_TOTAL_INCHES * 8; i++) {
  const inch = i / 8
  const isMajor = i % 8 === 0
  const isHalf = i % 4 === 0 && !isMajor
  const isQuarter = i % 2 === 0 && !isMajor && !isHalf
  if (isMajor || isHalf || isQuarter || true) {
    RULER_TICKS.push({
      x: inch * INCH_PX,
      label:
        isMajor && inch > 0 && inch < RULER_TOTAL_INCHES
          ? String(Math.round(inch))
          : "",
      major: isMajor || isHalf,
    })
  }
}

/* ─────────────────────────────────────────────
   HORIZONTAL RULER
───────────────────────────────────────────── */
function HorizontalRuler({ pageLeft }: { pageLeft: number }) {
  // pageLeft = left edge of the page in the scroll container
  const marginLeft = PAGE_MARGIN_PX
  const marginRight = PAGE_MARGIN_PX
  const textAreaWidth = PAGE_WIDTH_PX - marginLeft - marginRight

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "row",
        height: RULER_H,
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e0e0e0",
        userSelect: "none",
        flexShrink: 0,
        width: "100%",
      }}
    >
      {/* Left gutter — same width as canvas left pad + vertical ruler */}
      <div
        style={{
          width: pageLeft + RULER_V_W,
          flexShrink: 0,
          backgroundColor: "#f8f9fa",
          borderRight: "none",
        }}
      />

      {/* Left margin (greyed) */}
      <div
        style={{
          width: marginLeft,
          flexShrink: 0,
          backgroundColor: "#e8eaed",
          borderTop: "none",
          position: "relative",
        }}
      />

      {/* Active text area ruler */}
      <div
        style={{
          width: textAreaWidth,
          flexShrink: 0,
          backgroundColor: "#f8f9fa",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width={textAreaWidth}
          height={RULER_H}
          style={{ display: "block" }}
        >
          {/* tick marks */}
          {RULER_TICKS.filter((t) => t.x <= textAreaWidth + 2).map((t, i) => {
            const h = t.major ? 8 : 5
            return (
              <line
                key={i}
                x1={t.x}
                y1={RULER_H - h}
                x2={t.x}
                y2={RULER_H - 1}
                stroke="#9aa0a6"
                strokeWidth={t.major ? 1 : 0.75}
              />
            )
          })}
          {/* inch labels */}
          {RULER_TICKS.filter((t) => t.label).map((t, i) => (
            <text
              key={i}
              x={t.x}
              y={8}
              textAnchor="middle"
              fontSize={9}
              fill="#5f6368"
              fontFamily="Arial, sans-serif"
            >
              {t.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Right margin (greyed) */}
      <div
        style={{
          width: marginRight,
          flexShrink: 0,
          backgroundColor: "#e8eaed",
        }}
      />

      {/* Blue indent handles on top of text area */}
      {/* Left indent triangle */}
      <div
        style={{
          position: "absolute",
          left: pageLeft + RULER_V_W + marginLeft - 1,
          top: 0,
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "8px solid #1a73e8",
          cursor: "col-resize",
          zIndex: 5,
        }}
      />
      {/* Right indent triangle */}
      <div
        style={{
          position: "absolute",
          right: marginRight + SCROLLBAR_W - 5,
          top: 0,
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "8px solid #1a73e8",
          cursor: "col-resize",
          zIndex: 5,
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   VERTICAL RULER  (left side, sticky)
───────────────────────────────────────────── */
function VerticalRuler({
  scrollTop,
  pageHeight,
  pageGap,
  numPages,
}: {
  scrollTop: number
  pageHeight: number
  pageGap: number
  numPages: number
}) {
  const totalH = numPages * pageHeight + (numPages - 1) * pageGap
  const tickEvery = INCH_PX / 8
  const ticks: { y: number; major: boolean; label: string }[] = []
  for (let i = 0; i * tickEvery <= totalH; i++) {
    const inch = (i * tickEvery) / INCH_PX
    const isMajor = i % 8 === 0
    const isHalf = i % 4 === 0
    ticks.push({
      y: i * tickEvery,
      major: isMajor || isHalf,
      label: isMajor && inch > 0 ? String(Math.round(inch)) : "",
    })
  }

  return (
    <div
      style={{
        position: "sticky",
        left: 0,
        top: RULER_H,
        width: RULER_V_W,
        flexShrink: 0,
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid #e0e0e0",
        overflow: "hidden",
        zIndex: 15,
        alignSelf: "flex-start",
        height: `calc(100vh - ${RULER_H}px)`,
      }}
    >
      <svg
        width={RULER_V_W}
        height={totalH}
        style={{ display: "block", transform: `translateY(-${scrollTop}px)` }}
      >
        {ticks.map((t, i) => {
          const w = t.major ? 7 : 4
          return (
            <React.Fragment key={i}>
              <line
                x1={RULER_V_W - w}
                y1={t.y}
                x2={RULER_V_W - 1}
                y2={t.y}
                stroke="#9aa0a6"
                strokeWidth={t.major ? 1 : 0.75}
              />
              {t.label && (
                <text
                  x={4}
                  y={t.y + 3}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#5f6368"
                  fontFamily="Arial, sans-serif"
                  transform={`rotate(-90, 4, ${t.y})`}
                >
                  {t.label}
                </text>
              )}
            </React.Fragment>
          )
        })}
      </svg>
    </div>
  )
}

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

  // Center the page horizontally: canvas width = RULER_V_W + CANVAS_H_PAD + PAGE_WIDTH + CANVAS_H_PAD + SCROLLBAR_W
  const canvasInnerW =
    RULER_V_W + CANVAS_H_PAD + PAGE_WIDTH_PX + CANVAS_H_PAD + SCROLLBAR_W
  const pageLeft = CANVAS_H_PAD // offset from canvas left (excluding ruler)

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
      {/* Horizontal ruler — sticky at top */}
      <HorizontalRuler pageLeft={pageLeft} />

      {/* Body row: vertical ruler + scrollable canvas */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Vertical ruler */}
        <VerticalRuler
          scrollTop={scrollTop}
          pageHeight={PAGE_HEIGHT_PX}
          pageGap={PAGE_GAP_PX}
          numPages={numPages}
        />

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
          // Hide webkit scrollbar via inline style trick
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
      </div>

      {/* Hide native webkit scrollbar */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
