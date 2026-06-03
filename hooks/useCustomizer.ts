import { useState, useCallback, useEffect } from 'react';
import { BrandData } from '../lib/types';
import { DEFAULT_BRAND_DATA } from '../lib/mock-data';

export function useCustomizer() {
  const [brandData, setBrandData] = useState<BrandData>(DEFAULT_BRAND_DATA);
  const [isDirty, setIsDirty] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Clean up any object URL when the component unmounts or when a new one is created
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const setBrandField = useCallback(<K extends keyof BrandData>(field: K, value: BrandData[K]) => {
    setBrandData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  }, []);

  const handleLogoUpload = useCallback((file: File) => {
    // Revoke previous URL to avoid memory leaks
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    
    const newUrl = URL.createObjectURL(file);
    setObjectUrl(newUrl);
    setBrandField('logoUrl', newUrl);
  }, [objectUrl, setBrandField]);

  const resetBrandData = useCallback(() => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    setBrandData(DEFAULT_BRAND_DATA);
    setIsDirty(false);
  }, [objectUrl]);

  return {
    brandData,
    setBrandField,
    handleLogoUpload,
    resetBrandData,
    isDirty
  };
}
