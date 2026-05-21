"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { getTemplateDetail, getUserDesign, saveUserDesign, updateUserDesign } from "@/services/templates";
import EditorCanvas from "@/components/editor/EditorCanvas";
import ElementList from "@/components/editor/ElementList";
import PropertiesPanel from "@/components/editor/PropertiesPanel";

type Override = Record<string, any>;

export default function DashboardEditorPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const designId = searchParams.get("design_id");

  const [designTitle, setDesignTitle] = useState("Untitled Design");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load template
  const { data: templateData, isLoading: loadingTemplate } = useQuery<any>({
    queryKey: ["template", id],
    queryFn: () => getTemplateDetail(id),
  });

  // Load existing design
  const { data: designData, isLoading: loadingDesign } = useQuery<any>({
    queryKey: ["design", designId],
    queryFn: () => getUserDesign(designId!),
    enabled: !!designId,
  });

  useEffect(() => {
    if (designData?.title) setDesignTitle(designData.title);
  }, [designData]);

  const templateElements: any[] = templateData?.elements ?? [];

  const mergedElements = templateElements.map((el: any) => ({
    ...el,
    ...(overrides[el.id] || {}),
  }));

  const baseElements = designId && designData?.merged_elements
    ? designData.merged_elements.map((el: any) => ({
        ...el,
        ...(overrides[el.id] || {}),
      }))
    : mergedElements;

  const selectedElement = baseElements.find((el: any) => el.id === selectedId) ?? null;

  const handleSelect = useCallback((eid: string | null) => setSelectedId(eid), []);

  const handleElementChange = useCallback((eid: string, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [eid]: { ...(prev[eid] || {}), content: value },
    }));
  }, []);

  const handlePropChange = useCallback((eid: string, field: string, value: any) => {
    setOverrides((prev) => ({
      ...prev,
      [eid]: { ...(prev[eid] || {}), [field]: value },
    }));
  }, []);

  const handleSave = async () => {
    if (!templateData) return;
    setIsSaving(true);

    const SAVEABLE_FIELDS = [
      "content", "font_size", "color", "font_family", "font_weight",
      "text_align", "asset_url", "x", "y", "width", "height", "opacity",
    ];

    const changes = Object.entries(overrides).map(([element_id, fields]) => ({
      element_id,
      ...Object.fromEntries(
        Object.entries(fields).filter(([k]) => SAVEABLE_FIELDS.includes(k)),
      ),
    }));

    const payload = {
      title: designTitle,
      template_id: id,
      changes,
      ...(designId ? { design_id: designId } : {}),
    };

    try {
      const result = designId
        ? await updateUserDesign(designId, payload)
        : await saveUserDesign(payload);

      toast.success("Design saved!");

      if (!designId && result?.id) {
        router.replace(`/dashboard/templates/${id}/edit?design_id=${result.id}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = loadingTemplate || (!!designId && loadingDesign);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* Top Bar for Editor */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={designTitle}
            onChange={(e) => setDesignTitle(e.target.value)}
            className="rounded px-2 py-1 text-sm font-semibold transition hover:bg-gray-50 focus:bg-gray-50 outline-none"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 shrink-0 overflow-y-auto border-r border-gray-100 bg-white p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase text-gray-400">Elements</p>
          <ElementList elements={baseElements} selectedId={selectedId} onSelect={handleSelect} />
        </div>
        <div className="flex-1 overflow-hidden relative">
          {isLoading ? (
            <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : (
            <EditorCanvas
              elements={baseElements}
              canvasWidth={templateData?.canvas_width}
              canvasHeight={templateData?.canvas_height}
              selectedId={selectedId}
              onSelect={handleSelect}
              onElementChange={handleElementChange}
            />
          )}
        </div>
        <div className="w-64 shrink-0 overflow-y-auto border-l border-gray-100 bg-white">
          <PropertiesPanel element={selectedElement} onChange={handlePropChange} />
        </div>
      </div>
    </div>
  );
}
