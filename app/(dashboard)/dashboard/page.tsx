'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PurchaseRecord } from '../../../lib/types';
import { ArrowRight, PackageOpen, Download } from 'lucide-react';

export default function DashboardPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const records = JSON.parse(localStorage.getItem('branddoc_purchases') || '[]');
      setPurchases(records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading your purchases...</div>;
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <PackageOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No purchases yet</h2>
        <p className="text-gray-500 mb-8">
          You haven't bought any templates yet. Browse our selection of premium templates to get started.
        </p>
        <Link 
          href="/templates" 
          className="inline-flex items-center gap-2 bg-[#1B57DB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Browse Templates <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Purchases</h2>
        <p className="text-gray-500 font-medium">Access and re-download your brand templates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map(purchase => (
          <div key={purchase.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Order {purchase.id.split('_')[1]}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{purchase.packName}</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-xs text-gray-500 mb-1">Brand Name</div>
                <div className="font-semibold text-gray-900 truncate">
                  {purchase.brandData.companyName || 'No Company Name'}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-6 flex justify-between items-center">
                 <span>Purchased {new Date(purchase.purchasedAt).toLocaleDateString()}</span>
              </div>
              
              <Link
                href={`/templates/${purchase.packId}/success?purchaseId=${purchase.id}`}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg font-semibold text-sm transition"
              >
                <Download className="w-4 h-4" /> Access Files
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
