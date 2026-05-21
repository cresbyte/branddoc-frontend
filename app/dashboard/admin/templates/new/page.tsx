"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { adminCreateTemplate } from "@/services/templates";

const CATEGORIES = ["letterhead", "invoice", "certificate", "proposal", "other"];
const STATUSES = ["draft", "published", "archived"];

export default function AdminNewTemplatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "letterhead",
    status: "draft",
    thumbnail_url: "",
    canvas_width: 794,
    canvas_height: 1123,
  });

  const mutation = useMutation({
    mutationFn: () => adminCreateTemplate(form),
    onSuccess: (data: any) => {
      toast.success("Template created!");
      router.push(`/admin/templates/${data.id ?? ""}`);
    },
    onError: () => toast.error("Failed to create template."),
  });

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-8 py-5">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <button
            onClick={() => router.push("/admin/templates")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">New Template</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Title</label>
              <input
                id="new-tpl-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Template title…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                id="new-tpl-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Brief description…"
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Category</label>
              <select
                id="new-tpl-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Status</label>
              <select
                id="new-tpl-status"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Thumbnail URL</label>
              <input
                id="new-tpl-thumbnail"
                value={form.thumbnail_url}
                onChange={(e) => set("thumbnail_url", e.target.value)}
                placeholder="https://…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Canvas Width (px)</label>
              <input
                id="new-tpl-width"
                type="number"
                value={form.canvas_width}
                onChange={(e) => set("canvas_width", parseInt(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Canvas Height (px)</label>
              <input
                id="new-tpl-height"
                type="number"
                value={form.canvas_height}
                onChange={(e) => set("canvas_height", parseInt(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              id="new-tpl-save-btn"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || !form.title}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-60 transition-all"
            >
              {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Create Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
