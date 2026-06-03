'use client';

import React, { useState, use } from 'react';
import { Star } from 'lucide-react';
import { useTemplatePack, usePackReviews } from '../../../../hooks/useTemplates';
import { useCustomizer } from '../../../../hooks/useCustomizer';
import { usePurchase } from '../../../../hooks/usePurchase';
import CustomizerForm from '../../../../components/shop/CustomizerForm';
import LetterheadPreview from '../../../../components/previews/LetterheadPreview';
import SignaturePreview from '../../../../components/previews/SignaturePreview';
import PurchaseModal from '../../../../components/shop/PurchaseModal';

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const packId = resolvedParams.id;
  
  const { data: pack, isLoading } = useTemplatePack(packId);
  const { data: reviews = [] } = usePackReviews(packId);
  
  const { brandData, setBrandField, handleLogoUpload } = useCustomizer();
  const purchase = usePurchase(pack || null, brandData);

  const [previewMode, setPreviewMode] = useState<'letterhead' | 'signature'>('letterhead');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B57DB] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Pack not found</h2>
        <p className="text-gray-500 mt-2">The template pack you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Column - Customizer */}
        <div className="w-full lg:w-[450px] shrink-0 border-r border-gray-100 lg:pr-12">
          
          <div className="mb-8">
            <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              {pack.category}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{pack.name}</h1>
            <p className="text-gray-600 leading-relaxed">
              {pack.description}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
             </div>
             <div className="relative z-10 flex flex-col justify-between h-full">
               <div className="flex items-center gap-1 mb-4 text-yellow-600 font-semibold text-sm">
                 <Star className="w-4 h-4 fill-current" /> {pack.rating} ({pack.reviewCount} reviews)
               </div>
               <div className="mb-6">
                 <div className="text-3xl font-bold text-gray-900 mb-1">
                   KSh {pack.priceKES.toLocaleString()}
                 </div>
                 <div className="text-sm font-medium text-gray-500">
                   Equivalent to ~${pack.priceUSD} USD
                 </div>
               </div>
               
               <button 
                 onClick={purchase.openModal}
                 className="w-full bg-[#1B57DB] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition"
               >
                 Purchase & Download
               </button>
             </div>
          </div>

          <CustomizerForm 
            brandData={brandData}
            setBrandField={setBrandField}
            handleLogoUpload={handleLogoUpload}
          />
        </div>

        {/* Right Column - Live Preview */}
        <div className="w-full lg:flex-1 lg:sticky lg:top-24 mt-8 lg:mt-0">
          
          {/* Preview Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Live Preview</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setPreviewMode('letterhead')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  previewMode === 'letterhead' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Letterhead
              </button>
              <button 
                onClick={() => setPreviewMode('signature')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  previewMode === 'signature' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Signature
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            {previewMode === 'letterhead' ? (
              <LetterheadPreview packId={pack.id} brandData={brandData} />
            ) : (
              <SignaturePreview packId={pack.id} brandData={brandData} />
            )}
          </div>

          <div className="text-center text-sm text-gray-500 italic">
            Note: Letterhead downloads as PDF. Signature downloads as HTML — paste directly into Gmail or Outlook.
          </div>

          {/* Reviews section below preview on large screens */}
          {reviews.length > 0 && (
            <div className="mt-16 border-t border-gray-100 pt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-8">What customers are saying</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-4">"{review.body}"</p>
                    <div className="font-semibold text-gray-900 text-sm">{review.authorName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <PurchaseModal 
        pack={pack}
        isOpen={purchase.isOpen}
        step={purchase.step}
        isProcessing={purchase.isProcessing}
        onClose={purchase.closeModal}
        onGoToPayment={purchase.goToPayment}
        onProcessPayment={purchase.processPayment}
        onFinish={purchase.finishAndRedirect}
        brandDataName={brandData.yourName}
        brandDataEmail={brandData.email}
      />
    </div>
  );
}
