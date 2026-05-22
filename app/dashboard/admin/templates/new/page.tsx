"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TextField } from "@/components/DesignSystem/TextField";
import { SelectField } from "@/components/DesignSystem/SelectField";
import { TextAreaField } from "@/components/DesignSystem/TextAreaField";
import { Button } from "@/components/DesignSystem/Button";
import { ImageUpload } from "@/components/DesignSystem/ImageUpload";
import { 
  ArrowLeft, Save, Type, Maximize
} from "lucide-react";
import { adminCreateTemplate } from "@/services/templates";
import { useDashboard } from "../../../components/DashboardContext";

const CATEGORIES = ["letterhead", "invoice", "certificate", "proposal", "other"];
const STATUSES = ["draft", "published", "archived"];

export default function AdminNewTemplatePage() {
  const router = useRouter();
  const { setHeaderTitle } = useDashboard();

  useEffect(() => {
    setHeaderTitle("Create New Template");
  }, [setHeaderTitle]);

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
      router.push(`/dashboard/admin/templates/${data.id ?? ""}`);
    },
    onError: () => toast.error("Failed to create template."),
  });

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="py-2 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/dashboard/admin/templates")}
          icon={ArrowLeft}
        >
          Back to List
        </Button>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="rounded-[24px] border-[1.5px] border-slate-200 bg-white p-10 shadow-sm transition-all hover:border-slate-300">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField 
                label="Template Title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Modern Professional Invoice"
                icon={Type}
              />
            </div>

            <div className="sm:col-span-2">
              <TextAreaField 
                label="Description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="A clean, minimalist template for tech companies..."
              />
            </div>

            <SelectField 
              label="Category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              options={CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
            />

            <SelectField 
              label="Initial Status"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              options={STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
            />

            <div className="sm:col-span-2">
              <ImageUpload 
                label="Template Thumbnail"
                value={form.thumbnail_url}
                onChange={(url) => set("thumbnail_url", url)}
              />
            </div>

            <TextField 
              label="Canvas Width (px)"
              type="number"
              value={form.canvas_width}
              onChange={(e) => set("canvas_width", parseInt(e.target.value))}
              icon={Maximize}
            />

            <TextField 
              label="Canvas Height (px)"
              type="number"
              value={form.canvas_height}
              onChange={(e) => set("canvas_height", parseInt(e.target.value))}
              icon={Maximize}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
            <Button
              size="lg"
              onClick={() => mutation.mutate()}
              loading={mutation.isPending}
              disabled={!form.title}
              icon={Save}
              className="px-10"
            >
              Create Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
