import { BrandData, BrandPack, Review } from './types';

export const DEFAULT_BRAND_DATA: BrandData = {
  companyName: 'Cresbyte Ltd',
  tagline: 'Empowering Digital Experiences',
  yourName: 'Kimani Mwangi',
  jobTitle: 'Managing Director',
  email: 'hello@cresbyte.com',
  phone: '+254 712 345 678',
  website: 'www.cresbyte.com',
  address: '12th Floor, The Address, Westlands, Nairobi',
  primaryColor: '#1B57DB',
  secondaryColor: '#F0F4FF',
  logoUrl: '',
};

export const MOCK_PACKS: BrandPack[] = [
  {
    id: 'pack-01-corporate',
    name: 'Apex Corporate',
    slug: 'apex-corporate',
    category: 'Corporate',
    description: 'Clean, authoritative design for established businesses. Navy and gold color palette with strong typography hierarchy.',
    previewImageUrl: '/previews/apex-corporate.png', // We'll handle images via UI placeholders 
    priceKES: 1500,
    priceUSD: 12,
    rating: 4.8,
    reviewCount: 34,
    featured: true,
    tags: ['professional', 'corporate', 'navy', 'gold'],
  },
  {
    id: 'pack-02-legal',
    name: 'Lex Legal',
    slug: 'lex-legal',
    category: 'Legal',
    description: 'Precise, professional design for law firms and legal consultancies. Dark charcoal with burgundy accents.',
    previewImageUrl: '/previews/lex-legal.png',
    priceKES: 2000,
    priceUSD: 15,
    rating: 4.9,
    reviewCount: 28,
    featured: true,
    tags: ['legal', 'law firm', 'formal', 'burgundy'],
  },
  {
    id: 'pack-03-realestate',
    name: 'Horizon Real Estate',
    slug: 'horizon-realestate',
    category: 'Real Estate',
    description: 'Elegant and expansive design meant to showcase properties and trust. Forest green with soft beige.',
    previewImageUrl: '/previews/horizon-realestate.png',
    priceKES: 1800,
    priceUSD: 14,
    rating: 4.7,
    reviewCount: 19,
    featured: false,
    tags: ['real estate', 'property', 'green', 'trust'],
  },
  {
    id: 'pack-04-creative',
    name: 'Vivid Creative',
    slug: 'vivid-creative',
    category: 'Creative',
    description: 'Bold, asymmetric layout for agencies and freelancers. Vibrant orange with deep slate.',
    previewImageUrl: '/previews/vivid-creative.png',
    priceKES: 1200,
    priceUSD: 10,
    rating: 4.6,
    reviewCount: 42,
    featured: true,
    tags: ['agency', 'design', 'orange', 'modern'],
  }
];

export const MOCK_REVIEWS: Review[] = [
  // Apex Corporate Reviews
  { id: 'rev-101', packId: 'pack-01-corporate', authorName: 'Njogu N.', rating: 5, body: 'Extremely professional look. My clients immediately noticed the difference in our correspondence.', createdAt: '2023-11-12T10:00:00Z' },
  { id: 'rev-102', packId: 'pack-01-corporate', authorName: 'Sarah Jenkins', rating: 4, body: 'Very easy to customize the colors to match our branding. Clean and straightforward.', createdAt: '2023-12-05T14:30:00Z' },
  { id: 'rev-103', packId: 'pack-01-corporate', authorName: 'James Omondi', rating: 5, body: 'The HTML signature installed perfectly into my Outlook. Incredible value for money.', createdAt: '2024-01-20T09:15:00Z' },
  { id: 'rev-104', packId: 'pack-01-corporate', authorName: 'Wairimu K.', rating: 5, body: 'Perfect for our consulting firm. The layout is just what we needed.', createdAt: '2024-03-02T16:45:00Z' },
  
  // Lex Legal Reviews
  { id: 'rev-201', packId: 'pack-02-legal', authorName: 'Michael Kip', rating: 5, body: 'The dark charcoal and burgundy combination exudes authority. Highly recommended for any new practice.', createdAt: '2023-10-18T11:20:00Z' },
  { id: 'rev-202', packId: 'pack-02-legal', authorName: 'David L.', rating: 5, body: 'Exactly the kind of polished document template we needed without hiring an expensive designer.', createdAt: '2024-02-14T15:10:00Z' },
  { id: 'rev-203', packId: 'pack-02-legal', authorName: 'Grace M.', rating: 4, body: 'Very solid. Only wish I could tweak the font families a bit, but the default looks great anyway.', createdAt: '2024-04-10T12:00:00Z' },
  
  // Horizon Real Estate Reviews
  { id: 'rev-301', packId: 'pack-03-realestate', authorName: 'Peter W.', rating: 5, body: 'Really fits the real estate vibe. Smooth transactions with the PDF download.', createdAt: '2024-01-11T08:30:00Z' },
  { id: 'rev-302', packId: 'pack-03-realestate', authorName: 'Alice N.', rating: 4, body: 'Great templates. Love the green tones.', createdAt: '2024-03-22T09:40:00Z' },
  { id: 'rev-303', packId: 'pack-03-realestate', authorName: 'John Doe', rating: 5, body: 'Saves me so much time when generating official letters for clients.', createdAt: '2024-05-01T14:20:00Z' },

  // Vivid Creative Reviews
  { id: 'rev-401', packId: 'pack-04-creative', authorName: 'Esther K.', rating: 4, body: 'Bold and stands out! Easy to manage in Gmail as well.', createdAt: '2023-09-05T10:10:00Z' },
  { id: 'rev-402', packId: 'pack-04-creative', authorName: 'Mark M.', rating: 5, body: 'Modern style that our tech startup loves. The email signature is flawless.', createdAt: '2023-11-28T13:45:00Z' },
  { id: 'rev-403', packId: 'pack-04-creative', authorName: 'Linda A.', rating: 5, body: 'Super fast delivery and everything looks right in the preview. Awesome.', createdAt: '2024-02-09T17:30:00Z' }
];
