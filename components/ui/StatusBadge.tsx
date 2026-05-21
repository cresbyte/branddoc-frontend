"use client";

import React from "react";
import { clsx } from "clsx";

type Status = "draft" | "published" | "archived" | string;

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  draft: "bg-amber-100 text-amber-700 ring-amber-200",
  archived: "bg-red-100 text-red-600 ring-red-200",
};

const STATUS_DOTS: Record<string, string> = {
  published: "bg-emerald-500",
  draft: "bg-amber-500",
  archived: "bg-red-400",
};

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 ring-gray-200";
  const dot = STATUS_DOTS[status] ?? "bg-gray-400";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1",
        style,
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", dot)} />
      {status}
    </span>
  );
}
