import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BrandPack, BrandData, PurchaseRecord } from '../lib/types';
import { PAYMENT_PROCESSING_DELAY_MS } from '../lib/constants';

export function usePurchase(pack: BrandPack | null, brandData: BrandData) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setStep(1);
  }, []);

  const closeModal = useCallback(() => {
    if (!isProcessing) {
      setIsOpen(false);
    }
  }, [isProcessing]);

  const goToPayment = useCallback(() => {
    setStep(2);
  }, []);

  const processPayment = useCallback(async (paymentDetails: { name: string; email: string }) => {
    if (!pack) return;
    
    setIsProcessing(true);
    
    // Fake payment delay
    await new Promise(resolve => setTimeout(resolve, PAYMENT_PROCESSING_DELAY_MS));
    
    setIsProcessing(false);
    setStep(3);

    // Create purchase record
    const purchaseId = `ord_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    const record: PurchaseRecord = {
      id: purchaseId,
      packId: pack.id,
      packName: pack.name,
      purchasedAt: new Date().toISOString(),
      brandData,
      downloadedLetterhead: false,
      downloadedSignature: false,
    };

    // Save to local storage
    try {
      const existingStr = localStorage.getItem('branddoc_purchases');
      const existing: PurchaseRecord[] = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('branddoc_purchases', JSON.stringify([record, ...existing]));
    } catch (err) {
      console.error('Failed to save purchase to localStorage', err);
    }

    // Allow user to see step 3 for a moment, or they can click "Download Your Files" manually
  }, [pack, brandData]);

  const finishAndRedirect = useCallback(() => {
    if (!pack) return;
    
    // We get the most recent purchase ID for this pack
    try {
      const existingStr = localStorage.getItem('branddoc_purchases');
      if (existingStr) {
        const existing: PurchaseRecord[] = JSON.parse(existingStr);
        const record = existing.find(r => r.packId === pack.id);
        if (record) {
          router.push(`/templates/${pack.id}/success?purchaseId=${record.id}`);
          return;
        }
      }
    } catch (e) {}

    // Fallback if local storage failed
    router.push(`/templates/${pack.id}/success`);
  }, [pack, router]);

  return {
    isOpen,
    step,
    isProcessing,
    openModal,
    closeModal,
    goToPayment,
    processPayment,
    finishAndRedirect
  };
}
