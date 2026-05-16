"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { Save, ChevronLeft, Info, Type, Palette, Maximize, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveBrandKit } from "@/lib/api";

interface BrandKitEditorProps {
  initialKit: {
    header_html: string;
    footer_html: string;
    template_css: string;
  };
}

export function BrandKitEditor({ initialKit }: BrandKitEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!editorRef.current) return;

    // Use a unique ID for the container to avoid conflicts
    const gjsEditor = grapesjs.init({
      container: editorRef.current,
      fromElement: false,
      height: "calc(100vh - 64px)",
      width: "auto",
      storageManager: false, // We handle storage manually via API
      panels: { defaults: [] }, // We'll customize panels
      blockManager: {
        appendTo: "#blocks",
        blocks: [
          {
            id: "section",
            label: "<b>Section</b>",
            attributes: { class: "gjs-block-section" },
            content: `<section style="padding: 20px; display: flex; align-items: center; justify-content: center;">New Section</section>`,
          },
          {
            id: "text",
            label: "Text",
            content: '<div data-gjs-type="text">Insert your text here</div>',
          },
          {
            id: "image",
            label: "Image",
            select: true,
            content: { type: "image" },
            activate: true,
          },
        ],
      },
      styleManager: {
        appendTo: "#styles-container",
        sectors: [
          {
            name: "Dimension",
            open: false,
            buildProps: ["width", "height", "max-width", "min-height", "margin", "padding"],
          },
          {
            name: "Typography",
            open: false,
            buildProps: ["font-family", "font-size", "font-weight", "letter-spacing", "color", "line-height", "text-align", "text-decoration", "text-shadow"],
          },
          {
            name: "Decorations",
            open: false,
            buildProps: ["border-radius-c", "background-color", "border-radius", "border", "box-shadow", "background"],
          },
          {
            name: "Extra",
            open: false,
            buildProps: ["transition", "perspective", "transform"],
          },
        ],
      },
    });

    // --- SETUP INITIAL CONTENT ---
    const combinedContent = `
      <style>${initialKit.template_css || ""}</style>
      <div id="brand-header-container" data-gjs-name="Header Section">
        ${initialKit.header_html || ""}
      </div>
      <div id="brand-content-placeholder" 
           data-gjs-draggable="false" 
           data-gjs-removable="false" 
           data-gjs-copyable="false" 
           data-gjs-selectable="false"
           style="height: 300px; margin: 40px 0; background: #f8fafc; border: 2px dashed #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">
        [ Dynamic Document Content Area ]
      </div>
      <div id="brand-footer-container" data-gjs-name="Footer Section">
        ${initialKit.footer_html || ""}
      </div>
    `;

    gjsEditor.setComponents(combinedContent);

    // Add Brand Tokens (Placeholders)
    const bm = gjsEditor.BlockManager;
    bm.add("token-company", {
      label: "Company Name",
      category: "Brand Tokens",
      content: "<span>{{company_name}}</span>",
      attributes: { class: "fa fa-building" },
    });
    bm.add("token-logo", {
        label: "Brand Logo",
        category: "Brand Tokens",
        content: '<img src="{{logo_url}}" style="max-height: 50px;" />',
    });
    bm.add("token-email", {
        label: "Email",
        category: "Brand Tokens",
        content: "<span>{{email}}</span>",
    });

    setEditor(gjsEditor);

    return () => {
      gjsEditor.destroy();
    };
  }, [initialKit]);

  const handleSave = async () => {
    if (!editor) return;

    try {
      setIsSaving(true);
      
      // Extract bits back
      const wrapper = editor.getWrapper();
      const header = wrapper.find("#brand-header-container")[0];
      const footer = wrapper.find("#brand-footer-container")[0];
      
      const headerHtml = header ? header.toHTML() : "";
      const footerHtml = footer ? footer.toHTML() : "";
      const css = editor.getCss();

      await saveBrandKit({
        header_html: headerHtml,
        footer_html: footerHtml,
        template_css: css,
      });

      alert("Brand kit saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save brand kit");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden text-white">
      {/* Editor Header */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Visual Brand Designer</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Customize Identity Layout</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 mr-4 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <Info size={14} className="text-blue-400" />
            <span className="text-[11px] text-slate-400">Editing Header & Footer only</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brand-primary hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            {isSaving ? "Syncing..." : <>Save Changes <Save size={16} /></>}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Blocks & Components */}
        <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-700 flex items-center gap-2 opacity-50">
             <Layout size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Components</span>
          </div>
          <div id="blocks" className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             {/* GrapesJS Blocks will be appended here */}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-slate-200 relative">
          <div ref={editorRef} />
        </div>

        {/* Right Sidebar: Styles */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-700 flex items-center gap-2 opacity-50">
             <Palette size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Design System</span>
          </div>
          <div id="styles-container" className="flex-1 overflow-y-auto p-4 custom-scrollbar text-slate-300 text-sm">
             {/* GrapesJS Style Manager will be appended here */}
          </div>

          <div className="p-6 bg-slate-900/40 border-t border-slate-700">
             <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Info size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wide">Pro Tip</span>
             </div>
             <p className="text-[11px] text-slate-500 leading-relaxed">
                Use <code>{"{{company_name}}"}</code> or other tokens to keep data dynamic. 
                Static text will be saved literally.
             </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gjs-cv-canvas {
          top: 0;
          width: 100%;
          height: 100%;
        }
        .gjs-block {
          width: auto !important;
          min-height: auto !important;
          padding: 8px !important;
          background-color: #1e293b !important;
          border: 1px solid #334155 !important;
          color: #94a3b8 !important;
          border-radius: 8px !important;
          margin: 0 0 8px 0 !important;
          font-size: 12px !important;
          transition: all 0.2s !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          justify-content: flex-start !important;
        }
        .gjs-block:hover {
          background-color: #334155 !important;
          color: white !important;
          border-color: #1d4ed8 !important;
        }
        .gjs-sm-sector-title {
          background-color: transparent !important;
          border-bottom: 1px solid #334155 !important;
          color: #f1f5f9 !important;
          padding: 12px 0 !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 1px !important;
        }
        .gjs-sm-property {
            border: none !important;
            padding: 8px 0 !important;
        }
        .gjs-sm-label {
            color: #94a3b8 !important;
            font-size: 11px !important;
        }
        .gjs-field {
            background-color: #0f172a !important;
            border: 1px solid #334155 !important;
            border-radius: 4px !important;
            color: #f1f5f9 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
