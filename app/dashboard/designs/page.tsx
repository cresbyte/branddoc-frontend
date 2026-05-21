"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileText, Pencil, Trash2, Plus } from "lucide-react";
import { getUserDesigns, deleteUserDesign } from "@/services/templates";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useDashboard } from "../components/DashboardContext";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function DashboardDesignsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { setHeaderTitle } = useDashboard();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setHeaderTitle("My Designs");
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["designs"],
    queryFn: getUserDesigns,
  });

  const designs = data?.results ?? data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserDesign(id),
    onSuccess: () => {
      toast.success("Design deleted.");
      qc.invalidateQueries({ queryKey: ["designs"] });
    },
    onError: () => toast.error("Failed to delete design."),
  });

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      ) : designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
            <FileText size={32} className="text-gray-300" />
          </div>
          <p className="text-lg font-semibold text-gray-700">
            You haven&apos;t saved any designs yet.
          </p>
          <button
            onClick={() => router.push("/dashboard/templates")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={15} /> Browse Templates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design: any) => (
            <div
              key={design.id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-gray-900">{design.title}</h3>
                {design.template && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    Based on: {design.template.title}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-400">
                Last edited: {formatDate(design.updated_at)}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/templates/${design.template?.id}/edit?design_id=${design.id}`,
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(design.id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Design"
        message="Are you sure you want to permanently delete this design?"
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
