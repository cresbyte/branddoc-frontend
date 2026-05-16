"use client"

import { TemplateCard } from "@/components/branding/TemplateCard";
import { api, getBrandKit, getBrandTemplates, selectTemplate } from "@/lib/api";
import {
  CheckCircle2,
  LayoutTemplate,
  Loader2,
  MoreVertical,
  Palette,
  Plus,
  Settings,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDashboard } from "../components/DashboardContext";

interface BrandProfile {
  id: string;
  user: string;
  company_name: string;
  tagline: string;
  logo: string | null;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  heading_font: string;
  body_font: string;
  base_font_size: number;
  footer_text: string;
  created_at: string;
  updated_at: string;
}

interface BrandTemplate {
  id: string;
  name: string;
  description: string;
  style_tag: string;
  header_html: string;
  footer_html: string;
  template_css: string;
  is_active: boolean;
  is_premium: boolean;
}

interface UserBrandKit {
  id: string;
  template: BrandTemplate | null;
  header_html: string;
  footer_html: string;
  template_css: string;
  created_at: string;
  updated_at: string;
}

const SAMPLE_BRAND: BrandProfile = {
  id: "sample",
  user: "sample",
  company_name: "Acme Corp",
  tagline: "Innovating the Future",
  logo: null,
  email: "hello@acme.com",
  phone: "+1 (555) 000-0000",
  website: "www.acme.com",
  address: "123 Innovation Way",
  city: "San Francisco",
  country: "USA",
  primary_color: "#1D4ED8",
  secondary_color: "#1E293B",
  accent_color: "#F59E0B",
  text_color: "#111827",
  background_color: "#FFFFFF",
  heading_font: "inter",
  body_font: "inter",
  base_font_size: 11,
  footer_text: "{{company_name}} • {{website}} • {{email}}",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

/* ─── Main Page ──────────────────────────────────────────────── */
export default function BrandsPage() {
  const { setHeaderTitle, setCta } = useDashboard();
  const router = useRouter();
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [brandTemplates, setBrandTemplates] = useState<BrandTemplate[]>([]);
  const [activeKit, setActiveKit] = useState<UserBrandKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    setHeaderTitle("Brands");
    setCta({
      label: "Create Profile",
      onClick: () => console.log("Create Brand clicked"),
      icon: <Plus size={14} />
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const [brandsData, templatesData, kitData] = await Promise.all([
          api.get("/api/base/brand-profiles/"),
          getBrandTemplates(),
          getBrandKit().catch(() => null), // If no kit yet, ignore error
        ]);
        setBrands(brandsData?.results || []);
        setBrandTemplates(templatesData?.results || []);
        setActiveKit(kitData);
      } catch (err: any) {
        setError(err.message || "Failed to load branding data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setHeaderTitle("");
      setCta(null);
    };
  }, [setHeaderTitle, setCta]);

  const handleSelectTemplate = async (template: BrandTemplate) => {
    try {
      setIsSelecting(true);
      await selectTemplate(template.id);
      // Redirect to the editor after initial selection
      router.push("/dashboard/brands/editor");
    } catch (err: any) {
      alert(err.message || "Failed to select template");
    } finally {
      setIsSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 font-medium mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg shadow-sm hover:shadow-md transition-all font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-brand-primary rounded-2xl p-10 mb-10 text-white shadow-xl shadow-blue-100">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-200" />
            <span className="text-xs font-bold tracking-widest uppercase text-blue-100">Identity Management</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">
            Design your professional identity with Brand Templates
          </h2>
          <p className="text-blue-50/90 text-lg mb-6 leading-relaxed">
            Professionally crafted layouts for your documentation.
            Maintain a consistent, world-class image across every department.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-brand-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg shadow-black/5">
              Explore Catalog <Zap size={16} />
            </button>
            {activeKit && (
              <button
                onClick={() => router.push("/dashboard/brands/editor")}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                Open Visual Editor <Settings size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Palette size={240} />
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Active Identities SECTION */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-slate-900">Registered Brand Profiles</h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {brands.length} Total
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brands.map(brand => (
                <div key={brand.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-inner"
                        style={{ background: `linear-gradient(135deg, ${brand.primary_color}, ${brand.secondary_color})` }}
                    >
                        {brand.company_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-slate-900 font-bold text-lg leading-tight group-hover:text-brand-primary transition-colors">{brand.company_name}</h4>
                        <p className="text-slate-400 text-sm font-medium">{brand.tagline || "Brand Identity System"}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100 uppercase tracking-wide">
                            <CheckCircle2 size={14} /> Active
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>
            ))}

            <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex items-center justify-center gap-3 text-slate-400 hover:text-brand-primary hover:border-brand-primary hover:bg-blue-50/50 transition-all group">
                <Plus className="w-5 h-5 transition-transform group-hover:scale-125" />
                <span className="font-bold text-sm uppercase tracking-widest">Register New Identity</span>
            </button>
        </div>
      </div>

      {/* Template Library SECTION */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <LayoutTemplate className="text-brand-primary" />
                    Layout Library
                </h3>
                <p className="text-slate-500 font-medium">Select a base HTML architecture for your documents</p>
            </div>

            <div className="hidden md:flex gap-2 text-xs font-bold uppercase text-slate-400 tracking-widest">
                <span>Filter: </span>
                <button className="text-brand-primary">All</button>
                <button className="hover:text-brand-primary transition-colors">Minimal</button>
                <button className="hover:text-brand-primary transition-colors">Enterprise</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brandTemplates.map(t => (
                <TemplateCard
                    key={t.id}
                    template={t}
                    selected={activeKit?.template?.id === t.id}
                    onSelect={handleSelectTemplate}
                    isSelecting={isSelecting}
                />
            ))}
        </div>
      </div>

      {/* Editor Tip */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-primary shadow-sm border border-slate-100 flex-shrink-0">
              <Zap size={20} />
          </div>
          <div>
              <h5 className="text-sm font-bold text-slate-900">Dynamic Synchronization</h5>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Our templates use dynamic placeholders. Once selected, you can use the <strong>Visual Editor</strong> to fine-tune
                  the HTML and CSS. Changes are automatically reflected in all pending documents.
              </p>
          </div>
      </div>
    </div>
  );
}
