import React from 'react';
import { BrandData } from '../../../lib/types';
import { LETTERHEAD_DIMENSIONS } from '../../../lib/constants';

interface LetterheadProps {
  brandData: BrandData;
}

/**
 * Lex Legal Letterhead Template
 * Formal and precise layout with a thick left accent border.
 */
export default function LexLegalLetterhead({ brandData }: LetterheadProps) {
  return (
    <div 
      className="bg-white relative flex flex-col overflow-hidden"
      style={{ 
        width: `${LETTERHEAD_DIMENSIONS.width}px`, 
        height: `${LETTERHEAD_DIMENSIONS.height}px` 
      }}
    >
      <div className="flex flex-col h-full relative">
        
        {/* Left thick accent border */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-6 z-20"
          style={{ backgroundColor: brandData.secondaryColor }}
        />

        {/* Header Section */}
        <div 
          className="flex flex-col items-center justify-center pt-16 pb-12 ml-6"
          style={{ backgroundColor: brandData.primaryColor }}
        >
          {brandData.logoUrl ? (
            <img 
              src={brandData.logoUrl} 
              alt={`${brandData.companyName} logo`} 
              className="h-20 w-auto object-contain bg-white/10 p-2 rounded mb-6"
            />
          ) : (
            <div className="h-20 w-20 border-2 border-white/30 flex items-center justify-center text-white font-serif font-bold text-3xl mb-6">
              {brandData.companyName.charAt(0)}
            </div>
          )}
          
          <h1 className="text-white font-serif font-bold text-4xl tracking-wide uppercase m-0">
            {brandData.companyName}
          </h1>
          {brandData.tagline && (
            <p className="text-white/70 text-sm mt-3 font-serif tracking-widest uppercase">
              {brandData.tagline}
            </p>
          )}
        </div>

        {/* Thin rule below header */}
        <div 
          className="h-1 w-full ml-6"
          style={{ backgroundColor: brandData.secondaryColor }}
        />

        {/* Body Section */}
        <div className="flex-1 px-20 py-20 ml-6 bg-white relative z-10">
          
          {/* Placeholder text area */}
          <div className="text-[#2C2C2C] text-[15px] leading-loose max-w-3xl font-serif">
            <p className="mb-8">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p className="mb-10 font-bold leading-tight">
              Recipient Name<br/>
              Title / Department<br/>
              Company Name<br/>
              Address Line 1
            </p>

            <p className="mb-8 font-bold underline underline-offset-4">RE: LEGAL MATTER REFERENCE</p>
            
            <p className="mb-6">Dear [Recipient Name],</p>
            
            <p className="mb-6 text-justify">
              This letterhead features a formal, single-column design tailored for law firms, official consultancies, 
              or any business requiring a precise, authoritative look. The thick left border acts as an anchor for 
              the document.
            </p>
            
            <p className="mb-6 text-justify">
              Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vestibulum ac diam sit amet quam 
              vehicula elementum sed sit amet dui. Proin eget tortor risus. Curabitur vel accumsan tellus. 
              Pellentesque in ipsum id orci porta dapibus.
            </p>

            <p className="mt-16 mb-16">Yours sincerely,</p>
            
            <p className="font-bold">{brandData.yourName}</p>
            <p className="text-sm text-gray-500">{brandData.jobTitle}</p>
          </div>
        </div>

        {/* Footer Section */}
        <div 
          className="h-[120px] ml-6 bg-[#F9FAFB] flex flex-col justify-center px-20 text-[12px] font-serif border-t border-gray-200"
          style={{ color: brandData.primaryColor }}
        >
          <div className="flex justify-between items-center mb-3 font-bold uppercase tracking-wider">
            <span>{brandData.companyName}</span>
          </div>
          <div className="flex gap-6  text-gray-600">
            {brandData.address && <span>{brandData.address}</span>}
            {brandData.email && <span>{brandData.email}</span>}
            {brandData.phone && <span>{brandData.phone}</span>}
            {brandData.website && <span>{brandData.website}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
