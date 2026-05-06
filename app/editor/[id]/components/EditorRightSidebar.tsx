import React from "react";
import { Block, sampleBrand } from "./types";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface EditorRightSidebarProps {
  selectedBlockId: string | null;
  blocks: Block[];
  updateBlockContent: (id: string, updates: any) => void;
  updateBlockStyle: (id: string, updates: any) => void;
}

/* ── Tiny reusable field components ─────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

const inputCls =
  "w-full border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white transition-all";

const selectCls =
  "w-full border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white transition-all";

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-white"
        />
        <span className="text-xs text-gray-500 font-mono">{value || "#000000"}</span>
      </div>
    </Field>
  );
}

function AlignmentField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label="Alignment">
      <div className="flex bg-gray-100 p-0.5 rounded-lg w-fit gap-0.5">
        {(["left", "center", "right"] as const).map((a) => {
          const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
          return (
            <button
              key={a}
              className={`p-1.5 rounded-md transition-colors ${value === a ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => onChange(a)}
            >
              <Icon size={13} />
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function WeightField({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label="Weight">
      <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5">
        {[
          { label: "Reg", val: 400 },
          { label: "Med", val: 500 },
          { label: "Bold", val: 600 },
          { label: "Black", val: 700 },
        ].map(({ label, val }) => (
          <button
            key={val}
            className={`flex-1 py-1 rounded-md text-xs transition-colors ${value === val ? "bg-white shadow-sm font-semibold text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => onChange(val)}
          >
            {label}
          </button>
        ))}
      </div>
    </Field>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="border-t border-gray-100" />;
}

/* ── Per-block panels ────────────────────────────────────────────────── */

