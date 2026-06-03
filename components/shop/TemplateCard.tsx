import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { BrandPack } from '../../lib/types';

interface TemplateCardProps {
  pack: BrandPack;
}

export default function TemplateCard({ pack }: TemplateCardProps) {
  return (
    <Link 
      href={`/templates/${pack.id}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="aspect-[4/3] bg-gray-100 border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for template image preview */}
        <div className="absolute inset-0 p-4">
          <div className="w-full h-full bg-white shadow-sm border border-gray-200 rounded flex flex-col items-center justify-center p-6 text-center group-hover:scale-[1.02] transition-transform duration-300">
             <div 
               className="w-12 h-12 rounded opacity-50 mb-4" 
               style={{ backgroundColor: pack.id.includes('corporate') ? '#1B2B4B' : pack.id.includes('legal') ? '#2C2C2C' : pack.id.includes('realestate') ? '#2d5a27' : '#e65100' }} 
             />
             <div className="w-16 h-1 bg-gray-200 mb-2 rounded" />
             <div className="w-24 h-1 bg-gray-200 mb-4 rounded" />
             <div className="text-xs font-bold text-gray-400 capitalize">{pack.name} Preview</div>
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 rounded-full border border-gray-100">
          {pack.category}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {pack.name}
          </h3>
          <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-0.5 rounded text-yellow-700 text-sm font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            {pack.rating}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {pack.description}
        </p>
        
        <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
          <div>
            <div className="font-bold text-xl text-gray-900">
              KSh {pack.priceKES.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              ~${pack.priceUSD}
            </div>
          </div>
          
          <button className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Customize
          </button>
        </div>
      </div>
    </Link>
  );
}
