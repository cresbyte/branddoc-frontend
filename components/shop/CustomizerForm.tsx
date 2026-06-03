'use client';

import React, { useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { BrandData } from '../../lib/types';
import { Upload, X } from 'lucide-react';

interface CustomizerFormProps {
  brandData: BrandData;
  setBrandField: <K extends keyof BrandData>(field: K, value: BrandData[K]) => void;
  handleLogoUpload: (file: File) => void;
}

export default function CustomizerForm({ brandData, setBrandField, handleLogoUpload }: CustomizerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Brand Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Brand Identity</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Company Logo</label>
            <div className="flex items-center gap-4">
              {brandData.logoUrl ? (
                <div className="relative w-16 h-16 rounded border border-gray-200 p-1 flex items-center justify-center bg-gray-50 group">
                  <img src={brandData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  <button 
                    onClick={() => setBrandField('logoUrl', '')}
                    className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded border border-dashed border-gray-300 hover:border-[#1B57DB] hover:bg-blue-50 flex flex-col items-center justify-center text-gray-400 hover:text-[#1B57DB] transition-colors"
                >
                  <Upload className="w-5 h-5 mb-1" />
                </button>
              )}
              <div className="text-sm text-gray-500">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium text-[#1B57DB] hover:underline"
                >
                  Upload a file
                </button>
                <div className="text-xs mt-0.5">PNG, JPG up to 2MB. Transparent bg recommended.</div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorField 
              label="Primary Color" 
              value={brandData.primaryColor} 
              onChange={(color) => setBrandField('primaryColor', color)} 
            />
            <ColorField 
              label="Secondary Color" 
              value={brandData.secondaryColor} 
              onChange={(color) => setBrandField('secondaryColor', color)} 
            />
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Company Info</h3>
        <div className="grid gap-4">
          <InputField 
            label="Company Name" 
            value={brandData.companyName} 
            onChange={(v) => setBrandField('companyName', v)} 
          />
          <InputField 
            label="Tagline / Slogan" 
            value={brandData.tagline} 
            onChange={(v) => setBrandField('tagline', v)} 
          />
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Personal & Contact Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField 
            label="Your Name" 
            value={brandData.yourName} 
            onChange={(v) => setBrandField('yourName', v)} 
          />
          <InputField 
            label="Job Title" 
            value={brandData.jobTitle} 
            onChange={(v) => setBrandField('jobTitle', v)} 
          />
          <InputField 
            label="Email Address" 
            type="email"
            value={brandData.email} 
            onChange={(v) => setBrandField('email', v)} 
          />
          <InputField 
            label="Phone Number" 
            value={brandData.phone} 
            onChange={(v) => setBrandField('phone', v)} 
          />
          <div className="sm:col-span-2">
            <InputField 
              label="Website" 
              value={brandData.website} 
              onChange={(v) => setBrandField('website', v)} 
              placeholder="www.example.com"
            />
          </div>
          <div className="sm:col-span-2">
            <InputField 
              label="Physical Address" 
              value={brandData.address} 
              onChange={(v) => setBrandField('address', v)} 
            />
          </div>
        </div>
      </section>
      
    </div>
  );
}

// Subcomponents

function InputField({ 
  label, value, onChange, type = 'text', placeholder = '' 
}: { 
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B57DB]/20 focus:border-[#1B57DB] transition-all bg-white"
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-md shadow-inner border border-black/10" 
            style={{ backgroundColor: value }}
          />
          <span className="text-sm text-gray-700 font-mono uppercase">{value}</span>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute z-50 top-full left-0 mt-2 bg-white p-3 rounded-xl shadow-xl border border-gray-100">
            <HexColorPicker color={value} onChange={onChange} />
            <div className="mt-3 flex gap-2">
              <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-2 py-1.5 text-sm font-mono border border-gray-200 rounded text-center focus:outline-none focus:border-[#1B57DB]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
