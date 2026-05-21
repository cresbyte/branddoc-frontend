"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPublishedTemplates } from "@/services/templates";
import TemplateCard from "@/components/templates/TemplateCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { useDashboard } from "../components/DashboardContext";
import { Search, FileText } from "lucide-react";

export default function DashboardTemplateGalleryPage() {
  const router = useRouter();
  const { setHeaderTitle, setSearch } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sync header
  useEffect(() => {
    setHeaderTitle("Browse Templates");
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  // Sync search
  useEffect(() => {
    setSearch({
      placeholder: "Search templates...",
      value: searchTerm,
      onChange: (v) => setSearchTerm(v),
    });
    return () => setSearch({ value: "" });
  }, [searchTerm, setSearch]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["templates", debouncedSearch],
    queryFn: () => getPublishedTemplates(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const templates = data?.results ?? data ?? [];

  const handleSelect = useCallback(
    (id: string) => router.push(`/dashboard/templates/${id}/edit`),
    [router],
  );

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-red-500">Could not load templates</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileText size={28} className="text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-700">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((tpl: any) => (
            <TemplateCard key={tpl.id} template={tpl} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
