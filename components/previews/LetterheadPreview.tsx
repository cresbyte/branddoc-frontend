'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrandData } from '../../lib/types';
import { LETTERHEAD_DIMENSIONS } from '../../lib/constants';
import ApexCorporateLetterhead from '../templates/pack-01-corporate/letterhead';
import LexLegalLetterhead from '../templates/pack-02-legal/letterhead';

interface LetterheadPreviewProps {
  packId: string;
  brandData: BrandData;
}

/**
 * Renders the chosen letterhead and scales it down to fit the container width.
 */
export default function LetterheadPreview({ packId, brandData }: LetterheadPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Add a slight margin (e.g. 40px total padding)
        const availableWidth = containerWidth - 40;
        const newScale = availableWidth / LETTERHEAD_DIMENSIONS.width;
        setScale(newScale > 1 ? 1 : newScale);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Determine which template to render
  let TemplateComponent = ApexCorporateLetterhead;
  if (packId === 'pack-02-legal') {
    TemplateComponent = LexLegalLetterhead;
  }
  // For packs without specific components yet, fallback to corporate
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center bg-gray-100 p-5 rounded-xl border border-gray-200 overflow-hidden"
    >
      <div 
        className="bg-white shadow-md relative transition-transform duration-200"
        style={{ 
          width: `${LETTERHEAD_DIMENSIONS.width}px`, 
          height: `${LETTERHEAD_DIMENSIONS.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: `-${LETTERHEAD_DIMENSIONS.height * (1 - scale)}px` // prevent huge empty space below scaled element
        }}
      >
        {/* We mount the real template here */}
        <TemplateComponent brandData={brandData} />
      </div>
    </div>
  );
}
