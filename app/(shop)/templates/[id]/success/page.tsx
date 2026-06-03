'use client';

import React, { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, FileText, Code, Star, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { PurchaseRecord } from '../../../../../lib/types';
import { generateSignatureHTML as genApexOrg } from '../../../../../components/templates/pack-01-corporate/signature';
import { generateSignatureHTML as genLexLeg } from '../../../../../components/templates/pack-02-legal/signature';
import ApexCorporateLetterhead from '../../../../../components/templates/pack-01-corporate/letterhead';
import LexLegalLetterhead from '../../../../../components/templates/pack-02-legal/letterhead';
import { LETTERHEAD_DIMENSIONS } from '../../../../../lib/constants';

export default function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const packId = resolvedParams.id;
  const searchParams = useSearchParams();
  const purchaseId = searchParams?.get('purchaseId');

  const [purchase, setPurchase] = useState<PurchaseRecord | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewName, setReviewName] = useState('');

  useEffect(() => {
    try {
      const records = JSON.parse(localStorage.getItem('branddoc_purchases') || '[]');
      let match = records.find((r: PurchaseRecord) => r.id === purchaseId);
      // Fallback if no search param
      if (!match) {
        match = records.find((r: PurchaseRecord) => r.packId === packId);
      }
      if (match) setPurchase(match);
    } catch (e) {}
  }, [packId, purchaseId]);

  const handleDownloadPDF = () => {
    // TODO: Replace with real server-side PDF generation that POSTs brandData to /api/export/letterhead-pdf/
    // For MVp, we use browser's print API
    toast('Preparing PDF...', { icon: '⏳' });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownloadSignature = () => {
    if (!purchase) return;
    
    let htmlStr = '';
    if (packId === 'pack-02-legal') {
      htmlStr = genLexLeg(purchase.brandData);
    } else {
      // Default / Apex
      htmlStr = genApexOrg(purchase.brandData);
    }

    navigator.clipboard.writeText(htmlStr)
      .then(() => {
        toast.success('Copied to clipboard — paste into your email settings');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/reviews
    console.log('Submitted review:', { packId, rating, reviewName, reviewBody });
    toast.success('Thank you for your review!');
    setRating(0);
    setReviewBody('');
  };

  if (!purchase) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse">Loading purchase details...</div>
      </div>
    );
  }

  // Pick the right letterhead component for printing
  const TemplateComponent = packId === 'pack-02-legal' ? LexLegalLetterhead : ApexCorporateLetterhead;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Hidden container specifically for PDF printing */}
      <div className="hidden @media print:block print:absolute print:top-0 print:left-0 print:w-[794px] print:h-[1123px] print:bg-white print:z-50 m-0 p-0">
        <style type="text/css" media="print">
          {`
            @page { size: auto; margin: 0; }
            body { 
              visibility: hidden; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container, .print-container * { visibility: visible; }
            .print-container { position: absolute; left: 0; top: 0; width: 794px; height: 1123px; }
          `}
        </style>
        <div className="print-container">
          <TemplateComponent brandData={purchase.brandData} />
        </div>
      </div>

      <div className="text-center mb-16 print:hidden">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase successful!</h1>
        <p className="text-gray-500">
          Order <strong>{purchase.id || 'Confirmed'}</strong> • {new Date(purchase.purchasedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16 print:hidden">
        {/* Letterhead Download */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
             <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Letterhead</h2>
          <p className="text-gray-500 text-sm mb-6">High resolution PDF ready for printing or using in MS Word.</p>
          <button 
            onClick={handleDownloadPDF}
            className="w-full bg-[#1B57DB] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Download PDF
          </button>
        </div>

        {/* Signature Download */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
             <Code className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Signature</h2>
          <p className="text-gray-500 text-sm mb-6">Safe HTML code you can paste directly into Gmail, Outlook, or Apple Mail.</p>
          <button 
            onClick={handleDownloadSignature}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Code className="w-5 h-5" /> Copy HTML
          </button>
        </div>
      </div>

      {/* Review Section print:hidden */}
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl mb-16 print:hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How was your experience?</h2>
        <form onSubmit={handleReviewSubmit} className="max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 stroke-2'}`} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
              <input 
                type="text" 
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
              <textarea 
                value={reviewBody}
                onChange={e => setReviewBody(e.target.value)}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!rating || !reviewBody}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Upsell Card print:hidden */}
      <div className="bg-[#0A0A0A] p-8 sm:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 print:hidden relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1B57DB] rounded-full blur-3xl opacity-20" />
        
        <div className="relative z-10 text-white max-w-xl">
          <h2 className="text-3xl font-bold mb-4 leading-tight">Need a professional website to match your new brand?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Cresbyte is a premium web development agency building fast, reliable, and high-converting websites for businesses ready to scale.
          </p>
          
          <div className="space-y-4 mb-8">
             <div className="flex gap-4">
               <div className="w-1 bg-[#1B57DB] rounded" />
               <p className="text-sm text-gray-300 italic">"Cresbyte rebuilt our entire site and traffic converting perfectly."<br/>— Alex, FinCorp</p>
             </div>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-auto flex-shrink-0">
          <a 
            href="https://cresbyte.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#1B57DB] hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-900/30"
          >
            Get a Free Quote <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
      
    </div>
  );
}
