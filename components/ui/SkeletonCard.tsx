"use client";

import React from "react";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Thumbnail placeholder */}
      <div className="h-48 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] [animation:shimmer_1.5s_infinite]" />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
        <div className="mt-auto h-9 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
