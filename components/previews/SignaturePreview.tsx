'use client';

import React from 'react';
import { BrandData } from '../../lib/types';
import ApexCorporateSignature from '../templates/pack-01-corporate/signature';
import LexLegalSignature from '../templates/pack-02-legal/signature';

interface SignaturePreviewProps {
  packId: string;
  brandData: BrandData;
}

/**
 * Renders the chosen signature at 1:1 scale in a subtle container.
 */
export default function SignaturePreview({ packId, brandData }: SignaturePreviewProps) {
  // Determine which template to render
  let TemplateComponent = ApexCorporateSignature;
  if (packId === 'pack-02-legal') {
    TemplateComponent = LexLegalSignature;
  }
  
  return (
    <div className="w-full bg-gray-50 flex items-center justify-center p-8 rounded-xl border border-gray-200 min-h-[400px]">
      <div className="bg-white shadow-sm border border-gray-100 w-full max-w-2xl">
        <TemplateComponent brandData={brandData} />
      </div>
    </div>
  );
}
