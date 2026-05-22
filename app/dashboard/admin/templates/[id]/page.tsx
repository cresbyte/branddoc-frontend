"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, X, Check,
} from "lucide-react";
import { TextField } from "@/components/DesignSystem/TextField";
import { SelectField } from "@/components/DesignSystem/SelectField";
import { TextAreaField } from "@/components/DesignSystem/TextAreaField";
import { Button } from "@/components/DesignSystem/Button";
import { ImageUpload } from "@/components/DesignSystem/ImageUpload";
import { 
  Type, Layers, Globe, Building2, Sparkles, Maximize
} from "lucide-react";
import {
  adminGetTemplate,
  adminUpdateTemplate,
  adminGetElements,
  adminAddElement,
  adminDeleteElement,
} from "@/services/templates";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useDashboard } from "../../../components/DashboardContext";

type Tab = "details" | "elements" | "assets";

const CATEGORIES = ["letterhead", "invoice", "certificate", "proposal", "other"];
const STATUSES = ["draft", "published", "archived"];
const ELEMENT_TYPES = ["text", "image", "svg", "shape", "line"];

export default function AdminTemplateEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("details");
  const [deleteElemId, setDeleteElemId] = useState<string | null>(null);
  const [showAddElement, setShowAddElement] = useState(false);
  const [newElement, setNewElement] = useState<Record<string, any>>({
    element_type: "text", x: 5, y: 5, width: 40, height: 10,
    content: "", font_size: 14, color: "#000000", is_editable: true, is_locked: false,
  });
  const [detailsForm, setDetailsForm] = useState<Record<string, any>>({});
  const { setHeaderTitle } = useDashboard();

  useEffect(() => {
    setHeaderTitle("Edit Template");
  }, [setHeaderTitle]);

  const { data: tpl, isLoading: loadingTpl } = useQuery<any>({
    queryKey: ["admin-template", id],
    queryFn: () => adminGetTemplate(id),
  });

  useEffect(() => {
    if (tpl) {
      setDetailsForm({
        title: tpl.title, description: tpl.description, category: tpl.category,
        status: tpl.status, thumbnail_url: tpl.thumbnail_url,
        canvas_width: tpl.canvas_width, canvas_height: tpl.canvas_height,
      });
      setHeaderTitle(`Edit: ${tpl.title}`);
    }
  }, [tpl, setHeaderTitle]);

  const { data: elementsData, isLoading: loadingElems } = useQuery<any>({
    queryKey: ["admin-elements", id],
    queryFn: () => adminGetElements(id),
    enabled: tab === "elements",
  });

  const elements = elementsData?.results ?? elementsData ?? [];

  const updateDetailsMutation = useMutation({
    mutationFn: () => adminUpdateTemplate(id, detailsForm),
    onSuccess: () => {
      toast.success("Template saved.");
      qc.invalidateQueries({ queryKey: ["admin-template", id] });
    },
    onError: () => toast.error("Failed to save."),
  });

  const addElementMutation = useMutation({
    mutationFn: () => adminAddElement({ ...newElement, template: id }),
    onSuccess: () => {
      toast.success("Element added.");
      qc.invalidateQueries({ queryKey: ["admin-elements", id] });
      setShowAddElement(false);
    },
    onError: () => toast.error("Failed to add element."),
  });

  const deleteElemMutation = useMutation({
    mutationFn: (eid: string) => adminDeleteElement(eid),
    onSuccess: () => {
      toast.success("Element deleted.");
      qc.invalidateQueries({ queryKey: ["admin-elements", id] });
    },
  });

  const setD = (field: string, val: any) =>
    setDetailsForm((p: any) => ({ ...p, [field]: val }));

  const setNE = (field: string, val: any) =>
    setNewElement((p) => ({ ...p, [field]: val }));

  return (
    <div className="py-2">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard/admin/templates")}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft size={13} /> Back to List
        </button>
      </div>

      <div className="mb-6 flex gap-1 border-b border-gray-100">
        {(["details", "elements", "assets"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 ${
              tab === t
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {tab === "details" && (
          <div className="rounded-[24px] border-[1.5px] border-slate-200 bg-white p-10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField 
                  label="Template Title"
                  value={detailsForm.title ?? ""}
                  onChange={(e) => setD("title", e.target.value)}
                  placeholder="Enter template title..."
                  icon={Type}
                />
              </div>
              
              <div className="sm:col-span-2">
                <TextAreaField 
                  label="Description"
                  value={detailsForm.description ?? ""}
                  onChange={(e) => setD("description", e.target.value)}
                  rows={3}
                  placeholder="Describe this template..."
                />
              </div>

              <SelectField 
                label="Category"
                value={detailsForm.category ?? "letterhead"}
                onChange={(e) => setD("category", e.target.value)}
                options={CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
              />

              <SelectField 
                label="Status"
                value={detailsForm.status ?? "draft"}
                onChange={(e) => setD("status", e.target.value)}
                options={STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              />

              <div className="sm:col-span-2">
                <ImageUpload 
                  label="Template Thumbnail"
                  value={detailsForm.thumbnail_url ?? ""}
                  onChange={(url) => setD("thumbnail_url", url)}
                />
              </div>

              <TextField 
                label="Canvas Width (px)"
                type="number"
                value={detailsForm.canvas_width ?? 794}
                onChange={(e) => setD("canvas_width", parseInt(e.target.value))}
                icon={Maximize}
              />

              <TextField 
                label="Canvas Height (px)"
                type="number"
                value={detailsForm.canvas_height ?? 1123}
                onChange={(e) => setD("canvas_height", parseInt(e.target.value))}
                icon={Maximize}
              />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => updateDetailsMutation.mutate()}
                loading={updateDetailsMutation.isPending}
                icon={Save}
                size="lg"
                className="px-8"
              >
                Save Template
              </Button>
            </div>
          </div>
        )}

        {tab === "elements" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddElement(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
              >
                <Plus size={15} /> Add Element
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Layout Preview
              </div>
              <div className="relative overflow-hidden bg-white" style={{ height: 350 }}>
                {elements.map((el: any) => (
                  <div
                    key={el.id}
                    title={el.placeholder_hint || el.element_type}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      backgroundColor: el.element_type === "text" ? "rgba(59,130,246,0.1)" : "rgba(100,100,100,0.1)",
                      border: "1.5px solid rgba(59,130,246,0.4)",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      overflow: "hidden",
                    }}
                  >
                    <span className="text-[10px] font-medium p-1 text-center truncate">{el.placeholder_hint || el.element_type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Name / Hint</th>
                      <th className="px-6 py-4">Position (%)</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadingElems ? (
                      <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</td></tr>
                    ) : elements.map((el: any) => (
                      <tr key={el.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 capitalize font-semibold text-gray-900">{el.element_type}</td>
                        <td className="px-6 py-4 text-gray-600">{el.placeholder_hint || "—"}</td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-400">
                          X:{el.x} Y:{el.y} | {el.width}×{el.height}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => setDeleteElemId(el.id)}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "assets" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-sm text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Plus size={24} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Asset Management Coming Soon</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">Upload images, icons and background SVGs to use in your templates.</p>
          </div>
        )}
      </div>

      {showAddElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Element</h2>
              <button onClick={() => setShowAddElement(false)} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <SelectField 
                  label="Element Type"
                  value={newElement.element_type}
                  onChange={(e) => setNE("element_type", e.target.value)}
                  options={ELEMENT_TYPES.map(t => ({ value: t, label: t.toUpperCase() }))}
                />
              </div>
              
              <div className="col-span-2">
                <TextField 
                  label="Placeholder Hint"
                  placeholder="e.g. Company Name"
                  value={newElement.placeholder_hint || ""} 
                  onChange={(e) => setNE("placeholder_hint", e.target.value)}
                />
              </div>

              {["x", "y", "width", "height"].map((f) => (
                <div key={f}>
                  <TextField 
                    label={`${f.toUpperCase()} (%)`}
                    type="number"
                    value={newElement[f] ?? 0}
                    onChange={(e) => setNE(f, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowAddElement(false)}
                className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => addElementMutation.mutate()}
                disabled={addElementMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                {addElementMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Create Element
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteElemId}
        title="Delete Element"
        message="This will permanently remove the element from the template. This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (deleteElemId) deleteElemMutation.mutate(deleteElemId);
          setDeleteElemId(null);
        }}
        onCancel={() => setDeleteElemId(null)}
      />
    </div>
  );
}
