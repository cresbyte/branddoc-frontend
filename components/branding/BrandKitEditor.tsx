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
      height: "100%",
      width: "100%",
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
           style="height: 300px; margin: 40px 0; background: #FFFFFF; border: 2px dashed #E5E7EB; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-family: 'DM Sans', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500;">
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
    <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-hidden text-[#111827]">
      {/* Editor Header - Matching Dashboard Topbar */}
      <div className="h-[52px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-1.5 hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg transition-colors text-[#6B7280] hover:text-[#111827]"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[15px] font-semibold tracking-tight text-[#111827] leading-none mb-0.5">Brand Visual Editor</h1>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-bold">Headers & Footers</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 mr-2 bg-[#F9FAFB] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
            <Info size={14} className="text-[#2563EB]" />
            <span className="text-[11px] font-medium text-[#6B7280]">Changes apply to all new documents</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: "#1D4ED8",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              height: 32,
              padding: "0 14px",
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            className="hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Blocks & Components */}
        <div className="w-72 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2">
             <Layout size={14} className="text-[#9CA3AF]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Components</span>
          </div>
          <div id="blocks" className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             {/* GrapesJS Blocks will be appended here */}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-[#F1F5F9] relative p-8 overflow-auto flex flex-col items-center">
          <div 
            ref={editorRef} 
            className="w-full max-w-[850px] bg-white rounded-xl shadow-sm border border-[#E5E7EB]" 
            style={{ minHeight: "800px" }}
          />
        </div>

        {/* Right Sidebar: Styles */}
        <div className="w-80 bg-white border-l border-[#E5E7EB] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2">
             <Palette size={14} className="text-[#9CA3AF]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Design System</span>
          </div>
          <div id="styles-container" className="flex-1 overflow-y-auto p-4 custom-scrollbar text-[#4B5563] text-sm bg-white">
             {/* GrapesJS Style Manager will be appended here */}
          </div>

          <div className="p-6 bg-[#FFFBEB]/50 border-t border-[#FDE68A]/40">
             <div className="flex items-center gap-2 text-[#D97706] mb-2">
                <Info size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wide">Brand Tokens</span>
             </div>
             <p className="text-[11px] text-[#92400E] leading-relaxed opacity-80">
                Drag <strong>tokens</strong> into your header or footer to keep info dynamic. 
                They'll be replaced with your actual data when generating docs.
             </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Fix GrapesJS general backgrounds for Light Mode */
        .gjs-one-bg { background-color: #FFFFFF !important; }
        .gjs-two-bg { background-color: #F9FAFB !important; }
        .gjs-three-bg { background-color: #EFF6FF !important; }
        .gjs-four-color { color: #1D4ED8 !important; }
        .gjs-four-color-h:hover { color: #2563EB !important; }

        .gjs-cv-canvas {
          top: 0;
          width: 100%;
          height: 100%;
          background-color: transparent !important;
        }
        
        /* Sidebars Overrides */
        #blocks, #styles-container {
           background-color: #FFFFFF !important;
        }

        .gjs-block {
          width: auto !important;
          min-height: auto !important;
          padding: 10px 12px !important;
          background-color: #FFFFFF !important;
          border: 0.5px solid #E5E7EB !important;
          color: #4B5563 !important;
          border-radius: 8px !important;
          margin: 0 0 8px 0 !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          transition: all 0.2s !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          justify-content: flex-start !important;
          box-shadow: none !important;
        }
        .gjs-block:hover {
          background-color: #F9FAFB !important;
          color: #1D4ED8 !important;
          border-color: #BFDBFE !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
        }
        .gjs-sm-sector-title {
          background-color: transparent !important;
          border-bottom: 0.5px solid #F3F4F6 !important;
          color: #111827 !important;
          padding: 14px 0 !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 0.05em !important;
        }
        .gjs-sm-properties {
          background-color: transparent !important;
        }
        .gjs-sm-property {
            border: none !important;
            padding: 10px 0 !important;
        }
        .gjs-sm-label {
            color: #6B7280 !important;
            font-size: 11px !important;
            font-weight: 500 !important;
        }
        .gjs-field {
            background-color: #F9FAFB !important;
            border: 0.5px solid #E5E7EB !important;
            border-radius: 6px !important;
            color: #111827 !important;
            font-size: 11.5px !important;
            padding: 4px 8px !important;
        }
        .gjs-field-checkbox {
            width: 14px !important;
            height: 14px !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        /* Hide GrapesJS default UI elements that look dated */
        .gjs-sm-sector-caret {
          color: #9CA3AF !important;
        }
        
        /* Light style for tokens/blocks category titles */
        .gjs-block-category, .gjs-sm-sector {
          border-bottom: 0.5px solid #F3F4F6 !important;
        }
        .gjs-block-category .gjs-title, .gjs-sm-sector .gjs-title {
          background-color: #F9FAFB !important;
          color: #6B7280 !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          padding: 8px 12px !important;
        }
      `}</style>
    </div>
  );
}
