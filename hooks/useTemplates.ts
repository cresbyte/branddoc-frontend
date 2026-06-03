import { useQuery } from '@tanstack/react-query';
import { getFeaturedPacks, getPackReviews, getTemplatePack, getTemplatePacks } from '../services/templates';

export function useTemplatePacks() {
  return useQuery({
    queryKey: ['packs'],
    queryFn: getTemplatePacks,
  });
}

export function useTemplatePack(id: string) {
  return useQuery({
    queryKey: ['pack', id],
    queryFn: () => getTemplatePack(id),
    enabled: !!id,
  });
}

export function useFeaturedPacks() {
  return useQuery({
    queryKey: ['packs', 'featured'],
    queryFn: getFeaturedPacks,
  });
}

export function usePackReviews(packId: string) {
  return useQuery({
    queryKey: ['reviews', packId],
    queryFn: () => getPackReviews(packId),
    enabled: !!packId,
  });
}