function TextPanel({
  block,
  updateBlockStyle,
  id,
}: {
  block: Block;
  updateBlockStyle: (id: string, u: any) => void;
  id: string;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle>Typography</SectionTitle>
      <Row>
        <Field label="Size (px)">
          <input
            type="number"
            min={8}
            max={96}
            value={block.style.fontSize || 14}
            onChange={(e) => updateBlockStyle(id, { fontSize: Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <ColorField
          label="Color"
          value={block.style.color || "#1a1a1a"}
          onChange={(v) => updateBlockStyle(id, { color: v })}
        />
      </Row>
      {(block.type === "heading" || block.type === "subheading") && (
        <WeightField
          value={block.style.fontWeight || 600}
          onChange={(v) => updateBlockStyle(id, { fontWeight: v })}
        />
      )}
      {(block.type === "paragraph" || block.type === "blockquote") && (
        <Field label="Line height">
          <input
            type="number"
            step={0.1}
            min={1}
            max={3}
            value={block.style.lineHeight || 1.7}
            onChange={(e) =>
              updateBlockStyle(id, { lineHeight: Number(e.target.value) })
            }
            className={inputCls}
          />
        </Field>
      )}
      {block.type !== "blockquote" && (
        <AlignmentField
          value={block.style.textAlign || "left"}
          onChange={(v) => updateBlockStyle(id, { textAlign: v })}
        />
      )}
    </div>
  );
}

/* ── Main sidebar ────────────────────────────────────────────────────── */

export function EditorRightSidebar({
  selectedBlockId,
  blocks,
  updateBlockContent,
  updateBlockStyle,
}: EditorRightSidebarProps) {
  const sel = blocks.find((b) => b.id === selectedBlockId);
  const id = selectedBlockId!;

  return (
    <div className="w-[272px] bg-white border-l border-gray-100 flex flex-col flex-shrink-0 hidden md:flex">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">
          {sel ? "Block" : "Document"}
        </p>
        {sel && (
          <p className="text-[11px] text-gray-400 capitalize mt-0.5">
            {sel.type.replace(/-/g, " ")}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ── No selection: Document settings ── */}
        {!sel && (
          <>
            <div className="space-y-4">
              <SectionTitle>Page</SectionTitle>
              <Field label="Page size">
                <div className="flex gap-3 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="size" defaultChecked className="accent-blue-500" />
                    A4
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                    <input type="radio" name="size" disabled />
                    Letter
                  </label>
                </div>
              </Field>
              <Field label="Margins">
                <select className={selectCls}>
                  <option>Normal (2.54 cm)</option>
                  <option>Narrow (1.27 cm)</option>
                  <option>Wide (3.81 cm)</option>
                </select>
              </Field>
              <Field label="Base font size">
                <input type="number" defaultValue={14} className={inputCls} />
              </Field>
              <Field label="Line height">
                <select className={selectCls} defaultValue="1.7">
                  <option>1.5</option>
                  <option>1.6</option>
                  <option>1.7</option>
                  <option>1.8</option>
                  <option>2.0</option>
                </select>
              </Field>
            </div>
            <Divider />
            <div className="space-y-4">
              <SectionTitle>Brand</SectionTitle>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer ring-2 ring-gray-100 hover:ring-blue-200 transition-all"
                  style={{ backgroundColor: sampleBrand.primaryColor }}
                  title="Primary"
                />
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer ring-2 ring-gray-100 hover:ring-blue-200 transition-all"
                  style={{ backgroundColor: sampleBrand.secondaryColor }}
                  title="Secondary"
                />
              </div>
              <p className="text-xs text-gray-500">
                Font:{" "}
                <span className="font-semibold text-gray-800">{sampleBrand.font}</span>
              </p>
              <button className="text-xs text-blue-500 hover:underline font-medium">
                Edit brand settings →
              </button>
            </div>
          </>
        )}

        {/* ── Heading / Subheading / Paragraph ── */}
        {sel &&
          ["heading", "subheading", "paragraph"].includes(sel.type) && (
            <TextPanel block={sel} updateBlockStyle={updateBlockStyle} id={id} />
          )}

        {/* ── Blockquote ── */}
        {sel && sel.type === "blockquote" && (
          <div className="space-y-4">
            <TextPanel block={sel} updateBlockStyle={updateBlockStyle} id={id} />
            <Divider />
            <SectionTitle>Quote style</SectionTitle>
            <ColorField
              label="Accent color"
              value={sel.style.borderColor || sampleBrand.secondaryColor}
              onChange={(v) => updateBlockStyle(id, { borderColor: v })}
            />
            <Field label="Font style">
              <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5">
                {["italic", "normal"].map((s) => (
                  <button
                    key={s}
                    className={`flex-1 py-1 rounded-md text-xs capitalize transition-colors ${(sel.style.fontStyle || "italic") === s ? "bg-white shadow-sm font-semibold text-gray-800" : "text-gray-500"}`}
                    onClick={() => updateBlockStyle(id, { fontStyle: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ── Bullet list / Numbered list ── */}
        {sel && ["bullet-list", "numbered-list"].includes(sel.type) && (
          <div className="space-y-4">
            <SectionTitle>List style</SectionTitle>
            <Row>
              <Field label="Font size">
                <input
                  type="number"
                  value={sel.style.fontSize || 14}
                  onChange={(e) =>
                    updateBlockStyle(id, { fontSize: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </Field>
              <ColorField
                label="Color"
                value={sel.style.color || "#444444"}
                onChange={(v) => updateBlockStyle(id, { color: v })}
              />
            </Row>
            <Field label="Line height">
              <input
                type="number"
                step={0.1}
                min={1}
                max={3}
                value={sel.style.lineHeight || 1.7}
                onChange={(e) =>
                  updateBlockStyle(id, { lineHeight: Number(e.target.value) })
                }
                className={inputCls}
              />
            </Field>
            {sel.type === "bullet-list" && (
              <Field label="Marker style">
                <select
                  className={selectCls}
                  value={sel.style.listStyleType || "disc"}
                  onChange={(e) =>
                    updateBlockStyle(id, { listStyleType: e.target.value })
                  }
                >
                  <option value="disc">Disc •</option>
                  <option value="circle">Circle ○</option>
                  <option value="square">Square ▪</option>
                </select>
              </Field>
            )}
            {sel.type === "numbered-list" && (
              <Field label="Numbering style">
                <select
                  className={selectCls}
                  value={sel.style.listStyleType || "decimal"}
                  onChange={(e) =>
                    updateBlockStyle(id, { listStyleType: e.target.value })
                  }
                >
                  <option value="decimal">1, 2, 3</option>
                  <option value="upper-alpha">A, B, C</option>
                  <option value="lower-alpha">a, b, c</option>
                  <option value="upper-roman">I, II, III</option>
                  <option value="lower-roman">i, ii, iii</option>
                </select>
              </Field>
            )}
          </div>
        )}

        {/* ── Divider ── */}
        {sel && sel.type === "divider" && (
          <div className="space-y-4">
            <SectionTitle>Divider</SectionTitle>
            <ColorField
              label="Color"
              value={sel.style.color || "#e5e5e5"}
              onChange={(v) => updateBlockStyle(id, { color: v })}
            />
            <Field label="Thickness (px)">
              <input
                type="range"
                min={1}
                max={6}
                value={sel.style.thickness || 1}
                onChange={(e) =>
                  updateBlockStyle(id, { thickness: Number(e.target.value) })
                }
                className="w-full accent-blue-500"
              />
              <span className="text-xs text-gray-400">{sel.style.thickness || 1}px</span>
            </Field>
            <Field label="Width">
              <select
                className={selectCls}
                value={sel.style.width || "100%"}
                onChange={(e) => updateBlockStyle(id, { width: e.target.value })}
              >
                <option value="100%">Full (100%)</option>
                <option value="75%">75%</option>
                <option value="50%">50%</option>
              </select>
            </Field>
            <Field label="Style">
              <select
                className={selectCls}
                value={sel.style.style || "solid"}
                onChange={(e) => updateBlockStyle(id, { style: e.target.value })}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </Field>
          </div>
        )}

        {/* ── Spacer ── */}
        {sel && sel.type === "spacer" && (
          <div className="space-y-4">
            <SectionTitle>Spacer</SectionTitle>
            <Field label={`Height: ${sel.style.height || 40}px`}>
              <input
                type="range"
                min={8}
                max={200}
                value={sel.style.height || 40}
                onChange={(e) =>
                  updateBlockStyle(id, { height: Number(e.target.value) })
                }
                className="w-full accent-blue-500"
              />
            </Field>
          </div>
        )}

        {/* ── Two columns ── */}
        {sel && sel.type === "two-columns" && (
          <div className="space-y-4">
            <SectionTitle>Layout</SectionTitle>
            <Field label="Split ratio">
              <select
                className={selectCls}
                value={sel.style.split || "50/50"}
                onChange={(e) => updateBlockStyle(id, { split: e.target.value })}
              >
                <option value="50/50">50 / 50</option>
                <option value="60/40">60 / 40</option>
                <option value="40/60">40 / 60</option>
                <option value="70/30">70 / 30</option>
                <option value="30/70">30 / 70</option>
              </select>
            </Field>
            <Field label={`Column gap: ${sel.style.gap || 24}px`}>
              <input
                type="range"
                min={8}
                max={60}
                value={sel.style.gap || 24}
                onChange={(e) => updateBlockStyle(id, { gap: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </Field>
            <Divider />
            <SectionTitle>Left column</SectionTitle>
            <Field label="Heading">
              <input
                type="text"
                value={sel.content.left?.heading || ""}
                onChange={(e) =>
                  updateBlockContent(id, {
                    left: { ...sel.content.left, heading: e.target.value },
                  })
                }
                className={inputCls}
                placeholder="Column heading…"
              />
            </Field>
            <Field label="Items (one per line)">
              <textarea
                rows={4}
                value={(sel.content.left?.items || []).join("\n")}
                onChange={(e) =>
                  updateBlockContent(id, {
                    left: {
                      ...sel.content.left,
                      items: e.target.value.split("\n"),
                    },
                  })
                }
                className={`${inputCls} resize-none`}
                placeholder="Item 1&#10;Item 2"
              />
            </Field>
            <SectionTitle>Right column</SectionTitle>
            <Field label="Heading">
              <input
                type="text"
                value={sel.content.right?.heading || ""}
                onChange={(e) =>
                  updateBlockContent(id, {
                    right: { ...sel.content.right, heading: e.target.value },
                  })
                }
                className={inputCls}
                placeholder="Column heading…"
              />
            </Field>
            <Field label="Items (one per line)">
              <textarea
                rows={4}
                value={(sel.content.right?.items || []).join("\n")}
                onChange={(e) =>
                  updateBlockContent(id, {
                    right: {
                      ...sel.content.right,
                      items: e.target.value.split("\n"),
                    },
                  })
                }
                className={`${inputCls} resize-none`}
                placeholder="Item 1&#10;Item 2"
              />
            </Field>
          </div>
        )}

        {/* ── Three columns ── */}
        {sel && sel.type === "three-columns" && (
          <div className="space-y-4">
            <SectionTitle>Layout</SectionTitle>
            <Field label={`Column gap: ${sel.style.gap || 24}px`}>
              <input
                type="range"
                min={8}
                max={60}
                value={sel.style.gap || 24}
                onChange={(e) => updateBlockStyle(id, { gap: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </Field>
            <p className="text-xs text-gray-400 italic">
              Edit column text directly on the canvas.
            </p>
          </div>
        )}

        {/* ── Table ── */}
        {sel && sel.type === "table" && (
          <div className="space-y-4">
            <SectionTitle>Table</SectionTitle>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sel.style.alternating ?? true}
                onChange={(e) =>
                  updateBlockStyle(id, { alternating: e.target.checked })
                }
                className="accent-blue-500 w-4 h-4 rounded"
              />
              Alternating row colors
            </label>
            <ColorField
              label="Header background"
              value={sel.style.headerBg || "#f5f5f5"}
              onChange={(v) => updateBlockStyle(id, { headerBg: v })}
            />
            <Field label="Border style">
              <select
                className={selectCls}
                value={sel.style.borderStyle || "light"}
                onChange={(e) => updateBlockStyle(id, { borderStyle: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="none">None</option>
              </select>
            </Field>
            <Divider />
            <SectionTitle>Rows &amp; Columns</SectionTitle>
            <p className="text-xs text-gray-400">
              Click cells on the canvas to edit text directly.
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 text-xs border rounded-lg py-1.5 hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                onClick={() => {
                  const newRow = new Array(
                    (sel.content.headers || []).length,
                  ).fill("");
                  updateBlockContent(id, {
                    rows: [...(sel.content.rows || []), newRow],
                  });
                }}
              >
                + Row
              </button>
              <button
                className="flex-1 text-xs border rounded-lg py-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 font-medium transition-colors"
                onClick={() => {
                  const rows = sel.content.rows || [];
                  if (rows.length > 1)
                    updateBlockContent(id, { rows: rows.slice(0, -1) });
                }}
              >
                − Row
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 text-xs border rounded-lg py-1.5 hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                onClick={() => {
                  updateBlockContent(id, {
                    headers: [...(sel.content.headers || []), ""],
                    rows: (sel.content.rows || []).map((r: string[]) => [...r, ""]),
                  });
                }}
              >
                + Column
              </button>
              <button
                className="flex-1 text-xs border rounded-lg py-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 font-medium transition-colors"
                onClick={() => {
                  const heads = sel.content.headers || [];
                  if (heads.length > 1)
                    updateBlockContent(id, {
                      headers: heads.slice(0, -1),
                      rows: (sel.content.rows || []).map((r: string[]) =>
                        r.slice(0, -1),
                      ),
                    });
                }}
              >
                − Column
              </button>
            </div>
            {sel.content.totalsRow !== undefined && (
              <Field label="Totals row text">
                <input
                  type="text"
                  value={sel.content.totalsRow || ""}
                  onChange={(e) =>
                    updateBlockContent(id, { totalsRow: e.target.value })
                  }
                  className={inputCls}
                  placeholder="e.g. Total: $3,050"
                />
              </Field>
            )}
          </div>
        )}

        {/* ── Button ── */}
        {sel && sel.type === "button" && (
          <div className="space-y-4">
            <SectionTitle>Button</SectionTitle>
            <Field label="Label text">
              <input
                type="text"
                value={sel.content.text || ""}
                onChange={(e) => updateBlockContent(id, { text: e.target.value })}
                className={inputCls}
                placeholder="Button text…"
              />
            </Field>
            <Row>
              <ColorField
                label="Background"
                value={sel.style.bgColor || sampleBrand.primaryColor}
                onChange={(v) => updateBlockStyle(id, { bgColor: v })}
              />
              <ColorField
                label="Text color"
                value={sel.style.color || "#ffffff"}
                onChange={(v) => updateBlockStyle(id, { color: v })}
              />
            </Row>
            <Field label={`Border radius: ${sel.style.borderRadius ?? 6}px`}>
              <input
                type="range"
                min={0}
                max={32}
                value={sel.style.borderRadius ?? 6}
                onChange={(e) =>
                  updateBlockStyle(id, { borderRadius: Number(e.target.value) })
                }
                className="w-full accent-blue-500"
              />
            </Field>
            <Row>
              <Field label="H. padding">
                <input
                  type="number"
                  value={sel.style.paddingX ?? 24}
                  onChange={(e) =>
                    updateBlockStyle(id, { paddingX: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="V. padding">
                <input
                  type="number"
                  value={sel.style.paddingY ?? 10}
                  onChange={(e) =>
                    updateBlockStyle(id, { paddingY: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </Field>
            </Row>
            <AlignmentField
              value={sel.style.textAlign || "left"}
              onChange={(v) => updateBlockStyle(id, { textAlign: v })}
            />
          </div>
        )}

        {/* ── Image placeholder ── */}
        {sel && sel.type === "image-placeholder" && (
          <div className="space-y-4">
            <SectionTitle>Image</SectionTitle>
            <Field label="Width">
              <select
                className={selectCls}
                value={sel.style.width || "100%"}
                onChange={(e) => updateBlockStyle(id, { width: e.target.value })}
              >
                <option value="100%">Full width</option>
                <option value="75%">75%</option>
                <option value="50%">50%</option>
              </select>
            </Field>
            <Field label={`Height: ${sel.style.height || 200}px`}>
              <input
                type="range"
                min={80}
                max={500}
                value={sel.style.height || 200}
                onChange={(e) =>
                  updateBlockStyle(id, { height: Number(e.target.value) })
                }
                className="w-full accent-blue-500"
              />
            </Field>
          </div>
        )}

        {/* ── Signature ── */}
        {sel && sel.type === "signature" && (
          <div className="space-y-4">
            <SectionTitle>Signature</SectionTitle>
            <Field label="Closing">
              <input
                type="text"
                value={sel.content.closing || ""}
                onChange={(e) => updateBlockContent(id, { closing: e.target.value })}
                className={inputCls}
                placeholder="e.g. Sincerely,"
              />
            </Field>
            <Field label="Name">
              <input
                type="text"
                value={sel.content.name || ""}
                onChange={(e) => updateBlockContent(id, { name: e.target.value })}
                className={inputCls}
                placeholder="Full name"
              />
            </Field>
            <Field label="Title / Role">
              <input
                type="text"
                value={sel.content.title || ""}
                onChange={(e) => updateBlockContent(id, { title: e.target.value })}
                className={inputCls}
                placeholder="e.g. Creative Director"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={sel.content.email || ""}
                onChange={(e) => updateBlockContent(id, { email: e.target.value })}
                className={inputCls}
                placeholder="email@company.com"
              />
            </Field>
            <Divider />
            <SectionTitle>Signature line</SectionTitle>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sel.style.showLine ?? true}
                onChange={(e) => updateBlockStyle(id, { showLine: e.target.checked })}
                className="accent-blue-500 w-4 h-4"
              />
              Show signature line
            </label>
            {(sel.style.showLine ?? true) && (
              <Field label="Line style">
                <select
                  className={selectCls}
                  value={sel.style.lineStyle || "solid"}
                  onChange={(e) => updateBlockStyle(id, { lineStyle: e.target.value })}
                >
                  <option value="solid">Solid</option>
                  <option value="dotted">Dotted</option>
                  <option value="Sign here">Sign here label</option>
                </select>
              </Field>
            )}
          </div>
        )}

        {/* ── Brand color bar ── */}
        {sel && sel.type === "brand-color-bar" && (
          <div className="space-y-4">
            <SectionTitle>Brand color bar</SectionTitle>
            <Field label="Color">
              <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5">
                {["Primary", "Secondary"].map((c) => (
                  <button
                    key={c}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${(sel.style.color || "Primary") === c ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => updateBlockStyle(id, { color: c })}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={`Height: ${sel.style.height || 4}px`}>
              <input
                type="range"
                min={2}
                max={16}
                value={sel.style.height || 4}
                onChange={(e) =>
                  updateBlockStyle(id, { height: Number(e.target.value) })
                }
                className="w-full accent-blue-500"
              />
            </Field>
          </div>
        )}

        {/* ── Company stamp ── */}
        {sel && sel.type === "company-stamp" && (
          <div className="space-y-4">
            <SectionTitle>Company stamp</SectionTitle>
            <Field label={`Size: ${sel.style.size || 80}px`}>
              <input
                type="range"
                min={40}
                max={160}
                value={sel.style.size || 80}
                onChange={(e) =>
                  updateBlockStyle(id, { size: Number(e.target.value) })
                }
                className="w-full accent-blue-500"
              />
            </Field>
            <p className="text-xs text-gray-400 italic">
              Logo and name are pulled from your brand settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
