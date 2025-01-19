import type { SearchIntent } from '../types';

const GOOGLE_API_KEY = 'AIzaSyBfGWbhIFlYuS6fbNSrjHBojHnPBhIB_wM';
const LANGUAGE_API_URL = 'https://language.googleapis.com/v1/documents:analyzeEntities';

// Dictionnaire de correction orthographique pour les villes
const LOCATION_CORRECTIONS: { [key: string]: string } = {
  'torkyo': 'tokyo',
  'tokio': 'tokyo',
  'toukyou': 'tokyo',
  'tokyou': 'tokyo',
  'manhatan': 'manhattan',
  'manathan': 'manhattan',
  'manhathan': 'manhattan'
};

// Mots-clés pour l'analyse d'intention
const INTENT_KEYWORDS = {
  skills: [
    'développeur', 'dev', 'expert', 'spécialiste', 'maîtrise',
    'connait', 'connaissant', 'sachant', 'capable',
    'wordpress', 'react', 'javascript', 'php', 'html', 'css',
    'fullstack', 'frontend', 'backend', 'web', 'mobile',
    'python', 'ruby', 'rails', 'vue', 'angular', 'node',
    'aws', 'cloud', 'devops', 'ml', 'ai'
  ],
  prepositions: ['à', 'a', 'de', 'sur', 'près', 'proche', 'en', 'dans', 'au', 'en'],
  availability: [
    'disponible', 'urgent', 'rapidement', 'immédiatement',
    'maintenant', 'vite', 'pressé', 'besoin', 'dès que possible'
  ],
  budget: [
    'budget', 'prix', 'coût', 'tarif', 'euros', '€', 'yen', '¥',
    'maximum', 'minimum', 'moins', 'plus', 'environ', 'autour'
  ],
  quantity: [
    'donne', 'montre', 'affiche', 'trouve', 'cherche',
    'freelance', 'freelances', 'profil', 'profils',
    'personne', 'personnes', 'développeur', 'développeurs'
  ]
};

// Normalisation du texte
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Correction orthographique des localisations
function correctLocation(location: string): string {
  const normalized = normalizeText(location);
  return LOCATION_CORRECTIONS[normalized] || normalized;
}

// Extraction des nombres
function extractNumbers(text: string): number[] {
  const numbers = text.match(/\d+/g)?.map(Number) || [];
  return numbers.filter(n => n > 0 && n <= 1000);
}

async function detectLocation(query: string): Promise<string> {
  try {
    // Vérifier d'abord les corrections orthographiques connues
    const words = normalizeText(query).split(' ');
    for (const word of words) {
      if (LOCATION_CORRECTIONS[word]) {
        return LOCATION_CORRECTIONS[word];
      }
    }

    // Vérifier spécifiquement pour Manhattan
    if (words.includes('manhattan') || words.includes('manhatan')) {
      return 'manhattan';
    }

    const response = await fetch(`${LANGUAGE_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: query,
          language: 'fr'
        },
        encodingType: 'UTF8'
      })
    });

    const data = await response.json();
    
    const locationEntity = data.entities?.find(
      (entity: any) => entity.type === 'LOCATION'
    );

    if (locationEntity?.name) {
      return correctLocation(locationEntity.name);
    }

    return '';
  } catch (error) {
    console.error('Erreur lors de la détection de la localisation:', error);
    return '';
  }
}

export async function analyzeQuery(query: string): Promise<SearchIntent> {
  const normalizedQuery = normalizeText(query);
  const words = normalizedQuery.split(' ');
  const numbers = extractNumbers(query);

  const intent: SearchIntent = {
    skills: [],
    location: '',
    maxBudget: undefined,
    needsImmediate: false,
    limit: undefined,
    originalQuery: query
  };

  // Détection du nombre de résultats demandés
  if (numbers.length > 0 && words.some(word => INTENT_KEYWORDS.quantity.includes(word))) {
    intent.limit = numbers[0];
  }

  // Détection des compétences
  words.forEach(word => {
    if (INTENT_KEYWORDS.skills.includes(word)) {
      intent.skills.push(word);
    }
  });

  // Détection de la localisation avec correction orthographique
  intent.location = await detectLocation(query);

  // Détection du budget
  if (numbers.length > 0) {
    const budgetIndex = words.findIndex(word => INTENT_KEYWORDS.budget.includes(word));
    if (budgetIndex !== -1) {
      intent.maxBudget = Math.max(...numbers);
    }
  }

  // Détection de la disponibilité immédiate
  intent.needsImmediate = words.some(word => INTENT_KEYWORDS.availability.includes(word));

  return intent;
}