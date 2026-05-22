"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Palette, Plus, Globe, Mail, Type, 
  Trash2, Pencil, CheckCircle2, Layout,
  ChevronRight, ArrowLeft, Loader2, Sparkles, Building2
} from "lucide-react";
import { 
  getBrandProfiles, createBrandProfile, updateBrandProfile, 
  deleteBrandProfile, BrandProfile 
} from "@/services/accounts";
import toast from "react-hot-toast";

export default function BrandManagementPage() {
  const qc = useQueryClient();
  const [editingProfile, setEditingProfile] = useState<BrandProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["brand-profiles"],
    queryFn: getBrandProfiles,
  });

  const profiles = (data as any)?.results ?? data ?? [];

  const createMutation = useMutation({
    mutationFn: createBrandProfile,
    onSuccess: () => {
      toast.success("Brand profile created!");
      qc.invalidateQueries({ queryKey: ["brand-profiles"] });
      setIsCreating(false);
    },
    onError: () => toast.error("Failed to create profile."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BrandProfile> }) => updateBrandProfile(id, data),
    onSuccess: () => {
      toast.success("Profile updated!");
      qc.invalidateQueries({ queryKey: ["brand-profiles"] });
      setEditingProfile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBrandProfile,
    onSuccess: () => {
      toast.success("Profile deleted.");
      qc.invalidateQueries({ queryKey: ["brand-profiles"] });
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
        <Loader2 className="animate-spin" size={32} color="#1D4ED8" />
      </div>
    );
  }

  const handleEdit = (profile: BrandProfile) => {
    setEditingProfile(profile);
  };

  const handleSetPrimary = (profile: BrandProfile) => {
    updateMutation.mutate({ id: profile.id, data: { is_primary: true } });
  };

  if (isCreating || editingProfile) {
    return (
      <ProfileForm 
        profile={editingProfile} 
        onCancel={() => { setEditingProfile(null); setIsCreating(false); }}
        onSubmit={(data) => {
          if (editingProfile) {
            updateMutation.mutate({ id: editingProfile.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", marginBottom: 3 }}>
            Brand Kits
          </h1>
          <p style={{ fontSize: 13.5, color: "#6B7280" }}>
            Create and manage your brand identities for your documents.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: "#1D4ED8", color: "white", border: "none", borderRadius: 10,
            fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Plus size={16} /> New Brand
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
        {profiles.length === 0 ? (
          <div style={{ 
            gridColumn: "1 / -1", padding: "60px 20px", textAlign: "center",
            background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12
          }}>
            <Palette size={40} color="#D1D5DB" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>No brand kits yet</h3>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
              Create your first brand kit to store your logo, colors, and fonts.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              style={{
                padding: "8px 16px", borderRadius: 10, background: "#1D4ED8", color: "#fff",
                fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              Get Started
            </button>
          </div>
        ) : (
          profiles.map((profile: BrandProfile) => (
            <div 
              key={profile.id}
              style={{
                background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12,
                padding: "20px", display: "flex", flexDirection: "column", gap: 16,
                position: "relative", transition: "border-color 0.15s",
                borderColor: profile.is_primary ? "#1D4ED8" : "#E5E7EB"
              }}
            >
              {profile.is_primary && (
                <div style={{ 
                  position: "absolute", top: 12, right: 12, 
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 11, fontWeight: 600, color: "#1D4ED8",
                  background: "#EFF6FF", padding: "3px 8px", borderRadius: 6
                }}>
                  <CheckCircle2 size={12} /> Primary
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  width: 54, height: 54, borderRadius: 10, background: "#F9FAFB", 
                  border: "0.5px solid #E5E7EB", display: "flex", alignItems: "center", 
                  justifyContent: "center", overflow: "hidden" 
                }}>
                  {profile.logo_url ? (
                    <img src={profile.logo_url} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                  ) : (
                    <Building2 size={24} color="#D1D5DB" />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>{profile.name}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0 0" }}>{profile.tagline || "No tagline"}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 6 }}>
                  <Globe size={13} /> {profile.website || "N/A"}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={13} /> {profile.email || "N/A"}
                </div>
              </div>

              <div style={{ borderTop: "0.5px solid #F3F4F6", paddingTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {Object.values(profile.colors || {}).map((color: any, i: number) => (
                    <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: color as string, border: "0.5px solid #00000010" }} title={color as string} />
                  ))}
                </div>
                <div style={{ flex: 1 }} />
                <button 
                  onClick={() => handleEdit(profile)}
                  style={{ padding: "6px", borderRadius: 8, border: "0.5px solid #E5E7EB", background: "#fff", cursor: "pointer", color: "#4B5563" }}
                >
                  <Pencil size={15} />
                </button>
                <button 
                  onClick={() => deleteMutation.mutate(profile.id)}
                  style={{ padding: "6px", borderRadius: 8, border: "0.5px solid #FEE2E2", background: "#fff", cursor: "pointer", color: "#EF4444" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {!profile.is_primary && (
                <button 
                  onClick={() => handleSetPrimary(profile)}
                  style={{ 
                    marginTop: 8, padding: "8px", borderRadius: 10, 
                    border: "0.5px solid #E5E7EB", background: "#F9FAFB", 
                    fontSize: 13, fontWeight: 500, color: "#111827", cursor: "pointer" 
                  }}
                >
                  Set as Primary
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

import { TextField } from "@/components/DesignSystem/TextField";
import { Button } from "@/components/DesignSystem/Button";
import { ImageUpload } from "@/components/DesignSystem/ImageUpload";

function ProfileForm({ profile, onCancel, onSubmit, isSubmitting }: { 
  profile: BrandProfile | null; 
  onCancel: () => void; 
  onSubmit: (data: Partial<BrandProfile>) => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState<Partial<BrandProfile>>(profile || {
    name: "", tagline: "", website: "", logo_url: "", email: "",
    colors: { primary: "#1D4ED8", secondary: "#F9FAFB", accent: "#EFF6FF" },
    fonts: { heading: "Inter", body: "Inter" }
  });

  const handleColorChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: { ...(prev.colors || {}), [key]: value }
    }));
  };

  return (
    <div className="max-w-xl animate-in fade-in slide-in-from-left-4 duration-300">
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Back to brands
      </button>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-medium p-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {profile ? "Edit Brand Kit" : "Create New Brand"}
          </h2>
          <p className="text-sm text-slate-500">
            This information will be used to automatically personalize your documents.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <TextField 
              label="Company Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Acme Corp"
              icon={Building2}
            />

            <TextField 
              label="Tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Simplifying the future"
              icon={Sparkles}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <TextField 
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://acme.com"
                icon={Globe}
              />
              <TextField 
                label="Contact Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hello@acme.com"
                icon={Mail}
              />
            </div>

            <ImageUpload 
              label="Brand Logo"
              value={formData.logo_url || ""}
              onChange={(url) => setFormData({ ...formData, logo_url: url })}
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Palette size={16} className="text-blue-600" /> Brand Colors
            </h3>
            <div className="flex flex-wrap gap-6">
              {["primary", "secondary", "accent"].map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-400 transition-colors">
                    <input 
                      type="color" 
                      value={(formData.colors as any)[key]} 
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{key}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              loading={isSubmitting}
              className="w-full"
            >
              {profile ? "Update Brand Kit" : "Create Brand Kit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
