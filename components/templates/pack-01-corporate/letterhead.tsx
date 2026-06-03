import React from 'react';
import { BrandData } from '../../../lib/types';
import { LETTERHEAD_DIMENSIONS } from '../../../lib/constants';

interface LetterheadProps {
  brandData: BrandData;
}

/**
 * Apex Corporate Letterhead Template
 * Features a strong header block and clean footer.
 */
export default function ApexCorporateLetterhead({ brandData }: LetterheadProps) {
  return (
    <div 
      className="bg-white relative flex flex-col overflow-hidden"
      style={{ 
        width: `${LETTERHEAD_DIMENSIONS.width}px`, 
        height: `${LETTERHEAD_DIMENSIONS.height}px` 
      }}
    >
      {/* Header Section */}
      <div 
        className="flex justify-between items-center px-12 py-10 h-[160px]"
        style={{ backgroundColor: brandData.primaryColor }}
      >
        <div className="flex items-center gap-4">
          {brandData.logoUrl ? (
            <img 
              src={brandData.logoUrl} 
              alt={`${brandData.companyName} logo`} 
              className="h-16 w-auto object-contain bg-white p-2 rounded"
            />
          ) : (
            <div className="h-16 w-16 bg-white/20 flex items-center justify-center rounded text-white font-bold text-2xl">
              {brandData.companyName.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="text-right flex flex-col justify-center">
          <h1 className="text-white font-bold text-3xl tracking-tight m-0 leading-tight">
            {brandData.companyName}
          </h1>
          {brandData.tagline && (
            <p className="text-white/80 text-sm mt-1 uppercase tracking-widest">
              {brandData.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Accent Line */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: brandData.secondaryColor }}
      />

      {/* Body Section */}
      <div className="flex-1 px-16 py-16 relative">
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ 
            backgroundImage: `repeating-linear-gradient(45deg, ${brandData.secondaryColor} 0, ${brandData.secondaryColor} 2px, transparent 2px, transparent 12px)`
          }}
        />
        
        {/* Placeholder text area */}
        <div className="relative z-10 text-gray-800 text-[15px] leading-relaxed max-w-[85%] font-serif">
          <p className="mb-6">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <p className="mb-8">
            <strong>Recipient Name</strong><br/>
            Title / Department<br/>
            Company Name<br/>
            Address Line 1
          </p>

          <p className="mb-6 font-bold">RE: Official Letter Intent</p>
          
          <p className="mb-4 text-gray-400 italic">Dear [Recipient Name],</p>
          
          <p className="mb-4 text-gray-400 italic">
            This is where the body of your letter goes. The template is designed to give you a clean,
            professional space to write. When you download the PDF, you can print this document directly,
            or place it as a background in your word processor.
          </p>
          
          <p className="mb-4 text-gray-400 italic">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore 
            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
            ut aliquip ex ea commodo consequat.
          </p>

          <p className="text-gray-400 italic mt-12">Sincerely,</p>
          <div className="h-12"></div>
          <p className="text-gray-400 italic font-bold">{brandData.yourName}</p>
          <p className="text-gray-400 italic text-sm">{brandData.jobTitle}</p>
        </div>
      </div>

      {/* Footer Section */}
      <div 
        className="h-[100px] flex items-center justify-between px-16 text-[11px] font-medium"
        style={{ 
          backgroundColor: brandData.primaryColor,
          color: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <div className="flex gap-8">
          {brandData.email && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">@</span>
              {brandData.email}
            </div>
          )}
          {brandData.phone && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">P</span>
              {brandData.phone}
            </div>
          )}
          {brandData.website && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">W</span>
              {brandData.website}
            </div>
          )}
        </div>
        
        {brandData.address && (
          <div className="text-right text-white/70">
            {brandData.address}
          </div>
        )}
      </div>
    </div>
  );
}
