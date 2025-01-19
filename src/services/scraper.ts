import type { Freelancer, SearchIntent } from '../types';
import { analyzeQuery } from './nlp';
import { analyzeAndRankFreelancers } from './ai';

// Données mockées pour le développement avec des freelances à Manhattan
const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: '1',
    name: 'Michael Ross',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    hourlyRate: 120,
    rating: 4.9,
    availability: 'immediate',
    platform: 'fiverr',
    location: 'Manhattan, New York',
    description: 'Développeur full stack senior spécialisé dans les applications cloud-native. Plus de 8 ans d\'expérience dans le développement d\'applications d\'entreprise évolutives avec React et Node.js.'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['UI/UX', 'Figma', 'Product Design', 'iOS'],
    hourlyRate: 110,
    rating: 5.0,
    availability: 'immediate',
    platform: 'fiverr',
    location: 'Manhattan, New York',
    description: 'Designer produit passionnée par la création d\'expériences utilisateur intuitives. Expertise en design systems et en prototypage rapide. Portfolio comprenant des applications iOS primées.'
  },
  {
    id: '3',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Full Stack', 'Python', 'Django', 'PostgreSQL'],
    hourlyRate: 130,
    rating: 4.8,
    availability: 'within_week',
    platform: 'fiverr',
    location: 'Manhattan, New York',
    description: 'Architecte logiciel avec une solide expérience en développement backend. Spécialisé dans la création d\'APIs performantes et la gestion de bases de données à grande échelle.'
  },
  {
    id: '4',
    name: 'Rachel Green',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Mobile', 'React Native', 'Swift', 'Firebase'],
    hourlyRate: 125,
    rating: 4.9,
    availability: 'immediate',
    platform: 'fiverr',
    location: 'Manhattan, New York',
    description: 'Développeuse mobile cross-platform avec une expertise particulière en React Native et Swift. Création d\'applications mobiles performantes et intuitives pour iOS et Android.'
  },
  {
    id: '5',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['AI/ML', 'TensorFlow', 'Data Science', 'Python'],
    hourlyRate: 150,
    rating: 5.0,
    availability: 'within_week',
    platform: 'fiverr',
    location: 'Manhattan, New York',
    description: 'Expert en intelligence artificielle et machine learning. Doctorat en IA avec une expérience pratique dans l\'implémentation de solutions ML pour des entreprises Fortune 500.'
  }
];

export async function searchFreelancers(query: string): Promise<Freelancer[]> {
  try {
    // Analyser l'intention de recherche
    const intent = await analyzeQuery(query);

    // Filtrer les freelancers selon les critères détectés
    let results = MOCK_FREELANCERS.filter(freelancer => {
      // Vérifier la localisation
      if (intent.location) {
        const normalizedLocation = intent.location.toLowerCase();
        const normalizedFreelancerLocation = freelancer.location.toLowerCase();
        if (!normalizedFreelancerLocation.includes(normalizedLocation)) {
          return false;
        }
      }

      // Vérifier le budget
      if (intent.maxBudget && freelancer.hourlyRate > intent.maxBudget) {
        return false;
      }

      // Vérifier la disponibilité immédiate
      if (intent.needsImmediate && freelancer.availability !== 'immediate') {
        return false;
      }

      return true;
    });

    // Utiliser l'IA pour classer les résultats
    results = analyzeAndRankFreelancers(results, query);

    // Limiter le nombre de résultats si demandé
    if (intent.limit && intent.limit > 0) {
      results = results.slice(0, intent.limit);
    }

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}