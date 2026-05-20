"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { 
  Save, Undo, Redo, ChevronDown, Layers, MoveUp, MoveDown,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from "lucide-react";
import { useRouter } from "next/navigation";
import { saveBrandKit } from "@/lib/api";
import { useDashboard } from "@/app/dashboard/components/DashboardContext";

import { interpolate } from "@/lib/utils";

interface BrandKitEditorProps {
  initialKit: any;
  profile?: any;
}

/* ── Primitives for Toolbar ────────────────────────────────────────────── */
function Sep() {
  return <div style={{ width: 1, height: 20, backgroundColor: "#e0e0e0", flexShrink: 0, margin: "0 4px" }} />;
}

function TBtn({ active, onClick, title, disabled, children, style }: {
  active?: boolean; onClick?: () => void; title?: string;
  disabled?: boolean; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); if (!disabled && onClick) onClick(); }}
      title={title} disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 28, minWidth: 28, padding: "0 6px", border: "none", borderRadius: 4,
        background: active ? "#e8f0fe" : "transparent",
        color: disabled ? "#bdbdbd" : active ? "#1a73e8" : "#3c4043",
        cursor: disabled ? "default" : "pointer", flexShrink: 0, gap: 4, fontSize: 13,
        fontFamily: "'Google Sans', Arial, sans-serif", transition: "background 0.1s", ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && !active) (e.currentTarget as HTMLElement).style.background = "#f1f3f4"; }}
      onMouseLeave={(e) => { if (!disabled && !active) (e.currentTarget as HTMLElement).style.background = active ? "#e8f0fe" : "transparent"; }}
    >
      {children}
    </button>
  );
}

