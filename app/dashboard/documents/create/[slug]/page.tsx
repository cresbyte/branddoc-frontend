"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Loader2,
  FileText,
  User,
  Calendar,
  Settings
} from "lucide-react";
import { api } from "@/lib/api";
import { useDashboard } from "../../../components/DashboardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

/* ─── Types ──────────────────────────────────────────────────── */
interface Template {
  id: string;
  name: string;
  slug: string;
  schema: {
    sections: any[];
  };
  default_content: any;
}

interface Brand {
  company_name: string;
  email: string;
  primary_color: string;
  // ... other fields
}

/* ─── Main Component ────────────────────────────────────────── */
export default function DynamicDocumentCreatePage() {
  const { slug } = useParams();
  const router = useRouter();
  const { setHeaderTitle } = useDashboard();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch template and active brand profile
        const [templates, brands] = await Promise.all([
          api.get("/api/base/templates/"),
          api.get("/api/base/brand-profiles/"),
        ]);
        
        // Find specific template by slug (backend usually returns a list from /api/base/templates/)
        // Assuming DRF pagination might be active, check if results exist
        const templateList = templates.results || templates;
        const brandList = brands.results || brands;

        const foundTemplate = templateList.find((t: any) => t.slug === slug);
        if (!foundTemplate) throw new Error("Template not found");
        
        setTemplate(foundTemplate);
        setBrand(brandList[0] || null);
        setContent(foundTemplate.default_content || {});
        setHeaderTitle(`Create ${foundTemplate.name}`);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, setHeaderTitle]);

  const updateContent = (sectionId: string, fieldKey: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [fieldKey]: value
      }
    }));
  };

  const addTableRow = (sectionId: string, columns: any[]) => {
    const newRow = columns.reduce((acc, col) => {
      acc[col.key] = col.default || "";
      return acc;
    }, {});
    
    setContent((prev: any) => {
      const currentSection = prev[sectionId] || { rows: [] };
      return {
        ...prev,
        [sectionId]: {
          ...currentSection,
          rows: [...(currentSection.rows || []), newRow]
        }
      };
    });
  };

  const updateTableRow = (sectionId: string, rowIndex: number, fieldKey: string, value: any) => {
    setContent((prev: any) => {
      const rows = [...(prev[sectionId]?.rows || [])];
      rows[rowIndex] = { ...rows[rowIndex], [fieldKey]: value };
      return {
        ...prev,
        [sectionId]: { ...prev[sectionId], rows }
      };
    });
  };

  const removeTableRow = (sectionId: string, rowIndex: number) => {
    setContent((prev: any) => {
      const rows = prev[sectionId]?.rows.filter((_: any, i: number) => i !== rowIndex);
      return {
        ...prev,
        [sectionId]: { ...prev[sectionId], rows }
      };
    });
  };

  const handleSave = async () => {
    if (!template) return;
    try {
      setSaving(true);
      await api.post("/api/base/documents/", {
        template: template.id,
        title: `${template.name} - ${new Date().toLocaleDateString()}`,
        content: content,
        status: "draft"
      });
      router.push("/dashboard/documents");
    } catch (err) {
      alert("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!template) return <div>Template not found</div>;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* ─── LEFT: Form ─── */}
      <div className="w-full lg:w-1/2 border-r bg-white overflow-y-auto p-6 space-y-8 pb-32">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
            <p className="text-sm text-gray-500">Fill in the details below to generate your document.</p>
          </div>
        </div>

        {template.schema.sections.map((section: any) => {
          if (section.type === "branded_header" || section.type === "branded_footer") return null;

          return (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{section.label || section.id}</h3>
                {section.description && <span className="text-[10px] text-gray-400">{section.description}</span>}
              </div>

              {section.type === "meta_block" && (
                <div className="grid grid-cols-2 gap-4">
                  {section.fields?.map((field: any) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs text-gray-500">{field.label}</Label>
                      <Input 
                        type={field.type} 
                        value={content[section.id]?.[field.key] || ""} 
                        onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                        placeholder={field.label}
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.type === "address_block" && (
                <div className="space-y-3">
                  {section.fields?.map((field: any) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs text-gray-500">{field.label}</Label>
                      {field.type === "textarea" ? (
                        <Textarea 
                          value={content[section.id]?.[field.key] || ""} 
                          onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                        />
                      ) : (
                        <Input 
                          type={field.type} 
                          value={content[section.id]?.[field.key] || ""} 
                          onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.type === "table" && (
                <div className="space-y-3">
                   <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {section.columns?.map((col: any) => (
                              <th key={col.key} className="text-left py-2 font-medium text-gray-500" style={{ width: col.width }}>
                                {col.label}
                              </th>
                            ))}
                            <th className="w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(content[section.id]?.rows || []).map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="border-b last:border-0 group">
                              {section.columns?.map((col: any) => (
                                <td key={col.key} className="py-2 pr-2">
                                  {col.type === "computed" ? (
                                    <div className="h-9 flex items-center px-3 font-medium text-gray-700 bg-gray-50 rounded">
                                      {/* Simple formula eval: qty * rate */}
                                      {col.formula === "qty * rate" ? (row.qty * row.rate || 0).toFixed(2) : "0.00"}
                                    </div>
                                  ) : (
                                    <Input 
                                      type={col.type === "currency" || col.type === "number" ? "number" : "text"}
                                      value={row[col.key] || ""}
                                      onChange={(e) => updateTableRow(section.id, rIdx, col.key, e.target.value)}
                                      className="border-none shadow-none focus-visible:ring-1"
                                    />
                                  )}
                                </td>
                              ))}
                              <td>
                                <button onClick={() => removeTableRow(section.id, rIdx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                   <button 
                    onClick={() => addTableRow(section.id, section.columns)}
                    className="w-full py-2 border border-dashed rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                   >
                     <Plus size={14} /> Add Row
                   </button>
                </div>
              )}

              {section.type === "rich_text" && (
                <Textarea 
                  placeholder={section.placeholder || "Start typing..."}
                  value={content[section.id]?.text || (typeof content[section.id] === 'string' ? content[section.id] : "")}
                  onChange={(e) => {
                    const val = e.target.value;
                    setContent((prev: any) => ({
                      ...prev,
                      [section.id]: val
                    }));
                  }}
                  className="min-h-[120px]"
                />
              )}

              {section.type === "signature_block" && (
                <div className="grid grid-cols-2 gap-4">
                   {section.fields?.map((field: any) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs text-gray-500">{field.label}</Label>
                      <Input 
                        value={content[section.id]?.[field.key] || ""} 
                        onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                      />
                    </div>
                   ))}
                </div>
              )}

              <Separator />
            </div>
          );
        })}
      </div>

      {/* ─── RIGHT: Live Preview ─── */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 flex-col items-center p-12 overflow-y-auto">
         <div className="w-full max-w-[600px] h-fit bg-white shadow-2xl rounded-sm p-12 flex flex-col min-h-[842px]" style={{ fontVariantNumeric: "lining-nums" }}>
            {/* Branded Header */}
            <div className="flex justify-between items-start border-b-2 pb-6 mb-8" style={{ borderColor: brand?.primary_color || "#111827" }}>
               <div>
                  <div className="w-12 h-12 rounded bg-blue-600 mb-2 flex items-center justify-center text-white font-bold text-xl">
                    {brand?.company_name?.[0] || "D"}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{brand?.company_name || "Company Name"}</h2>
                  <p className="text-xs text-gray-500">{brand?.email}</p>
               </div>
               <div className="text-right">
                  <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{template.name}</h1>
                  <p className="text-xs text-gray-400">#{content.meta?.invoice_number || content.lc_details?.lc_number || "001"}</p>
               </div>
            </div>

            {/* Dynamic Content Rendering in Preview */}
            <div className="flex-1 space-y-8">
               {template.schema.sections?.map((section: any) => {
                 if (section.type === "branded_header" || section.type === "branded_footer") return null;

                 return (
                   <div key={section.id + "_preview"}>
                      {section.type === "address_block" && (
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-blue-600 mb-2">{section.label}</p>
                              <p className="font-bold text-gray-900">{content[section.id]?.name}</p>
                              <p className="text-xs text-gray-600">{content[section.id]?.company}</p>
                              <p className="text-xs text-gray-600 whitespace-pre-wrap">{content[section.id]?.address}</p>
                           </div>
                        </div>
                      )}

                      {section.type === "table" && (
                        <div className="mt-4">
                           <table className="w-full text-xs">
                              <thead className="bg-gray-50">
                                 <tr>
                                    {section.columns?.map((col: any) => (
                                      <th key={col.key} className="text-left p-2 font-bold text-gray-700 capitalize">{col.label}</th>
                                    ))}
                                 </tr>
                              </thead>
                              <tbody>
                                 {(content[section.id]?.rows || []).map((row: any, ridx: number) => (
                                   <tr key={ridx} className="border-b">
                                      {section.columns?.map((col: any) => (
                                        <td key={col.key} className="p-2">
                                           {col.type === "computed" ? 
                                             (row.qty * row.rate || 0).toFixed(2) : 
                                             (row[col.key] || "—")}
                                        </td>
                                      ))}
                                   </tr>
                                 ))}
                              </tbody>
                           </table>
                           {section.show_totals && (
                              <div className="flex justify-end mt-4">
                                 <div className="w-48 space-y-2">
                                    <div className="flex justify-between font-bold text-sm pt-2 border-t-2" style={{ borderColor: brand?.primary_color }}>
                                       <span>Total</span>
                                       <span>{(content[section.id]?.rows || []).reduce((acc: number, r: any) => acc + (r.qty * r.rate || 0), 0).toFixed(2)}</span>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                      )}

                      {section.type === "rich_text" && (
                        <div className="p-2 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {content[section.id] || "No content provided."}
                        </div>
                      )}

                      {section.type === "signature_block" && (
                        <div className="mt-12 w-64">
                           <div className="border-b-2 border-gray-900 pb-2">
                              {/* Signature placeholder */}
                           </div>
                           <p className="mt-2 text-xs font-bold">{content[section.id]?.signatory_name}</p>
                           <p className="text-[10px] text-gray-500 uppercase">{content[section.id]?.signatory_title}</p>
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>

            {/* Branded Footer */}
            <div className="mt-12 pt-6 border-t text-center text-[10px] text-gray-400">
               {brand?.company_name} · {brand?.email} · Generated via Branddoc
            </div>
         </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t flex items-center justify-between px-12 z-50">
         <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Autosaved</div>
         </div>
         <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
               <Download size={16} /> Export PDF
            </Button>
            <Button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white gap-2 px-8" onClick={handleSave} disabled={saving}>
               {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
               Save & Finish
            </Button>
         </div>
      </div>
    </div>
  );
}
