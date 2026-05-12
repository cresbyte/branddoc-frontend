"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Check } from "lucide-react";

const FONTS = ["Poppins", "Inter", "Lato", "Playfair Display", "Merriweather", "Raleway", "Nunito", "EB Garamond"];
const INDUSTRIES = ["Freelancer / Creative", "Retail / Product Store", "Food & Beverage", "Professional Services", "Health & Wellness", "Technology"];

const FONT_STYLES: Record<string, string> = {
  Poppins: "Poppins, sans-serif",
  Inter: "Inter, sans-serif",
  Lato: "Lato, sans-serif",
  "Playfair Display": "'Playfair Display', serif",
};

export default function BrandPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [brand, setBrand] = useState({
    companyName: "Acme Studio",
    tagline: "Quality you can trust",
    email: "hello@acme.com",
    phone: "+1 234 567 8900",
    website: "https://acme.com",
    address: "123 Creative Lane, New York, USA",
    primaryColor: "#1a1a1a",
    secondaryColor: "#4f46e5",
    font: "Poppins",
    industry: "Freelancer / Creative",
    initials: "AS",
  });

  const updateBrand = (key: string, value: string) => setBrand((prev) => ({ ...prev, [key]: value }));
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 800 }}>
       {/* Google Fonts */}
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&family=Lato:wght@400;700&family=Playfair+Display:wght@400;500;600&display=swap');
      `}</style>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", margin: 0 }}>My Brand</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Configure your document identity and styles.</p>
        </div>
        <button 
          onClick={handleSave}
          style={{
            padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500,
            background: saved ? "#059669" : "#111827",
            color: "white", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
          }}
        >
          {saved ? <Check size={16} /> : null}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 24 }}>
        <section style={{ background: "white", padding: 28, borderRadius: 16, border: "0.5px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Company Profile</h2>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>Core information used across all templates.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input value={brand.companyName} onChange={e => updateBrand("companyName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input value={brand.tagline} onChange={e => updateBrand("tagline", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={brand.email} onChange={e => updateBrand("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input value={brand.website} onChange={e => updateBrand("website", e.target.value)} />
            </div>
            <div className="space-y-1.5" style={{ gridColumn: "span 2" }}>
              <Label>Address</Label>
              <Textarea value={brand.address} onChange={e => updateBrand("address", e.target.value)} className="min-h-[80px] resize-none" />
            </div>
          </div>
        </section>

        <section style={{ background: "white", padding: 28, borderRadius: 16, border: "0.5px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Visual Identity</h2>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>Fonts and colors that define your brand.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                   <div style={{ width: 40, height: 40, borderRadius: 8, background: brand.primaryColor, border: "1px solid #E5E7EB" }} />
                   <Input value={brand.primaryColor} onChange={e => updateBrand("primaryColor", e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                   <div style={{ width: 40, height: 40, borderRadius: 8, background: brand.secondaryColor, border: "1px solid #E5E7EB" }} />
                   <Input value={brand.secondaryColor} onChange={e => updateBrand("secondaryColor", e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <Label>Brand Font</Label>
                  <Select value={brand.font} onValueChange={v => updateBrand("font", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
               <div style={{ 
                 background: "#F9FAFB", padding: 16, borderRadius: 12, border: "0.5px solid #E5E7EB",
                 fontFamily: FONT_STYLES[brand.font] || "sans-serif", textAlign: "center"
               }}>
                 <span style={{ fontSize: 18, color:brand.primaryColor, fontWeight: 600 }}>{brand.companyName}</span>
               </div>
            </div>
          </div>
        </section>

        <section style={{ background: "white", padding: 28, borderRadius: 16, border: "0.5px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Logo & Imagery</h2>
          <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 12 }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: 16, background: brand.primaryColor,
              display: "flex", alignItems: "center", justifyContent: "center", color: "white",
              fontSize: 32, fontWeight: 700
            }}>
              {brand.initials}
            </div>
            <div className="space-y-1.5">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload size={14} className="mr-2" /> Upload New Logo
              </Button>
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>Recommended: Square PNG with transparent background.</p>
              <input type="file" ref={fileInputRef} hidden />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
