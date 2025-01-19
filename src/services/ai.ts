import type { Freelancer } from '../types';

// Système de scoring pour l'IA
interface AIScore {
  freelancer: Freelancer;
  score: number;
  matchingSkills: string[];
  relevanceFactors: {
    skillMatch: number;
    ratingScore: number;
    availabilityScore: number;
    locationScore: number;
    priceScore: number;
  };
}

// Normalisation des textes pour la comparaison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

// Calcul de la similarité entre deux chaînes
function calculateSimilarity(str1: string, str2: string): number {
  const a = new Set(normalizeText(str1).split(' '));
  const b = new Set(normalizeText(str2).split(' '));
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

// Analyse des compétences requises dans la requête
function extractSkillsFromQuery(query: string): string[] {
  const normalizedQuery = normalizeText(query);
  const commonTechWords = [
    'react', 'vue', 'angular', 'node', 'javascript', 'typescript',
    'python', 'java', 'php', 'ruby', 'c#', 'swift', 'kotlin',
    'aws', 'azure', 'gcp', 'devops', 'frontend', 'backend',
    'fullstack', 'mobile', 'web', 'cloud', 'ai', 'ml'
  ];
  
  return commonTechWords.filter(skill => 
    normalizedQuery.includes(skill) ||
    calculateSimilarity(normalizedQuery, skill) > 0.8
  );
}

// Analyse de la localisation dans la requête
function extractLocationFromQuery(query: string): string {
  const normalizedQuery = normalizeText(query);
  const locationKeywords = ['à', 'a', 'in', 'from', 'de'];
  
  for (const keyword of locationKeywords) {
    const index = normalizedQuery.indexOf(` ${keyword} `);
    if (index !== -1) {
      const location = normalizedQuery.slice(index).split(' ')[2];
      if (location && location.length > 2) return location;
    }
  }
  
  return '';
}

// Calcul du score pour un freelance
function calculateFreelancerScore(
  freelancer: Freelancer,
  query: string,
  extractedSkills: string[],
  extractedLocation: string
): AIScore {
  const matchingSkills = freelancer.skills.filter(skill =>
    extractedSkills.some(reqSkill =>
      calculateSimilarity(skill, reqSkill) > 0.8
    )
  );

  // Calcul des différents facteurs de pertinence
  const skillMatch = matchingSkills.length / Math.max(extractedSkills.length, 1);
  const ratingScore = freelancer.rating / 5;
  const availabilityScore = 
    freelancer.availability === 'immediate' ? 1 :
    freelancer.availability === 'within_week' ? 0.7 :
    0.4;
  
  const locationScore = extractedLocation ?
    calculateSimilarity(freelancer.location, extractedLocation) : 1;

  // Score de prix (favorise les prix moyens)
  const optimalPrice = 100; // Prix optimal en €/h
  const priceScore = 1 - Math.abs(freelancer.hourlyRate - optimalPrice) / 200;

  // Score final pondéré
  const score = (
    skillMatch * 0.4 +
    ratingScore * 0.2 +
    availabilityScore * 0.2 +
    locationScore * 0.1 +
    priceScore * 0.1
  );

  return {
    freelancer,
    score,
    matchingSkills,
    relevanceFactors: {
      skillMatch,
      ratingScore,
      availabilityScore,
      locationScore,
      priceScore
    }
  };
}

// Fonction principale d'analyse et de tri des freelances
export function analyzeAndRankFreelancers(
  freelancers: Freelancer[],
  query: string
): Freelancer[] {
  const extractedSkills = extractSkillsFromQuery(query);
  const extractedLocation = extractLocationFromQuery(query);

  // Calcul des scores pour chaque freelance
  const scores: AIScore[] = freelancers.map(freelancer =>
    calculateFreelancerScore(
      freelancer,
      query,
      extractedSkills,
      extractedLocation
    )
  );

  // Tri par score décroissant
  scores.sort((a, b) => b.score - a.score);

  // Retourne les freelances triés
  return scores.map(score => score.freelancer);
}