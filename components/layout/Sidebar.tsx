import React from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-[#1B57DB] text-white flex items-center justify-center font-bold text-xl">
            B
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">BrandDoc</span>
        </Link>
        
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-[#1B57DB] font-semibold text-sm">
            <ShoppingBag className="w-5 h-5" />
            My Purchases
          </Link>
          <Link href="/templates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
            <Home className="w-5 h-5" />
            Browse Shop
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">U</div>
          <div>
            <div className="text-sm font-bold text-gray-900">Customer</div>
            <div className="text-xs text-gray-500">customer@example.com</div>
          </div>
        </div>
        <button className="flex items-center gap-3 text-sm text-gray-500 hover:text-red-600 transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
