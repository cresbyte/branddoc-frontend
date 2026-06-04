import React from 'react';
import { BrandData } from '../../../lib/types';
import { LETTERHEAD_DIMENSIONS } from '../../../lib/constants';

interface LetterheadProps {
  brandData: BrandData;
}

/**
 * Vivid Creative Letterhead — Premium design
 * Features: bold diagonal band across top-left, scattered geometric shapes,
 * thick right sidebar with zigzag inner edge, overlapping angled footer rectangles.
 */
export default function VividCreativeLetterhead({ brandData }: LetterheadProps) {
  const W = LETTERHEAD_DIMENSIONS.width;
  const H = LETTERHEAD_DIMENSIONS.height;

  return (
    <div
      className="bg-white relative flex flex-col overflow-hidden"
      style={{ width: `${W}px`, height: `${H}px`, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* ── Diagonal color band — top left corner ── */}
      <svg
        className="absolute top-0 left-0 z-10"
        width="380"
        height="320"
        viewBox="0 0 380 320"
      >
        <polygon points="0,0 340,0 0,280" fill={brandData.primaryColor} />
        <polygon points="0,0 300,0 0,240" fill={brandData.primaryColor} opacity="0.7" />
        {/* Thin accent line parallel to diagonal */}
        <line x1="350" y1="0" x2="10" y2="290" stroke={brandData.secondaryColor} strokeWidth="2" opacity="0.5" />
      </svg>

      {/* ── Scattered geometric shapes (background decoration) ── */}
      {/* Triangle — top right area */}
      <svg className="absolute top-16 right-48 opacity-[0.06] pointer-events-none" width="80" height="80">
        <polygon points="40,0 80,80 0,80" fill={brandData.primaryColor} />
      </svg>
      {/* Circle — mid-right */}
      <svg className="absolute top-[35%] right-24 opacity-[0.05] pointer-events-none" width="100" height="100">
        <circle cx="50" cy="50" r="45" fill="none" stroke={brandData.primaryColor} strokeWidth="3" />
        <circle cx="50" cy="50" r="25" fill={brandData.primaryColor} opacity="0.3" />
      </svg>
      {/* Small square — floating */}
      <svg className="absolute top-[50%] left-[15%] opacity-[0.04] pointer-events-none" width="30" height="30">
        <rect x="0" y="0" width="30" height="30" fill={brandData.primaryColor} transform="rotate(15 15 15)" />
      </svg>
      {/* Dots cluster */}
      <svg className="absolute top-[25%] right-[35%] opacity-[0.05] pointer-events-none" width="60" height="60">
        <circle cx="10" cy="10" r="4" fill={brandData.primaryColor} />
        <circle cx="30" cy="8" r="3" fill={brandData.primaryColor} />
        <circle cx="50" cy="14" r="5" fill={brandData.primaryColor} />
        <circle cx="15" cy="35" r="3" fill={brandData.primaryColor} />
        <circle cx="40" cy="38" r="4" fill={brandData.primaryColor} />
        <circle cx="25" cy="52" r="3" fill={brandData.primaryColor} />
      </svg>

      {/* ── Right sidebar with zigzag inner edge ── */}
      <svg
        className="absolute right-0 top-0 z-10"
        width="50"
        height={H}
        viewBox={`0 0 50 ${H}`}
        preserveAspectRatio="none"
      >
        <rect x="20" y="0" width="30" height={H} fill={brandData.secondaryColor} />
        {/* Zigzag inner edge */}
        <path
          d={Array.from({ length: Math.ceil(H / 40) }, (_, i) => {
            const y = i * 40;
            return i === 0
              ? `M20,${y}`
              : i % 2 === 0
              ? `L20,${y}`
              : `L8,${y}`;
          }).join(' ') + ` L20,${H} L50,${H} L50,0 L20,0 Z`}
          fill={brandData.secondaryColor}
          opacity="0.35"
        />
      </svg>

      {/* ── Header content (sits on top of diagonal) ── */}
      <div className="relative z-20 px-14 pt-12 pb-6">
        <div className="flex items-center gap-5">
          {brandData.logoUrl ? (
            <img
              src={brandData.logoUrl}
              alt={`${brandData.companyName} logo`}
              className="h-12 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          ) : (
            <div
              className="h-12 w-12 flex items-center justify-center rounded-lg text-xl font-black"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
              }}
            >
              {brandData.companyName.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-white font-black text-[24px] tracking-tight leading-none m-0">
              {brandData.companyName}
            </h1>
            {brandData.tagline && (
              <p className="text-white/70 text-[10px] mt-1.5 uppercase tracking-[0.2em] font-bold">
                {brandData.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact row below diagonal */}
      <div className="relative z-20 px-14 mt-8 mb-6">
        <div
          className="flex gap-6 text-[10px] uppercase tracking-wider font-semibold py-3 px-5 rounded-lg"
          style={{
            backgroundColor: `${brandData.primaryColor}10`,
            color: brandData.primaryColor,
            border: `1px solid ${brandData.primaryColor}20`,
          }}
        >
          {brandData.email && <span>{brandData.email}</span>}
          {brandData.phone && <span>{brandData.phone}</span>}
          {brandData.website && <span>{brandData.website}</span>}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 px-14 pr-20 relative">
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

          <p className="mb-6 font-black text-[15px]" style={{ color: brandData.primaryColor }}>
            RE: Creative Proposal
          </p>

          <p className="mb-5 text-gray-400 italic">Dear [Recipient Name],</p>

          <p className="mb-5 text-gray-400 italic">
            This bold template is designed for creative agencies, design studios, and freelancers
            who want their correspondence to reflect their creative energy. The asymmetric layout
            and scattered shapes create visual interest while maintaining readability.
          </p>

          <p className="mb-5 text-gray-400 italic">
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
            nisi ut aliquid ex ea commodi consequatur. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit.
          </p>

          <p className="text-gray-400 italic mt-14">Cheers,</p>
          <div className="h-10" />
          <p className="font-bold text-gray-700">{brandData.yourName}</p>
          <p className="text-gray-500 text-[13px]">{brandData.jobTitle}</p>
        </div>
      </div>

      {/* ── Footer with overlapping angled rectangles ── */}
      <div className="relative" style={{ height: 80 }}>
        {/* Overlapping angled shapes */}
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox={`0 0 ${W} 80`}
          preserveAspectRatio="none"
        >
          <polygon
            points={`0,30 ${W},50 ${W},80 0,80`}
            fill={brandData.secondaryColor}
            opacity="0.25"
          />
          <polygon
            points={`0,45 ${W},25 ${W},80 0,80`}
            fill={brandData.primaryColor}
          />
        </svg>

        <div className="absolute inset-0 flex items-end pb-4 px-14 z-10">
          <div className="flex justify-between w-full items-center text-[10px] font-semibold text-white/90">
            <span>{brandData.companyName}</span>
            {brandData.address && (
              <span className="text-white/60 text-right max-w-[280px]">{brandData.address}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
