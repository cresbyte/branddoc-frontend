import React, { useState } from 'react';
import { BrandPack } from '../../lib/types';
import { X, Check, Lock, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PurchaseModalProps {
  pack: BrandPack;
  isOpen: boolean;
  step: 1 | 2 | 3;
  isProcessing: boolean;
  onClose: () => void;
  onGoToPayment: () => void;
  onProcessPayment: (details: { name: string; email: string }) => void;
  onFinish: () => void;
  brandDataEmail?: string;
  brandDataName?: string;
}

export default function PurchaseModal({ 
  pack, isOpen, step, isProcessing, onClose, onGoToPayment, onProcessPayment, onFinish, 
  brandDataEmail = '', brandDataName = ''
}: PurchaseModalProps) {
  const [name, setName] = useState(brandDataName);
  const [email, setEmail] = useState(brandDataEmail);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => !isProcessing && onClose()}
      />

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-900">
             {step === 1 ? 'Order Summary' : step === 2 ? 'Secure Payment' : 'Success!'}
          </h2>
          {step !== 3 && !isProcessing && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {step < 3 && (
          <div className="h-1 bg-gray-100 w-full">
            <div 
              className="h-full bg-[#1B57DB] transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pack.name}</h3>
                  <p className="text-sm text-gray-500">{pack.category} Template Pack</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">KES {pack.priceKES.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">~${pack.priceUSD}</div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3">
                <div className="font-semibold text-sm text-gray-900 mb-2">What's included:</div>
                {[
                  'Letterhead PDF (High Resolution)',
                  'Email Signature HTML (Email Client Safe)',
                  'Lifetime Access & Re-downloads',
                  'Free Future Updates'
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-center text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <button 
                onClick={onGoToPayment}
                className="w-full bg-[#1B57DB] hover:bg-blue-700 text-white font-semibold text-lg py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                Proceed to Payment <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-200">
                <strong>Demo Mode:</strong> Payment powered by Paystack (coming soon). No real charges will be made.
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B57DB] outline-none"
                    placeholder="John Doe"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B57DB] outline-none"
                    placeholder="john@example.com"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <button 
                onClick={() => onProcessPayment({ name, email })}
                disabled={isProcessing || !name || !email}
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold text-lg py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> Complete Purchase (Demo)
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="py-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h3>
              <p className="text-gray-500 mb-8 max-w-[250px]">
                Your {pack.name} template pack is ready.
              </p>
              <button 
                onClick={onFinish}
                className="w-full bg-[#1B57DB] hover:bg-blue-700 text-white font-semibold text-lg py-3.5 rounded-xl transition-colors"
              >
                Download Your Files
              </button>
            </div>
          )}
        </div>
        
        {step < 3 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
            <CreditCard className="w-4 h-4" /> Secure, encrypted local demo processing.
          </div>
        )}
      </div>
    </div>
  );
}
