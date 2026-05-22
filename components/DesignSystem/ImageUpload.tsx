"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { adminUploadAsset } from "@/services/templates";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ label, value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await adminUploadAsset(formData);
      onChange(res.file_url ?? res.file);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group border-[1.5px] border-dashed rounded-medium bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-400",
          value ? "h-40 border-slate-200" : "h-32 border-slate-300"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-xs font-medium">Uploading...</span>
          </div>
        ) : value ? (
          <div className="relative w-full h-full p-2">
            <img 
              src={value} 
              alt="Uploaded Preview" 
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 p-1.5 bg-white shadow-md border border-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-slate-200">
              <Upload size={20} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">Upload Image</span>
          </div>
        )}
      </div>
    </div>
  );
}
