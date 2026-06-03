import React from 'react';
import Link from 'next/link';
import { Palette, FileCheck, Download, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getFeaturedPacks } from '../../services/templates';
import { MOCK_REVIEWS } from '../../lib/mock-data';
import TemplateCard from '../../components/shop/TemplateCard';

export default async function MarketingPage() {
  const featuredPacks = await getFeaturedPacks();
  // Grab a few 5-star reviews for social proof
  const reviews = MOCK_REVIEWS.filter(r => r.rating === 5).slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#F0F4FF] pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Your brand. <br className="hidden lg:block" />
              <span className="text-[#1B57DB]">Every email. Every document.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              Premium letterheads and email signatures designed to make your small business look like an established enterprise. Customize, download, and impress instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/templates" 
                className="w-full sm:w-auto bg-[#1B57DB] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                Browse Templates <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#how-it-works" 
                className="w-full sm:w-auto bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                See How It Works
              </a>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> No subscription</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Lifetime access</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Instantly ready</div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            {/* Visual representation of a letterhead + signature */}
            <div className="aspect-[4/3] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col gap-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Fake Letterhead Top */}
              <div className="h-24 bg-[#1B2B4B] rounded flex items-center justify-between px-6">
                <div className="w-8 h-8 rounded bg-white/20" />
                <div className="w-32 h-4 rounded bg-white/40" />
              </div>
              <div className="h-2 bg-[#C9A84C] -mt-6" />
              
              {/* Fake Template content */}
              <div className="flex-1 space-y-4 px-6 pt-4">
                <div className="w-1/3 h-3 rounded bg-gray-200" />
                <div className="w-1/4 h-3 rounded bg-gray-200" />
                <div className="w-full h-2 rounded bg-gray-100" />
                <div className="w-5/6 h-2 rounded bg-gray-100" />
                <div className="w-4/6 h-2 rounded bg-gray-100" />
              </div>
              
              {/* Fake Signature superimposed */}
              <div className="absolute -bottom-6 -right-6 bg-white p-5 shadow-2xl rounded-xl border border-gray-100 w-72 transform -rotate-2">
                 <div className="flex gap-4 items-center">
                   <div className="w-10 h-10 rounded bg-[#1B2B4B]" />
                   <div>
                     <div className="w-24 h-3 rounded bg-gray-800 mb-2" />
                     <div className="w-16 h-2 rounded bg-[#C9A84C]" />
                   </div>
                 </div>
                 <div className="h-px w-full bg-gray-100 my-4" />
                 <div className="w-full h-2 rounded bg-gray-200 mb-2" />
                 <div className="w-4/5 h-2 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 inline-block relative">
              How it works
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#1B57DB] rounded" />
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Palette className="w-10 h-10 text-[#1B57DB]" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1B57DB] text-white flex items-center justify-center font-bold absolute top-16 -right-4 border-4 border-white shadow-sm">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Choose a Template</h3>
              <p className="text-gray-600">Browse our gallery of industry-specific brand packs and pick the one that matches your vision.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <FileCheck className="w-10 h-10 text-[#1B57DB]" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1B57DB] text-white flex items-center justify-center font-bold absolute top-16 -right-4 border-4 border-white shadow-sm">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Your Details</h3>
              <p className="text-gray-600">Upload your logo, set your brand colors, and fill in your contact info. See the preview update instantly.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Download className="w-10 h-10 text-[#1B57DB]" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1B57DB] text-white flex items-center justify-center font-bold absolute top-16 -right-4 border-4 border-white shadow-sm">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Download & Use</h3>
              <p className="text-gray-600">Pay a one-time fee and download your PDF letterhead and HTML signature. Ready to use immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Packs</h2>
              <p className="text-gray-600">Our most popular designs, trusted by hundreds of businesses.</p>
            </div>
            <Link href="/templates" className="hidden sm:flex text-[#1B57DB] font-semibold hover:text-blue-700 items-center gap-1 group">
              View All Templates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x">
            {featuredPacks.map(pack => (
              <div key={pack.id} className="min-w-[300px] w-[85vw] sm:w-[350px] snap-center shrink-0">
                <TemplateCard pack={pack} />
              </div>
            ))}
          </div>
          
          <div className="mt-6 sm:hidden">
            <Link href="/templates" className="w-full flex justify-center text-[#1B57DB] font-semibold border border-gray-200 bg-white rounded-lg py-3">
              View All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by professionals</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">See what our customers are saying about their new brand materials.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map(review => (
              <div key={review.id} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                     <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 line-clamp-4 leading-relaxed">
                  "{review.body}"
                </p>
                <div className="font-bold text-gray-900">{review.authorName}</div>
                <div className="text-sm text-gray-500 mt-1">Verified Buyer</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upsell Banner */}
      <section className="bg-gray-900 py-20 relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4">Need a full website to match?</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Cresbyte builds custom websites for businesses across Africa and globally. If you need a website that matches your new brand identity, our team can help.
            </p>
          </div>
          <div>
            <a 
              href="https://cresbyte.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex bg-[#1B57DB] hover:bg-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/50"
            >
              Talk to Cresbyte
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
