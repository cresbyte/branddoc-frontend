import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#1B57DB] text-white flex items-center justify-center font-bold text-xl">
                B
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">BrandDoc</span>
            </Link>
            <div className="hidden sm:flex ml-10 space-x-8">
              <Link href="/templates" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Templates
              </Link>
              <Link href="/#how-it-works" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                How It Works
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              My Purchases
            </Link>
            <Link 
              href="/templates" 
              className="bg-[#1B57DB] text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Browse Packs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
