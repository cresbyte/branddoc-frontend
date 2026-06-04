import React from 'react';
import { BrandData } from '../../../lib/types';
import { LETTERHEAD_DIMENSIONS } from '../../../lib/constants';

interface LetterheadProps {
  brandData: BrandData;
}

/**
 * Horizon Real Estate Letterhead — Premium design
 * Features: wave/hill header bottom edge, large decorative circle,
 * subtle horizon line in body, geometric cityscape footer decoration.
 */
export default function HorizonRealEstateLetterhead({ brandData }: LetterheadProps) {
  const W = LETTERHEAD_DIMENSIONS.width;
  const H = LETTERHEAD_DIMENSIONS.height;

  return (
    <div
      className="bg-white relative flex flex-col overflow-hidden"
      style={{ width: `${W}px`, height: `${H}px`, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* ── Header with wave bottom ── */}
      <div className="relative" style={{ height: 210 }}>
        <div className="absolute inset-0" style={{ backgroundColor: brandData.primaryColor }} />

        {/* Large decorative circle — top right, overlapping */}
        <svg className="absolute -top-20 -right-20 z-10" width="260" height="260">
          <circle cx="130" cy="130" r="120" fill="none" stroke={brandData.secondaryColor} strokeWidth="2" opacity="0.3" />
          <circle cx="130" cy="130" r="95" fill="none" stroke={brandData.secondaryColor} strokeWidth="1.5" opacity="0.2" />
          <circle cx="130" cy="130" r="70" fill={brandData.secondaryColor} opacity="0.08" />
        </svg>

        {/* Smaller decorative circle — mid left */}
        <svg className="absolute top-8 left-[30%] opacity-10" width="60" height="60">
          <circle cx="30" cy="30" r="28" fill="none" stroke="white" strokeWidth="1.5" />
          <circle cx="30" cy="30" r="15" fill="none" stroke="white" strokeWidth="1" />
        </svg>

        {/* Wave bottom edge */}
        <svg
          className="absolute bottom-0 left-0 w-full z-20"
          viewBox={`0 0 ${W} 60`}
          preserveAspectRatio="none"
          style={{ height: 60 }}
        >
          <path
            d={`M0,30 C${W * 0.15},0 ${W * 0.35},5 ${W * 0.5},25 C${W * 0.65},45 ${W * 0.85},60 ${W},30 L${W},60 L0,60 Z`}
            fill="white"
          />
        </svg>

        {/* Header content */}
        <div className="relative z-30 flex items-center justify-between h-full px-16 pb-8">
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
                className="h-14 w-14 flex items-center justify-center rounded-full text-2xl font-bold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: `2px solid ${brandData.secondaryColor}`,
                }}
              >
                {brandData.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-white font-bold text-[26px] tracking-tight leading-none m-0">
                {brandData.companyName}
              </h1>
              {brandData.tagline && (
                <p
                  className="text-[11px] mt-2 uppercase tracking-[0.15em] font-medium"
                  style={{ color: brandData.secondaryColor }}
                >
                  {brandData.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="text-right text-white/70 text-[10px] space-y-0.5 font-medium">
            {brandData.phone && <div>{brandData.phone}</div>}
            {brandData.email && <div>{brandData.email}</div>}
            {brandData.website && <div>{brandData.website}</div>}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 px-16 pt-8 pb-6 relative">
        {/* Subtle horizon line across the middle of the body */}
        <svg
          className="absolute left-16 right-16 top-1/2 opacity-[0.06] pointer-events-none"
          height="2"
          style={{ width: 'calc(100% - 8rem)' }}
        >
          <line x1="0" y1="1" x2="100%" y2="1" stroke={brandData.primaryColor} strokeWidth="2" strokeDasharray="8,6" />
        </svg>

        {/* Faint house/building watermark */}
        <svg
          className="absolute right-12 bottom-24 opacity-[0.03] pointer-events-none"
          width="200"
          height="180"
          viewBox="0 0 200 180"
        >
          {/* Building 1 */}
          <rect x="20" y="60" width="40" height="120" fill={brandData.primaryColor} />
          <rect x="28" y="70" width="10" height="12" rx="1" fill="white" />
          <rect x="42" y="70" width="10" height="12" rx="1" fill="white" />
          <rect x="28" y="90" width="10" height="12" rx="1" fill="white" />
          <rect x="42" y="90" width="10" height="12" rx="1" fill="white" />
          {/* Building 2 (taller) */}
          <rect x="70" y="30" width="50" height="150" fill={brandData.primaryColor} />
          <rect x="80" y="40" width="12" height="14" rx="1" fill="white" />
          <rect x="98" y="40" width="12" height="14" rx="1" fill="white" />
          <rect x="80" y="62" width="12" height="14" rx="1" fill="white" />
          <rect x="98" y="62" width="12" height="14" rx="1" fill="white" />
          <rect x="80" y="84" width="12" height="14" rx="1" fill="white" />
          {/* Building 3 */}
          <rect x="130" y="80" width="45" height="100" fill={brandData.primaryColor} />
          <rect x="138" y="90" width="10" height="12" rx="1" fill="white" />
          <rect x="155" y="90" width="10" height="12" rx="1" fill="white" />
          {/* Ground */}
          <rect x="0" y="178" width="200" height="2" fill={brandData.primaryColor} />
        </svg>

        {/* Letter content */}
        <div className="relative z-10 text-gray-800 text-[14px] leading-[1.85] max-w-[88%]">
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
            RE: Property Inquiry
          </p>

          <p className="mb-5 text-gray-400 italic">Dear [Recipient Name],</p>

          <p className="mb-5 text-gray-400 italic">
            Your letter content goes here. This template is designed for real estate agencies,
            property management firms, and related businesses that need a clean, trustworthy
            appearance in their official correspondence.
          </p>

          <p className="mb-5 text-gray-400 italic">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo.
          </p>

          <p className="text-gray-400 italic mt-14">Kind regards,</p>
          <div className="h-10" />
          <p className="font-bold text-gray-700">{brandData.yourName}</p>
          <p className="text-gray-500 text-[13px]">{brandData.jobTitle}</p>
        </div>
      </div>

      {/* ── Footer with geometric cityscape ── */}
      <div className="relative" style={{ height: 85 }}>
        {/* City skyline shapes */}
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox={`0 0 ${W} 25`}
          preserveAspectRatio="none"
          style={{ height: 25 }}
        >
          <rect x="60" y="10" width="30" height="15" fill={brandData.primaryColor} opacity="0.08" />
          <rect x="95" y="5" width="20" height="20" fill={brandData.primaryColor} opacity="0.06" />
          <rect x="120" y="12" width="40" height="13" fill={brandData.primaryColor} opacity="0.04" />
          <rect x={W - 200} y="8" width="25" height="17" fill={brandData.primaryColor} opacity="0.06" />
          <rect x={W - 170} y="3" width="18" height="22" fill={brandData.primaryColor} opacity="0.08" />
          <rect x={W - 145} y="10" width="35" height="15" fill={brandData.primaryColor} opacity="0.05" />
        </svg>

        <div
          className="absolute inset-0 flex items-end pb-4 px-16"
          style={{ backgroundColor: brandData.primaryColor }}
        >
          <div className="flex justify-between w-full items-center text-[10px] font-medium text-white/80">
            <div className="flex gap-6">
              {brandData.email && <span>✉ {brandData.email}</span>}
              {brandData.phone && <span>☎ {brandData.phone}</span>}
              {brandData.website && <span>⌂ {brandData.website}</span>}
            </div>
            {brandData.address && (
              <span className="text-white/50 text-right max-w-[260px]">{brandData.address}</span>
            )}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[4px]"
          style={{ backgroundColor: brandData.secondaryColor }}
        />
      </div>
    </div>
  );
}
