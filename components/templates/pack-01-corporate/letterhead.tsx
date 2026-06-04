import React from 'react';
import { BrandData } from '../../../lib/types';
import { LETTERHEAD_DIMENSIONS } from '../../../lib/constants';

interface LetterheadProps {
  brandData: BrandData;
}

/**
 * Apex Corporate Letterhead — Premium design
 * Features: angled polygon header, gold accent curve, grid-dot body pattern,
 * overlapping circle watermark, matching angled footer.
 */
export default function ApexCorporateLetterhead({ brandData }: LetterheadProps) {
  const W = LETTERHEAD_DIMENSIONS.width;
  const H = LETTERHEAD_DIMENSIONS.height;

  return (
    <div
      className="bg-white relative flex flex-col overflow-hidden"
      style={{ width: `${W}px`, height: `${H}px`, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* ── Header with angled bottom edge ── */}
      <div className="relative" style={{ height: 200 }}>
        {/* Primary background rectangle */}
        <div className="absolute inset-0" style={{ backgroundColor: brandData.primaryColor }} />

        {/* Angled bottom cut — SVG polygon */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox={`0 0 ${W} 50`}
          preserveAspectRatio="none"
          style={{ height: 50 }}
        >
          <polygon
            points={`0,0 ${W},30 ${W},50 0,50`}
            fill="white"
          />
        </svg>

        {/* Decorative circle — top right, partially clipped */}
        <svg className="absolute -top-16 -right-16 opacity-10" width="220" height="220">
          <circle cx="110" cy="110" r="100" fill="none" stroke="white" strokeWidth="3" />
          <circle cx="110" cy="110" r="70" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="110" cy="110" r="40" fill="white" strokeWidth="0" />
        </svg>

        {/* Small diamond accent shapes */}
        <svg className="absolute top-6 left-[40%] opacity-15" width="20" height="20">
          <polygon points="10,0 20,10 10,20 0,10" fill="white" />
        </svg>
        <svg className="absolute top-10 left-[44%] opacity-10" width="12" height="12">
          <polygon points="6,0 12,6 6,12 0,6" fill="white" />
        </svg>

        {/* Header content */}
        <div className="relative z-10 flex items-center justify-between h-full px-16 pb-6">
          <div className="flex items-center gap-5">
            {brandData.logoUrl ? (
              <img
                src={brandData.logoUrl}
                alt={`${brandData.companyName} logo`}
                className="h-14 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            ) : (
              <div
                className="h-14 w-14 flex items-center justify-center rounded-lg text-2xl font-bold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                {brandData.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-white font-bold text-[28px] tracking-tight leading-none m-0">
                {brandData.companyName}
              </h1>
              {brandData.tagline && (
                <p className="text-white/60 text-[11px] mt-1.5 uppercase tracking-[0.2em] font-medium">
                  {brandData.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Contact info in header — right aligned, small */}
          <div className="text-right text-white/80 text-[10px] space-y-1 font-medium">
            {brandData.email && <div>{brandData.email}</div>}
            {brandData.phone && <div>{brandData.phone}</div>}
            {brandData.website && <div>{brandData.website}</div>}
          </div>
        </div>
      </div>

      {/* ── Accent curve line ── */}
      <svg
        className="w-full -mt-1"
        viewBox={`0 0 ${W} 16`}
        preserveAspectRatio="none"
        style={{ height: 16 }}
      >
        <path
          d={`M0,8 Q${W * 0.25},0 ${W * 0.5},8 Q${W * 0.75},16 ${W},8`}
          fill="none"
          stroke={brandData.secondaryColor}
          strokeWidth="3"
        />
      </svg>

      {/* ── Body ── */}
      <div className="flex-1 px-16 pt-12 pb-8 relative">
        {/* Grid-dot pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
          <defs>
            <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill={brandData.primaryColor} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>

        {/* Large circle watermark — bottom right */}
        <svg
          className="absolute bottom-20 right-10 opacity-[0.04] pointer-events-none"
          width="260"
          height="260"
        >
          <circle cx="130" cy="130" r="120" fill="none" stroke={brandData.primaryColor} strokeWidth="2" />
          <circle cx="130" cy="130" r="90" fill="none" stroke={brandData.primaryColor} strokeWidth="1.5" />
          <circle cx="130" cy="130" r="60" fill="none" stroke={brandData.primaryColor} strokeWidth="1" />
        </svg>

        {/* Letter content */}
        <div className="relative z-10 text-gray-800 text-[14px] leading-[1.8] max-w-[88%]">
          <p className="mb-6 text-gray-500 text-[13px]">
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <p className="mb-8 leading-snug">
            <strong>Recipient Name</strong><br />
            Title / Department<br />
            Company Name<br />
            Address Line 1
          </p>

          <p className="mb-6 font-bold text-[15px]" style={{ color: brandData.primaryColor }}>
            RE: Official Correspondence
          </p>

          <p className="mb-5 text-gray-400 italic">Dear [Recipient Name],</p>

          <p className="mb-5 text-gray-400 italic">
            This is where the body of your letter goes. The template is designed to give you a clean,
            professional space to write. When you download the PDF, you can print this document directly
            or place it as a background in your word processor.
          </p>

          <p className="mb-5 text-gray-400 italic">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>

          <p className="text-gray-400 italic mt-14">Sincerely,</p>
          <div className="h-10" />
          <p className="font-bold text-gray-700">{brandData.yourName}</p>
          <p className="text-gray-500 text-[13px]">{brandData.jobTitle}</p>
        </div>
      </div>

      {/* ── Footer with matching angled top edge ── */}
      <div className="relative" style={{ height: 90 }}>
        {/* Angled top cut */}
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox={`0 0 ${W} 30`}
          preserveAspectRatio="none"
          style={{ height: 30 }}
        >
          <polygon points={`0,0 ${W},0 ${W},0 0,30`} fill="white" />
          <polygon points={`0,30 ${W},0 ${W},30 0,30`} fill={brandData.primaryColor} />
        </svg>

        <div
          className="absolute inset-0 flex items-end pb-5 px-16 text-[10px] font-medium"
          style={{ backgroundColor: brandData.primaryColor, color: 'rgba(255,255,255,0.85)' }}
        >
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-8">
              {brandData.email && <span>✉ {brandData.email}</span>}
              {brandData.phone && <span>☎ {brandData.phone}</span>}
              {brandData.website && <span>⌂ {brandData.website}</span>}
            </div>
            {brandData.address && (
              <span className="text-white/60 text-right max-w-[280px]">{brandData.address}</span>
            )}
          </div>
        </div>

        {/* Thin accent line at very bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ backgroundColor: brandData.secondaryColor }}
        />
      </div>
    </div>
  );
}
