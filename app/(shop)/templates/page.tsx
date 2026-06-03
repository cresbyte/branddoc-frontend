'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useTemplatePacks } from '../../../hooks/useTemplates';
import TemplateCard from '../../../components/shop/TemplateCard';
import { Category } from '../../../lib/types';

const CATEGORIES: Category[] = [
  'All', 'Corporate', 'Legal', 'Real Estate', 'Healthcare', 'Consultancy', 'Creative', 'Startup'
];

export default function TemplateGalleryPage() {
  const { data: packs = [], isLoading, isError } = useTemplatePacks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredPacks = useMemo(() => {
    return packs.filter(pack => {
      // Category filter
      if (activeCategory !== 'All' && pack.category !== activeCategory) {
        return false;
      }
      
      // Search filter (name and tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = pack.name.toLowerCase().includes(query);
        const matchesTags = pack.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesTags) {
          return false;
        }
      }
      
      return true;
    });
  }, [packs, searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
          Browse Brand Packs
        </h1>
        <p className="text-gray-600 mb-8">
          Find the perfect design for your industry. Every pack includes a matching letterhead and email signature.
        </p>
        
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#1B57DB] focus:border-transparent sm:text-sm transition-all shadow-sm"
            placeholder="Search templates by name or tag (e.g., 'navy', 'minimal')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-10 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex sm:justify-center gap-2 min-w-max">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-gray-900 border border-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm h-[400px]">
              <div className="h-[200px] bg-gray-200" />
              <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 bg-white rounded-xl border border-red-100">
          <p className="text-red-500 font-medium">Failed to load templates. Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && filteredPacks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium text-lg">No templates found matching your criteria.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-4 text-[#1B57DB] font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredPacks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPacks.map(pack => (
            <TemplateCard key={pack.id} pack={pack} />
          ))}
        </div>
      )}
    </div>
  );
}