function GSelect({ value, onChange, options, title }: {
  value: string | number; onChange: (v: string) => void;
  options: (string | number)[]; title?: string;
}) {
  return (
    <div title={title} style={{ position: "relative", display: "flex", alignItems: "center", height: 28, borderRadius: 4, padding: "0 8px", cursor: "pointer", flexShrink: 0, border: "1px solid transparent", transition: "border-color 0.1s, background 0.1s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f1f3f4"; (e.currentTarget as HTMLElement).style.borderColor = "#e0e0e0"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
    >
      <span style={{ fontSize: 13, color: "#3c4043", fontFamily: "'Google Sans', Arial, sans-serif", whiteSpace: "nowrap", pointerEvents: "none", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis" }}>
        {value}
      </span>
      <ChevronDown size={12} style={{ color: "#5f6368", marginLeft: 4, pointerEvents: "none", flexShrink: 0 }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} onMouseDown={(e) => e.stopPropagation()}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ActionDropdown({ title, options, onAction }: { title: string, options: {label: string, value: string}[], onAction: (v: string) => void }) {
  return (
    <div title={title} style={{ position: "relative", display: "flex", alignItems: "center", height: 28, borderRadius: 4, padding: "0 8px", cursor: "pointer", flexShrink: 0, border: "1px solid transparent", transition: "border-color 0.1s, background 0.1s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#e8f0fe"; (e.currentTarget as HTMLElement).style.borderColor = "#d2e3fc"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
    >
      <span style={{ fontSize: 13, color: "#1a73e8", fontWeight: 600, fontFamily: "'Google Sans', Arial, sans-serif", whiteSpace: "nowrap", pointerEvents: "none" }}>{title}</span>
      <ChevronDown size={12} style={{ color: "#1a73e8", marginLeft: 4, pointerEvents: "none", flexShrink: 0 }} />
      <select 
         value="" 
         onChange={(e) => { 
           if(e.target.value) onAction(e.target.value); 
           e.target.value = ""; 
         }}
         style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', height: "100%" }}
      >
        <option value="" disabled>Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function BrandKitEditor({ initialKit, profile }: BrandKitEditorProps) {

  const ctx = profile ? { ...profile, logo_url: profile.logo_url || profile.logo } : {} as any;

  const INSERT_OPTIONS = [
    // Layouts
    { label: "Text Block", value: '<div data-gjs-type="text" style="padding: 10px; font-family: Inter, sans-serif; min-width: 100px; min-height: 20px;">Text Block</div>' },
    { label: "Image", value: '<img data-gjs-type="image" src="https://via.placeholder.com/150" style="max-width: 100%;" />' },
    { label: "Empty Section", value: '<div style="padding: 20px; display: flex; align-items: center; justify-content: center; min-height: 50px; background: #f8fafc; border: 1px dashed #cbd5e1; width: 100%;">Section</div>' },
    { label: "Divider", value: '<hr style="border-top: 1px solid #cbd5e1; width: 100%; margin: 10px 0;" />' },
    // Tokens
    { label: "Token: Company Name", value: `<span style="font-family: inherit; font-weight: bold; color: inherit;">${ctx.company_name || '{{company_name}}'}</span>` },
    { label: "Token: Brand Logo", value: `<img src="${ctx.logo_url || '{{logo_url}}'}" style="max-height: 50px;" alt="Brand Logo" />` },
    { label: "Token: Email", value: `<span style="font-family: inherit; color: inherit;">${ctx.email || '{{email}}'}</span>` },
  ];

  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [zoom, setZoom] = useState<number>(100);
  
  // Tracking element state
  const [activeComponent, setActiveComponent] = useState<any>(null);
  const [activeStyles, setActiveStyles] = useState<any>({});
  
  const router = useRouter();
  const { setHeaderTitle, setSearch, setCta, setExtra } = useDashboard();

  useEffect(() => {
    // Wait until both the kit and the brand profile are available
    if (!editorRef.current || !initialKit || !profile) return;

    // Build context inside the effect so it always has the freshest profile
    const ctx = { ...profile, logo_url: profile.logo_url || profile.logo };

    const gjsEditor = grapesjs.init({
      container: editorRef.current,
      fromElement: false,
      height: "100%",
      width: "100%",
      storageManager: false,
      dragMode: "absolute",
      panels: { defaults: [] },
      canvas: {
        styles: [
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        ],
      },
    });

    const headerHtml = interpolate(initialKit?.header_html || initialKit?.template?.header_html || "", ctx);
    const footerHtml = interpolate(initialKit?.footer_html || initialKit?.template?.footer_html || "", ctx);
    const cssContent = interpolate(initialKit?.template_css || initialKit?.template?.template_css || "", ctx);

    const combinedContent = `
      <style>
        body { margin: 0; padding: 0; display: flex; flex-direction: column; min-height: 100vh; background-color: #ffffff; }
        #brand-header-container { position: relative; min-height: 150px; width: 100%; padding: 20px; box-sizing: border-box; }
        #brand-content-placeholder { flex: 1; min-height: 500px; }
        #brand-footer-container { position: relative; min-height: 100px; width: 100%; padding: 20px; box-sizing: border-box; border-top: 1px solid #f1f5f9; }
        ${cssContent}
      </style>
      <div id="brand-header-container" data-gjs-name="Header Section">
        ${headerHtml}
      </div>
      <div id="brand-content-placeholder"
           data-gjs-draggable="false"
           data-gjs-removable="false"
           data-gjs-copyable="false"
           data-gjs-selectable="false"
           style="margin: 40px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
        [ Auto-Flowing Document Content ]
      </div>
      <div id="brand-footer-container" data-gjs-name="Footer Section">
        ${footerHtml}
      </div>
    `;

    gjsEditor.setComponents(combinedContent);

    // Track selections to update toolbar
    gjsEditor.on('component:selected', (model: any) => {
      setActiveComponent(model);
      setActiveStyles(model.getStyle());
    });

    gjsEditor.on('component:deselected', () => {
      setActiveComponent(null);
      setActiveStyles({});
    });

    gjsEditor.on('component:update:style', (model: any) => {
      if (gjsEditor.getSelected() === model) {
        setActiveStyles(model.getStyle());
      }
    });

    setEditor(gjsEditor);

    return () => {
      gjsEditor.destroy();
    };
  }, [initialKit, profile]);

  // Actions
  const handleUndo = useCallback(() => editor?.runCommand("core:undo"), [editor]);
  const handleRedo = useCallback(() => editor?.runCommand("core:redo"), [editor]);
  
  const handleInsert = useCallback((htmlString: string) => {
     if (!editor) return;
     const target = editor.getSelected() || editor.getWrapper().find('#brand-header-container')[0] || editor.getWrapper();
     const newComponent = target.append(htmlString);
     if(newComponent && newComponent.length > 0) {
        editor.select(newComponent[0]);
     }
  }, [editor]);

  const handleStyleChange = useCallback((prop: string, value: string) => {
      if (!activeComponent) return;
      activeComponent.addStyle({ [prop]: value });
  }, [activeComponent]);
  
  const toggleStyle = useCallback((prop: string, activeValue: string, inactiveValue: string = '') => {
      if (!activeComponent) return;
      const current = activeComponent.getStyle()[prop];
      activeComponent.addStyle({ [prop]: current === activeValue ? inactiveValue : activeValue });
  }, [activeComponent]);

  const handleLayerMove = useCallback((direction: 'up' | 'down') => {
      if (!activeComponent) return;
      const currentZ = parseInt(activeComponent.getStyle()['z-index'] || '0');
      activeComponent.addStyle({ 'z-index': direction === 'up' ? currentZ + 1 : currentZ - 1 });
  }, [activeComponent]);

  const handleZoom = useCallback((val: string) => {
     if (!editor) return;
     const zoomLevel = parseInt(val.replace('%',''));
     setZoom(zoomLevel);
     editor.Canvas.setZoom(zoomLevel);
  }, [editor]);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    try {
      setIsSaving(true);
      const wrapper = editor.getWrapper();
      const header = wrapper.find("#brand-header-container")[0];
      const footer = wrapper.find("#brand-footer-container")[0];
      
      await saveBrandKit({
        header_html: header ? header.toHTML() : "",
        footer_html: footer ? footer.toHTML() : "",
        template_css: editor.getCss(),
      });
      alert("Brand kit saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save brand kit");
    } finally {
      setIsSaving(false);
    }
  }, [editor]);

  // Dashboard Header Integration
  useEffect(() => {
    setHeaderTitle("Brand Visual Editor");
    setSearch({ hidden: true });
    
    return () => {
      setHeaderTitle("");
      setSearch({ hidden: false });
      setCta(null);
      setExtra(null);
    };
  }, [setHeaderTitle, setSearch, setCta, setExtra]);

  useEffect(() => {
    setCta({
      label: isSaving ? "Saving..." : "Save Changes",
      onClick: handleSave,
      icon: <Save size={14} />
    });
  }, [isSaving, handleSave, setCta]);

  useEffect(() => {
    setExtra(
      <div style={{ display: "flex", alignItems: "center", gap: 1, padding: "0 8px" }}>
         <ActionDropdown title="Insert" options={INSERT_OPTIONS} onAction={handleInsert} />
         <Sep />
         <TBtn title="Undo (Ctrl+Z)" onClick={handleUndo}><Undo size={15} /></TBtn>
         <TBtn title="Redo (Ctrl+Y)" onClick={handleRedo}><Redo size={15} /></TBtn>
         <Sep />
         <GSelect value={zoom + "%"} onChange={handleZoom} options={["50%","75%","90%","100%","125%","150%","200%"]} title="Zoom" />
         <Sep />
         <TBtn active={activeStyles['font-weight'] === 'bold'} onClick={() => toggleStyle('font-weight', 'bold', 'normal')} disabled={!activeComponent} title="Bold"><Bold size={14} strokeWidth={2.5}/></TBtn>
         <TBtn active={activeStyles['font-style'] === 'italic'} onClick={() => toggleStyle('font-style', 'italic', 'normal')} disabled={!activeComponent} title="Italic"><Italic size={14} /></TBtn>
         <TBtn active={activeStyles['text-decoration'] === 'underline'} onClick={() => toggleStyle('text-decoration', 'underline', 'none')} disabled={!activeComponent} title="Underline"><Underline size={14} /></TBtn>
         <Sep />
         <TBtn active={activeStyles['text-align'] === 'left'} onClick={() => handleStyleChange('text-align', 'left')} disabled={!activeComponent} title="Align Left"><AlignLeft size={14} /></TBtn>
         <TBtn active={activeStyles['text-align'] === 'center'} onClick={() => handleStyleChange('text-align', 'center')} disabled={!activeComponent} title="Align Center"><AlignCenter size={14} /></TBtn>
         <TBtn active={activeStyles['text-align'] === 'right'} onClick={() => handleStyleChange('text-align', 'right')} disabled={!activeComponent} title="Align Right"><AlignRight size={14} /></TBtn>
         <Sep />
         
         {/* Color Pickers */}
         <div style={{ display: "flex", alignItems: "center", position: "relative" }} title="Text Color">
            <TBtn disabled={!activeComponent}>
               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>A</span>
                  <div style={{ width: 13, height: 3, backgroundColor: activeStyles['color'] || "#000000", borderRadius: 1 }} />
               </div>
            </TBtn>
            {activeComponent && (
               <input type="color" value={activeStyles['color'] || "#000000"} onChange={(e) => handleStyleChange('color', e.target.value)} style={{ position: "absolute", opacity: 0, inset: 0, cursor: "pointer", width: "100%", height: "100%" }} />
            )}
         </div>

         <div style={{ display: "flex", alignItems: "center", position: "relative" }} title="Background Color">
            <TBtn disabled={!activeComponent}>
               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, backgroundColor: activeStyles['background-color'] || "#ffffff", border: '1px solid #ccc', width: 14, height: 14, borderRadius: 2 }} />
               </div>
            </TBtn>
            {activeComponent && (
               <input type="color" value={activeStyles['background-color'] || "#ffffff"} onChange={(e) => handleStyleChange('background-color', e.target.value)} style={{ position: "absolute", opacity: 0, inset: 0, cursor: "pointer", width: "100%", height: "100%" }} />
            )}
         </div>

         <Sep />
         <TBtn disabled={!activeComponent} title="Bring Forward" onClick={() => handleLayerMove('up')}><MoveUp size={14} /> <span style={{fontSize: 11}}>Bring Forward</span></TBtn>
         <TBtn disabled={!activeComponent} title="Send Backward" onClick={() => handleLayerMove('down')}><MoveDown size={14} /> <span style={{fontSize: 11}}>Send Backward</span></TBtn>
      </div>
    );
  }, [setExtra, activeComponent, activeStyles, zoom, handleInsert, handleUndo, handleRedo, handleZoom, toggleStyle, handleStyleChange, handleLayerMove]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F9FAFB]">
      <div className="flex-1 flex flex-col items-center p-8">
        {/* ── Main Canvas Container ─────────────────────────────────────────── */}
          <div 
            ref={editorRef} 
            className="w-full max-w-[850px] bg-white rounded shadow-sm border border-[#E5E7EB]" 
            style={{ minHeight: "1100px" }}
          />
      </div>

      <style jsx global>{`
        .gjs-one-bg { background-color: transparent !important; }
        .gjs-two-bg { background-color: transparent !important; }
        .gjs-three-bg { background-color: #e8f0fe !important; }
        .gjs-four-color { color: #1a73e8 !important; }
        .gjs-four-color-h:hover { color: #1557b0 !important; }

        .gjs-cv-canvas {
          top: 0;
          width: 100%;
          height: 100%;
          background-color: transparent !important;
        }

        /* Outline for active selections */
        .gjs-dashed *[data-gjs-highlightable] {
            outline: 1px dashed rgba(170,170,170,0.5);
            outline-offset: -2px;
        }

        .gjs-selected {
            outline: 2px solid #1a73e8 !important;
            outline-offset: -2px;
        }
      `}</style>
    </div>
  );
}
