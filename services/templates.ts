import { BrandPack, Review } from '../lib/types';
import { MOCK_PACKS, MOCK_REVIEWS } from '../lib/mock-data';
import { SIMULATED_API_DELAY_MS } from '../lib/constants';

/**
 * Simulates a network request delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all available brand template packs.
 * TODO: Replace with real API call `GET /api/packs`
 */
export async function getTemplatePacks(): Promise<BrandPack[]> {
  await delay(SIMULATED_API_DELAY_MS);
  return MOCK_PACKS;
}

/**
 * Fetch a single brand template pack by ID.
 * TODO: Replace with real API call `GET /api/packs/:id`
 */
export async function getTemplatePack(id: string): Promise<BrandPack | null> {
  await delay(SIMULATED_API_DELAY_MS);
  const pack = MOCK_PACKS.find(p => p.id === id);
  return pack || null;
}

/**
 * Fetch featured brand template packs for the landing page.
 * TODO: Replace with real API call `GET /api/packs?featured=true`
 */
export async function getFeaturedPacks(): Promise<BrandPack[]> {
  await delay(SIMULATED_API_DELAY_MS);
  return MOCK_PACKS.filter(p => p.featured);
}

/**
 * Fetch reviews for a specific template pack.
 * TODO: Replace with real API call `GET /api/packs/:id/reviews`
 */
export async function getPackReviews(packId: string): Promise<Review[]> {
  await delay(SIMULATED_API_DELAY_MS);
  return MOCK_REVIEWS.filter(r => r.packId === packId);
}
