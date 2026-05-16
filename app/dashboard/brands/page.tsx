"use client"

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
  Zap,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDashboard } from "../components/DashboardContext";
import Image from "next/image";

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brandsData, templatesData, kitData] = await Promise.all([
        api.get("/api/base/brand-profiles/"),
        getBrandTemplates(),
        getBrandKit().catch(() => null), // If no kit yet, ignore error
      ]);
      setBrands(brandsData?.results || []);
      console.log("Fetched brands:", brandsData?.results);
      setBrandTemplates(templatesData?.results || []);
      setActiveKit(kitData);
    } catch (err: any) {
      setError(err.message || "Failed to load branding data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeaderTitle("Brands");
    setCta({
      label: "Create Profile",
      onClick: () => router.push("/dashboard/brands/manage"),
      icon: <Plus size={14} />
    });

    fetchData();

    return () => {
      setHeaderTitle("");
      setCta(null);
    };
  }, [setHeaderTitle, setCta, router]);

  const handleSelectTemplate = async (template: BrandTemplate) => {
    if (brands.length === 0) {
        alert("Please create a Brand Profile identity first!");
        router.push("/dashboard/brands/create");
        return;
    }

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
    <div className="animate-in duration-500 fade-in slide-in-from-bottom-2">
      {/* Active Identities SECTION */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            Registered Brand Profiles
          </h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold tracking-wider text-slate-600 uppercase">
            {brands.length} Total
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 "
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-black text-white shadow-inner"
                style={{
                  background: brand.logo ?"none":`linear-gradient(135deg, ${brand.primary_color}, ${brand.secondary_color})`,
                }}
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={`${brand.company_name} Logo`}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <span className="font-black text-white text-xl uppercase">
                    {brand.company_name?.charAt(0) || "B"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg leading-tight text-slate-900 group-hover:text-brand-primary transition-colors">
                  {brand.company_name}
                </h4>
                <p className="text-sm font-medium text-slate-400">
                  {brand.tagline || "Brand Identity System"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/brands/manage/${brand.id}`)
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold tracking-wide text-slate-600 uppercase transition-colors hover:bg-slate-100"
                >
                  <Settings size={14} /> Edit
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Library SECTION */}
      <div className="mb-8">
        {brands.length === 0 && (
          <div className="mb-8 flex animate-in items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 duration-300 slide-in-from-top-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <Info size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight text-amber-900 uppercase">
                Identity Required
              </h4>
              <p className="mt-1 text-xs leading-relaxed font-medium text-amber-700/80">
                You need to create a Brand Profile before you can select and
                customize templates. Click{" "}
                <button
                  onClick={() => router.push("/dashboard/brands/manage")}
                  className="font-bold text-amber-900 underline"
                >
                  Create Profile
                </button>{" "}
                above to get started.
              </p>
            </div>
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
              <LayoutTemplate className="text-brand-primary" />
              Layout Library
            </h3>
            <p className="font-medium text-slate-500">
              Select a base HTML architecture for your documents
            </p>
          </div>

          <div className="hidden gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase md:flex">
            <span>Filter: </span>
            <button className="text-brand-primary">All</button>
            <button className="hover:text-brand-primary transition-colors">
              Minimal
            </button>
            <button className="hover:text-brand-primary transition-colors">
              Enterprise
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-8 transition-opacity duration-300 md:grid-cols-2 lg:grid-cols-3 ${brands.length === 0 ? "pointer-events-none opacity-50 grayscale" : ""}`}
        >
          {brandTemplates.map((t) => (
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
      <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
        <div className="text-brand-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm">
          <Zap size={20} />
        </div>
        <div>
          <h5 className="text-sm font-bold text-slate-900">
            Dynamic Synchronization
          </h5>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Our templates use dynamic placeholders. Once selected, you can use
            the <strong>Visual Editor</strong> to fine-tune the HTML and CSS.
            Changes are automatically reflected in all pending documents.
          </p>
        </div>
      </div>
    </div>
  )
}
