import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-[#1B57DB] text-white flex items-center justify-center font-bold text-sm">
              B
            </div>
            <span className="font-bold text-lg text-gray-900">BrandDoc</span>
          </div>
          <p className="text-gray-500 text-sm">Your brand. Every email. Every document.</p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-gray-500">
          <Link href="/templates" className="hover:text-[#1B57DB] transition-colors">Templates</Link>
          <Link href="/#how-it-works" className="hover:text-[#1B57DB] transition-colors">How It Works</Link>
          <a href="mailto:hello@cresbyte.com" className="hover:text-[#1B57DB] transition-colors">Contact</a>
        </div>
        
        <div className="text-sm text-gray-500">
          Built by <a href="https://cresbyte.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1B57DB] hover:underline">Cresbyte</a>
        </div>
      </div>
    </footer>
  );
}
