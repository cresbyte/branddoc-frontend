"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Pencil, Archive, FileText } from "lucide-react";
import { adminGetTemplates, adminDeleteTemplate } from "@/services/templates";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useDashboard } from "../../components/DashboardContext";

export default function AdminTemplateListPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const { setHeaderTitle } = useDashboard();

  useEffect(() => {
    setHeaderTitle("Template Management");
  }, [setHeaderTitle]);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["admin-templates"],
    queryFn: adminGetTemplates,
  });

  const templates = data?.results ?? data ?? [];

  const archiveMutation = useMutation({
    mutationFn: (id: string) => adminDeleteTemplate(id),
    onSuccess: () => {
      toast.success("Template archived.");
      qc.invalidateQueries({ queryKey: ["admin-templates"] });
    },
    onError: () => toast.error("Failed to archive template."),
  });

  return (
    <div className="py-2">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push("/dashboard/admin/templates/new")}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus size={15} /> New Template
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Thumbnail</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Elements</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                : templates.map((tpl: any) => (
                    <tr key={tpl.id} className="transition hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {tpl.thumbnail_url ? (
                          <img
                            src={tpl.thumbnail_url}
                            alt=""
                            className="h-10 w-14 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 text-gray-300">
                            <FileText size={16} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{tpl.title}</td>
                      <td className="px-6 py-4 capitalize text-gray-500">{tpl.category}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tpl.status} disableMenu />
                      </td>
                      <td className="px-6 py-4 text-gray-500">{tpl.element_count ?? tpl.elements?.length ?? 0}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(tpl.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/admin/templates/${tpl.id}`)}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            onClick={() => setArchiveId(tpl.id)}
                            disabled={tpl.status === "archived"}
                            className="flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-40"
                          >
                            <Archive size={11} /> Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && templates.length === 0 && (
            <div className="py-16 text-center text-sm text-gray-400">No templates found.</div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!archiveId}
        title="Archive Template"
        message="This will hide the template from users. You can restore it by editing its status."
        confirmLabel="Archive"
        danger
        onConfirm={() => {
          if (archiveId) archiveMutation.mutate(archiveId);
          setArchiveId(null);
        }}
        onCancel={() => setArchiveId(null)}
      />
    </div>
  );
}
