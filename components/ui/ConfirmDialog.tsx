"use client";

import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      id="confirm-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 animate-in fade-in zoom-in-95">
        {/* Close */}
        <button
          id="confirm-dialog-close"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
            danger ? "bg-red-100" : "bg-blue-100"
          }`}
        >
          <AlertTriangle
            size={22}
            className={danger ? "text-red-600" : "text-blue-600"}
          />
        </div>

        <h2 className="mb-1 text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            id="confirm-dialog-cancel"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            id="confirm-dialog-confirm"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all ${
              danger
                ? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-200"
                : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
