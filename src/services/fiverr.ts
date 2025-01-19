import axios from 'axios';
import type { Freelancer } from '../types';

const FIVERR_API_URL = 'https://api.fiverr.com/v1';

// Vous devrez remplacer ces valeurs par vos véritables clés d'API Fiverr
const FIVERR_API_KEY = process.env.VITE_FIVERR_API_KEY;

const fiverrApi = axios.create({
  baseURL: FIVERR_API_URL,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${FIVERR_API_KEY}`,
  },
});

export async function searchFreelancers(query: string): Promise<Freelancer[]> {
  try {
    const response = await fiverrApi.get('/gigs/search', {
      params: {
        query,
        limit: 10,
      },
    });

    // Transformer les données de Fiverr en notre format Freelancer
    return response.data.gigs.map((gig: any) => ({
      id: gig.id,
      name: gig.seller.username,
      avatar: gig.seller.profile_image,
      skills: gig.skills || [],
      hourlyRate: Math.round(gig.price / gig.delivery_time), // Estimation du taux horaire
      rating: gig.rating,
      availability: gig.delivery_time <= 1 ? 'immediate' : 
                   gig.delivery_time <= 7 ? 'within_week' : 'within_month',
      platform: 'fiverr',
      location: gig.seller.country,
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche sur Fiverr:', error);
    return [];
  }
}