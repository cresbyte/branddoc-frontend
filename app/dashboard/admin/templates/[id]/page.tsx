"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, Pencil, X, Check,
} from "lucide-react";
import {
  adminGetTemplate,
  adminUpdateTemplate,
  adminGetElements,
  adminAddElement,
  adminUpdateElement,
  adminDeleteElement,
  adminUploadAsset,
  adminDeleteTemplate,
} from "@/services/templates";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: tpl, isLoading: loadingTpl } = useQuery({
    queryKey: ["admin-template", id],
    queryFn: () => adminGetTemplate(id),
    onSuccess: (d: any) => setDetailsForm({
      title: d.title, description: d.description, category: d.category,
      status: d.status, thumbnail_url: d.thumbnail_url,
      canvas_width: d.canvas_width, canvas_height: d.canvas_height,
    }),
    onError: () => toast.error("Failed to load template."),
  } as any);

  useEffect(() => {
    if (tpl) {
      setDetailsForm({
        title: tpl.title, description: tpl.description, category: tpl.category,
        status: tpl.status, thumbnail_url: tpl.thumbnail_url,
        canvas_width: tpl.canvas_width, canvas_height: tpl.canvas_height,
      });
    }
  }, [tpl]);

  const { data: elementsData, isLoading: loadingElems } = useQuery({
    queryKey: ["admin-elements", id],
    queryFn: () => adminGetElements(id),
    enabled: tab === "elements",
    onError: () => toast.error("Failed to load elements."),
  } as any);

  const elements = elementsData?.results ?? elementsData ?? [];

  // ── Mutations ──────────────────────────────────────────────────────────────
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
    onError: () => toast.error("Failed to delete element."),
  });

  const setD = (field: string, val: any) =>
    setDetailsForm((p: any) => ({ ...p, [field]: val }));

  const setNE = (field: string, val: any) =>
    setNewElement((p) => ({ ...p, [field]: val }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-8 py-5">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <button
            onClick={() => router.push("/admin/templates")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex-1 min-w-0">
            {loadingTpl ? (
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="truncate text-lg font-bold text-gray-900">{tpl?.title}</h1>
                <StatusBadge status={tpl?.status ?? "draft"} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-1">
            {(["details", "elements", "assets"] as Tab[]).map((t) => (
              <button
                key={t}
                id={`admin-tab-${t}`}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  tab === t
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-8 py-8">
        {/* ── Details Tab ──────────────────────────────────────────────────── */}
        {tab === "details" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Title</label>
                <input
                  id="admin-tpl-title"
                  value={detailsForm.title ?? ""}
                  onChange={(e) => setD("title", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  id="admin-tpl-description"
                  value={detailsForm.description ?? ""}
                  onChange={(e) => setD("description", e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Category</label>
                <select
                  id="admin-tpl-category"
                  value={detailsForm.category ?? "letterhead"}
                  onChange={(e) => setD("category", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Status</label>
                <select
                  id="admin-tpl-status"
                  value={detailsForm.status ?? "draft"}
                  onChange={(e) => setD("status", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                id="admin-save-details-btn"
                onClick={() => updateDetailsMutation.mutate()}
                disabled={updateDetailsMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-60 transition-all"
              >
                {updateDetailsMutation.isPending
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Save size={14} />}
                Save Details
              </button>
            </div>
          </div>
        )}

        {/* ── Elements Tab ─────────────────────────────────────────────────── */}
        {tab === "elements" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                id="admin-add-element-btn"
                onClick={() => setShowAddElement(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                <Plus size={15} /> Add Element
              </button>
            </div>

            {/* Visual layout preview */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Layout Preview
              </div>
              <div
                className="relative overflow-hidden bg-white"
                style={{ height: 300 }}
              >
                {elements.map((el: any) => (
                  <div
                    key={el.id}
                    title={el.placeholder_hint || el.element_type}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${(el.y / 100) * 100}%`,
                      width: `${el.width}%`,
                      height: Math.max((el.height / 112.3) * 300, 2),
                      backgroundColor:
                        el.element_type === "text"
                          ? "rgba(59,130,246,0.15)"
                          : el.background_color !== "transparent"
                          ? el.background_color
                          : "rgba(100,100,100,0.15)",
                      border: "1px solid rgba(59,130,246,0.3)",
                      borderRadius: 2,
                      fontSize: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ fontSize: 8, padding: "0 4px", textAlign: "center" }}>
                      {el.element_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Name / Hint</th>
                      <th className="px-5 py-3">Position</th>
                      <th className="px-5 py-3">Editable</th>
                      <th className="px-5 py-3">Locked</th>
                      <th className="px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadingElems
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 6 }).map((_, j) => (
                              <td key={j} className="px-5 py-3">
                                <div className="h-4 animate-pulse rounded bg-gray-100" />
                              </td>
                            ))}
                          </tr>
                        ))
                      : elements.map((el: any) => (
                          <tr key={el.id} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-3 capitalize font-medium text-gray-800">
                              {el.element_type}
                            </td>
                            <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">
                              {el.placeholder_hint || el.content?.slice(0, 30) || "—"}
                            </td>
                            <td className="px-5 py-3 text-xs text-gray-400 font-mono">
                              {el.x}%,{el.y}% — {el.width}×{el.height}
                            </td>
                            <td className="px-5 py-3">
                              <span className={`text-xs font-medium ${el.is_editable ? "text-emerald-600" : "text-gray-400"}`}>
                                {el.is_editable ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <span className={`text-xs font-medium ${el.is_locked ? "text-amber-600" : "text-gray-400"}`}>
                                {el.is_locked ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <button
                                id={`delete-elem-${el.id}`}
                                onClick={() => setDeleteElemId(el.id)}
                                className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Assets Tab ───────────────────────────────────────────────────── */}
        {tab === "assets" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-base font-semibold text-gray-800">Template Assets</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Asset Name</label>
                <input
                  id="asset-name"
                  placeholder="e.g. Company Logo"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Asset Type</label>
                <select
                  id="asset-type"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option value="svg">SVG</option>
                  <option value="image">Image</option>
                  <option value="icon">Icon</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">File URL</label>
                <input
                  id="asset-url"
                  placeholder="https://…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                id="admin-upload-asset-btn"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                <Plus size={14} /> Add Asset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add element modal */}
      {showAddElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Add Element</h2>
              <button onClick={() => setShowAddElement(false)} className="rounded-lg p-1 hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Type</label>
                <select value={newElement.element_type} onChange={(e) => setNE("element_type", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
                >
                  {ELEMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {["x", "y", "width", "height"].map((f) => (
                <div key={f}>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">{f} (%)</label>
                  <input type="number" value={newElement[f] ?? 0}
                    onChange={(e) => setNE(f, parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
                  />
                </div>
              ))}
              {newElement.element_type === "text" && (
                <>
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Content</label>
                    <input value={newElement.content || ""} onChange={(e) => setNE("content", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Font Size</label>
                    <input type="number" value={newElement.font_size ?? 14}
                      onChange={(e) => setNE("font_size", parseFloat(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Color</label>
                    <input type="color" value={newElement.color || "#000000"}
                      onChange={(e) => setNE("color", e.target.value)}
                      className="h-9 w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-0.5"
                    />
                  </div>
                </>
              )}
              <div className="col-span-2 flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={!!newElement.is_editable}
                    onChange={(e) => setNE("is_editable", e.target.checked)}
                    className="rounded"
                  /> Editable
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={!!newElement.is_locked}
                    onChange={(e) => setNE("is_locked", e.target.checked)}
                    className="rounded"
                  /> Locked
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowAddElement(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                id="confirm-add-element-btn"
                onClick={() => addElementMutation.mutate()}
                disabled={addElementMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {addElementMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteElemId}
        title="Delete Element"
        message="This will permanently remove the element from the template."
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
