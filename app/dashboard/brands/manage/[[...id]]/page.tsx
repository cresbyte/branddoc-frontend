"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { 
  Building2, 
  Mail, 
  Globe, 
  Phone, 
  MapPin, 
  Palette, 
  Type, 
  ArrowLeft, 
  Check,
  Loader2,
  Trash2,
  Upload,
  X,
  ImageIcon
} from "lucide-react";
import { TextField } from "@/components/DesignSystem/TextField";
import { SelectField } from "@/components/DesignSystem/SelectField";
import { Button } from "@/components/DesignSystem/Button";

const FONT_CHOICES = [
  { value: "inter", label: "Inter (Modern)" },
  { value: "poppins", label: "Poppins (Rounded)" },
  { value: "merriweather", label: "Merriweather (Serif)" },
  { value: "playfair", label: "Playfair Display (Elegant)" },
  { value: "dm_sans", label: "DM Sans (Clean)" },
  { value: "raleway", label: "Raleway (Stylish)" },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function ManageBrandProfilePage() {
  const router = useRouter();
  const params = useParams();
  const brandId = (params.id as string[])?.[0]; 
  const isEditMode = !!brandId;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    company_name: "",
    tagline: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
    primary_color: "#1D4ED8",
    secondary_color: "#1E293B",
    accent_color: "#F59E0B",
    text_color: "#111827",
    background_color: "#FFFFFF",
    heading_font: "inter",
    body_font: "inter",
    base_font_size: 11,
    footer_text: "{{company_name}} • {{website}} • {{email}}",
  });

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setFetching(true);
        const data = await api.get(`/api/base/brand-profiles/${brandId}/`);
        const { id, user, logo, ...rest } = data;
        setFormData(rest);
        if (logo) setLogoPreview(logo);
      } catch (err: any) {
        alert(err.message || "Failed to load brand profile");
        router.push("/dashboard/brands");
      } finally {
        setFetching(false);
      }
    };
    if (isEditMode) fetchBrand();
  }, [brandId, isEditMode, router]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Logo size must not exceed 2MB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      // Reset error if any
      if (fieldErrors.logo) {
          const newErrors = { ...fieldErrors };
          delete newErrors.logo;
          setFieldErrors(newErrors);
      }
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    const requiredFields = [
        "company_name", "tagline", "email", "phone", "website", 
        "address", "city", "country", "footer_text"
    ];
    
    requiredFields.forEach(field => {
        if (!(formData as any)[field]) {
            errors[field] = ["This field is required"];
        }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ["Please enter a valid email address"];
    }
    
    if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
      errors.website = ["Please enter a valid URL"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!validateForm()) return;

    // Use FormData for multipart/form-data support
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
    });
    
    if (logoFile) {
        data.append("logo", logoFile);
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await api.put(`/api/base/brand-profiles/${brandId}/`, data);
      } else {
        await api.post("/api/base/brand-profiles/", data);
      }
      router.push("/dashboard/brands");
    } catch (err: any) {
      if (err.status === 400 && err.data) {
        setFieldErrors(err.data);
      } else {
        alert(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this brand profile? This action cannot be undone.")) return;
    
    try {
      setLoading(true);
      await api.delete(`/api/base/brand-profiles/${brandId}/`);
      router.push("/dashboard/brands");
    } catch (err: any) {
      alert(err.message || "Failed to delete brand profile");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[key];
      setFieldErrors(newErrors);
    }
  };

  if (fetching) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 animate-in fade-in duration-500 font-sans">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* Simplified Header with Grouped Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {isEditMode ? "Edit Identity" : "New Identity"}
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-0.5">Define your brand's core data and visual style</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-slate-200/50">
             {isEditMode && (
                <button
                    onClick={handleDelete}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Profile"
                >
                    <Trash2 size={18} />
                </button>
             )}
             <div className="w-px h-4 bg-slate-200 mx-1 hidden md:block" />
             <Button
                variant="secondary"
                onClick={() => router.back()}
                className="h-10 px-6 font-bold"
             >
                Cancel
             </Button>
             <Button
                onClick={handleSubmit}
                loading={loading}
                className="h-10 px-8 font-bold shadow-lg shadow-blue-500/20"
                icon={Check}
             >
                {isEditMode ? "Save Changes" : "Create Profile"}
             </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Logo Section */}
            <div className="bg-white border border-slate-200 rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <ImageIcon size={16} />
                        </div>
                        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Brand Logo</h2>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Max 2MB</span>
                </div>
                
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10 hover:border-indigo-400/50 hover:bg-indigo-50/30 transition-all group relative overflow-hidden">
                    {logoPreview ? (
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-xl bg-white shadow-md p-4 flex items-center justify-center border border-slate-100 mb-4 group-hover:scale-105 transition-transform">
                                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                            </div>
                            <button 
                                onClick={removeLogo}
                                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
                            >
                                <X size={14} /> Remove Logo
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all mb-4 border border-slate-100 shadow-sm">
                                <Upload size={28} />
                            </div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">Click to upload company logo</p>
                            <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
                        </div>
                    )}
                    <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                    />
                    {fieldErrors.logo && (
                        <p className="text-xs text-red-500 font-bold mt-4">{fieldErrors.logo[0]}</p>
                    )}
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <Building2 size={16} />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Brand DNA</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField 
                        label="Company Name"
                        placeholder="e.g. Acme Corp"
                        value={formData.company_name}
                        onChange={e => updateField("company_name", e.target.value)}
                        error={fieldErrors.company_name}
                        required
                    />
                     <TextField 
                        label="Tagline"
                        placeholder="Elevating business"
                        value={formData.tagline}
                        onChange={e => updateField("tagline", e.target.value)}
                        error={fieldErrors.tagline}
                        required
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <Mail size={16} />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField 
                        label="Business Email"
                        type="email"
                        icon={Mail}
                        placeholder="hello@company.com"
                        value={formData.email}
                        onChange={e => updateField("email", e.target.value)}
                        error={fieldErrors.email}
                        required
                    />
                    <TextField 
                        label="Phone Number"
                        type="tel"
                        icon={Phone}
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={e => updateField("phone", e.target.value)}
                        error={fieldErrors.phone}
                        required
                    />
                    <div className="col-span-full">
                        <TextField 
                            label="Website URL"
                            type="url"
                            icon={Globe}
                            placeholder="https://company.com"
                            value={formData.website}
                            onChange={e => updateField("website", e.target.value)}
                            error={fieldErrors.website}
                            required
                        />
                    </div>
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                             <TextField 
                                label="Office Address"
                                icon={MapPin}
                                placeholder="123 Street Ave"
                                value={formData.address}
                                onChange={e => updateField("address", e.target.value)}
                                error={fieldErrors.address}
                                required
                            />
                        </div>
                        <TextField 
                            label="City"
                            placeholder="San Francisco"
                            value={formData.city}
                            onChange={e => updateField("city", e.target.value)}
                            error={fieldErrors.city}
                            required
                        />
                    </div>
                    <div className="col-span-full">
                         <TextField 
                            label="Country"
                            placeholder="United States"
                            value={formData.country}
                            onChange={e => updateField("country", e.target.value)}
                            error={fieldErrors.country}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                        <Palette size={16} />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Visual Identity</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                         { key: 'primary_color', label: 'Primary' },
                         { key: 'secondary_color', label: 'Secondary' },
                         { key: 'accent_color', label: 'Accent' },
                         { key: 'text_color', label: 'Text' },
                         { key: 'background_color', label: 'BG' },
                    ].map(color => (
                        <div key={color.key} className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{color.label}</label>
                            <div className="flex items-center gap-2 p-2 px-3 border border-slate-100 rounded-lg bg-slate-50/50">
                                <input
                                    type="color"
                                    className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent"
                                    value={(formData as any)[color.key]}
                                    onChange={e => updateField(color.key, e.target.value)}
                                />
                                <span className="text-[10px] font-mono text-slate-500 uppercase">{(formData as any)[color.key]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <Type size={16} />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Typography</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectField 
                        label="Heading Font"
                        options={FONT_CHOICES}
                        value={formData.heading_font}
                        onChange={e => updateField("heading_font", e.target.value)}
                    />
                    <SelectField 
                        label="Body Font"
                        options={FONT_CHOICES}
                        value={formData.body_font}
                        onChange={e => updateField("body_font", e.target.value)}
                    />
                    <TextField 
                        label="Base Size (pt)"
                        type="number"
                        value={formData.base_font_size}
                        onChange={e => updateField("base_font_size", parseInt(e.target.value))}
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <TextField 
                    label="Footer Text Template"
                    placeholder="{{company_name}} • {{website}}"
                    value={formData.footer_text}
                    onChange={e => updateField("footer_text", e.target.value)}
                    error={fieldErrors.footer_text}
                    required
                />
            </div>

            <div className="pt-6 flex justify-end gap-3">
                 <Button
                    variant="secondary"
                    onClick={() => router.back()}
                 >
                    Discard Changes
                 </Button>
                 <Button
                    onClick={handleSubmit}
                    loading={loading}
                    variant="primary"
                    className="w-full md:w-auto min-w-[160px]"
                 >
                    {isEditMode ? "Update Brand Profile" : "Create Brand Profile"}
                 </Button>
            </div>
        </form>
      </div>
    </div>
  );
}
