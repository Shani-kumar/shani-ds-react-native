import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@shani/ui';
import { partnerThemeOverrides } from '../theme/partnerTheme';

export type BrandId = 'shani' | 'apex';

interface GalleryContextValue {
  brand: BrandId;
  setBrand: (brand: BrandId) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return ctx;
}

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brand, setBrand] = useState<BrandId>('shani');

  const overrides = useMemo(() => {
    return brand === 'apex' ? partnerThemeOverrides : undefined;
  }, [brand]);

  const value = useMemo(
    () => ({
      brand,
      setBrand,
    }),
    [brand]
  );

  return (
    <GalleryContext.Provider value={value}>
      <ThemeProvider initialMode="light" overrides={overrides}>
        {children}
      </ThemeProvider>
    </GalleryContext.Provider>
  );
};

