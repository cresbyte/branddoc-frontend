export type Category = 
  | 'All' 
  | 'Corporate' 
  | 'Legal' 
  | 'Real Estate' 
  | 'Healthcare' 
  | 'Consultancy' 
  | 'Creative' 
  | 'Startup';

export type PreviewMode = 'letterhead' | 'signature';

export type DownloadFormat = 'pdf' | 'html' | 'png';

export interface BrandPack {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  previewImageUrl: string;
  priceKES: number;
  priceUSD: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tags: string[];
}

export interface BrandData {
  companyName: string;
  tagline: string;
  yourName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

export interface PurchaseRecord {
  id: string;
  packId: string;
  packName: string;
  purchasedAt: string;
  brandData: BrandData;
  downloadedLetterhead: boolean;
  downloadedSignature: boolean;
}

export interface Review {
  id: string;
  packId: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
}
