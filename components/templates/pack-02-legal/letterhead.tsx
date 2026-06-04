import React from 'react';
import { BrandData } from '../../../lib/types';
import { LETTERHEAD_DIMENSIONS } from '../../../lib/constants';

interface LetterheadProps {
  brandData: BrandData;
}

/**
 * Lex Legal Letterhead — Premium design
 * Features: curved wave left border, corner ornament lines, faint scales watermark,
 * sweeping arc footer divider. Formal serif-inspired typography.
 */
export default function LexLegalLetterhead({ brandData }: LetterheadProps) {
  const W = LETTERHEAD_DIMENSIONS.width;
  const H = LETTERHEAD_DIMENSIONS.height;

  return (
    <div
      className="bg-white relative flex flex-col overflow-hidden"
      style={{ width: `${W}px`, height: `${H}px`, fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* ── Left accent strip with wave inner edge ── */}
      <svg
        className="absolute left-0 top-0 bottom-0 z-20"
        width="55"
        height={H}
        viewBox={`0 0 55 ${H}`}
        preserveAspectRatio="none"
      >
        {/* Solid left bar */}
        <rect x="0" y="0" width="28" height={H} fill={brandData.secondaryColor} />
        {/* Wave inner edge */}
        <path
          d={`M28,0 Q55,${H * 0.15} 28,${H * 0.3} Q1,${H * 0.45} 28,${H * 0.6} Q55,${H * 0.75} 28,${H * 0.9} Q15,${H} 28,${H} L28,${H} L28,0 Z`}
          fill={brandData.secondaryColor}
          opacity="0.4"
        />
        {/* Thin line accent */}
        <line x1="32" y1="0" x2="32" y2={H} stroke={brandData.secondaryColor} strokeWidth="1" opacity="0.3" />
      </svg>

      {/* ── Header ── */}
      <div className="relative z-10 ml-[65px] mr-12 pt-14 pb-10">
        {/* Corner ornament — top right */}
        <svg className="absolute top-6 right-0 opacity-20" width="80" height="80">
          <line x1="0" y1="0" x2="80" y2="0" stroke={brandData.primaryColor} strokeWidth="2" />
          <line x1="80" y1="0" x2="80" y2="80" stroke={brandData.primaryColor} strokeWidth="2" />
          <line x1="12" y1="0" x2="12" y2="60" stroke={brandData.primaryColor} strokeWidth="1" />
          <line x1="0" y1="12" x2="60" y2="12" stroke={brandData.primaryColor} strokeWidth="1" />
          <rect x="72" y="72" width="8" height="8" fill={brandData.secondaryColor} opacity="0.5" />
        </svg>

        {/* Logo + company */}
        <div className="flex items-center gap-6 mb-4">
          {brandData.logoUrl ? (
            <img
              src={brandData.logoUrl}
              alt={`${brandData.companyName} logo`}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <div
              className="h-16 w-16 flex items-center justify-center text-3xl font-bold"
              style={{
                border: `2px solid ${brandData.primaryColor}`,
                color: brandData.primaryColor,
              }}
            >
              {brandData.companyName.charAt(0)}
            </div>
          )}
          <div>
            <h1
              className="font-bold text-[30px] tracking-[0.08em] uppercase leading-none m-0"
              style={{ color: brandData.primaryColor }}
            >
              {brandData.companyName}
            </h1>
            {brandData.tagline && (
              <p className="text-gray-500 text-[11px] mt-2 uppercase tracking-[0.15em] font-normal">
                {brandData.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Horizontal rule with center diamond */}
        <svg className="w-full mt-6" viewBox={`0 0 ${W - 120} 12`} style={{ height: 12 }}>
          <line x1="0" y1="6" x2={(W - 120) / 2 - 12} y2="6" stroke={brandData.secondaryColor} strokeWidth="1.5" />
          <polygon
            points={`${(W - 120) / 2},0 ${(W - 120) / 2 + 6},6 ${(W - 120) / 2},12 ${(W - 120) / 2 - 6},6`}
            fill={brandData.secondaryColor}
          />
          <line x1={(W - 120) / 2 + 12} y1="6" x2={W - 120} y2="6" stroke={brandData.secondaryColor} strokeWidth="1.5" />
        </svg>

        {/* Contact info row */}
        <div
          className="flex justify-center gap-6 mt-4 text-[10px] tracking-wider uppercase"
          style={{ color: brandData.primaryColor }}
        >
          {brandData.email && <span>{brandData.email}</span>}
          {(brandData.email && brandData.phone) && <span style={{ color: brandData.secondaryColor }}>◆</span>}
          {brandData.phone && <span>{brandData.phone}</span>}
          {(brandData.phone && brandData.website) && <span style={{ color: brandData.secondaryColor }}>◆</span>}
          {brandData.website && <span>{brandData.website}</span>}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 ml-[65px] mr-16 px-4 relative">
        {/* Faint scales-of-justice watermark */}
        <svg
          className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.025] pointer-events-none"
          width="240"
          height="280"
          viewBox="0 0 240 280"
        >
          {/* Pillar */}
          <rect x="115" y="40" width="10" height="200" rx="3" fill={brandData.primaryColor} />
          {/* Base */}
          <rect x="70" y="230" width="100" height="12" rx="4" fill={brandData.primaryColor} />
          <rect x="90" y="242" width="60" height="8" rx="3" fill={brandData.primaryColor} />
          {/* Beam */}
          <rect x="20" y="36" width="200" height="8" rx="4" fill={brandData.primaryColor} />
          {/* Left pan */}
          <line x1="50" y1="44" x2="50" y2="100" stroke={brandData.primaryColor} strokeWidth="3" />
          <path d="M15,100 Q50,140 85,100" fill="none" stroke={brandData.primaryColor} strokeWidth="3" />
          {/* Right pan */}
          <line x1="190" y1="44" x2="190" y2="100" stroke={brandData.primaryColor} strokeWidth="3" />
          <path d="M155,100 Q190,140 225,100" fill="none" stroke={brandData.primaryColor} strokeWidth="3" />
          {/* Top ornament */}
          <circle cx="120" cy="30" r="12" fill="none" stroke={brandData.primaryColor} strokeWidth="3" />
        </svg>

        {/* Letter content */}
        <div className="relative z-10 text-[#2C2C2C] text-[14px] leading-[2] max-w-[90%]">
          <p className="mb-8 text-gray-500 text-[13px]">
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <p className="mb-10 leading-snug font-bold">
            Recipient Name<br />
            Title / Department<br />
            Company Name<br />
            Address Line 1
          </p>

          <p className="mb-6 font-bold underline underline-offset-4 tracking-wide" style={{ color: brandData.primaryColor }}>
            RE: LEGAL MATTER REFERENCE
          </p>

          <p className="mb-5">Dear [Recipient Name],</p>

          <p className="mb-5 text-justify text-gray-500 italic">
            This letterhead features a formal design with a decorative wave border, corner ornaments,
            and a balanced scales watermark — tailored for law firms, official consultancies, or any
            business requiring a precise, authoritative look.
          </p>

          <p className="mb-5 text-justify text-gray-500 italic">
            Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vestibulum ac diam sit amet
            quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Curabitur non nulla
            sit amet nisl tempus convallis quis ac lectus.
          </p>

          <p className="mt-14">Yours sincerely,</p>
          <div className="h-10" />
          <p className="font-bold">{brandData.yourName}</p>
          <p className="text-sm text-gray-500">{brandData.jobTitle}</p>
        </div>
      </div>

      {/* ── Footer with sweeping arc separator ── */}
      <div className="relative z-10 ml-[55px]" style={{ height: 100 }}>
        {/* Arc separator */}
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox={`0 0 ${W - 55} 20`}
          preserveAspectRatio="none"
          style={{ height: 20 }}
        >
          <path
            d={`M0,20 Q${(W - 55) / 2},0 ${W - 55},20`}
            fill="none"
            stroke={brandData.secondaryColor}
            strokeWidth="2"
          />
        </svg>

        <div
          className="flex items-end justify-between h-full px-12 pb-5 text-[10px] tracking-wider"
          style={{ color: brandData.primaryColor }}
        >
          <div className="font-bold uppercase tracking-[0.15em]">{brandData.companyName}</div>
          <div className="text-gray-500 text-right max-w-[320px]">
            {brandData.address}
          </div>
        </div>
      </div>
    </div>
  );
}
