import React from 'react';
import { Sliders } from 'lucide-react';
import type { SearchFilters } from '../types';

interface FiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

// Palette de couleurs pour l'animation du fond
const gradients = [
  'from-emerald-500/5 to-teal-500/5',
  'from-rose-500/5 to-pink-500/5',
  'from-amber-500/5 to-orange-500/5',
  'from-violet-500/5 to-purple-500/5',
  'from-blue-500/5 to-indigo-500/5',
];

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const [hoveredSection, setHoveredSection] = React.useState<number | null>(null);
  const [currentGradient, setCurrentGradient] = React.useState(0);

  React.useEffect(() => {
    if (hoveredSection !== null) {
      const interval = setInterval(() => {
        setCurrentGradient((prev) => (prev + 1) % gradients.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hoveredSection]);

  const sections = [
    {
      title: "Tarif horaire",
      content: (
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={filters.minRate}
            onChange={(e) => onFiltersChange({ ...filters, minRate: Number(e.target.value) })}
            className="w-24 px-3 py-2 bg-mono-900/50 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50 placeholder-mono-400"
            placeholder="Min"
          />
          <span className="text-mono-50">-</span>
          <input
            type="number"
            value={filters.maxRate}
            onChange={(e) => onFiltersChange({ ...filters, maxRate: Number(e.target.value) })}
            className="w-24 px-3 py-2 bg-mono-900/50 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50 placeholder-mono-400"
            placeholder="Max"
          />
          <span className="text-mono-50">€/h</span>
        </div>
      )
    },
    {
      title: "Note minimum",
      content: (
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => onFiltersChange({ ...filters, minRating: Number(e.target.value) })}
            className="w-full appearance-none h-1 bg-mono-900/50 rounded-full focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mono-50 [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="text-sm text-mono-50">{filters.minRating} étoiles minimum</div>
        </div>
      )
    },
    {
      title: "Disponibilité",
      content: (
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.immediateAvailability}
              onChange={(e) => onFiltersChange({ ...filters, immediateAvailability: e.target.checked })}
              className="peer sr-only"
            />
            <div className="w-5 h-5 border-2 border-mono-700 rounded transition-colors peer-checked:bg-mono-50 peer-checked:border-mono-50"></div>
            <div className="absolute inset-0 flex items-center justify-center text-mono-900 opacity-0 peer-checked:opacity-100 pointer-events-none">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className="text-sm text-mono-50 group-hover:text-mono-200 transition-colors">
            Disponible immédiatement
          </span>
        </label>
      )
    },
    {
      title: "Localisation",
      content: (
        <input
          type="text"
          value={filters.location}
          onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          className="w-full px-3 py-2 bg-mono-900/50 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50 placeholder-mono-400"
          placeholder="Ville ou pays"
        />
      )
    }
  ];

  return (
    <div className="p-6 bg-mono-800/50 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-8">
        <Sliders className="w-5 h-5 text-mono-50" />
        <h2 className="text-lg font-medium text-mono-50">Filtres</h2>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredSection(index)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Fond animé */}
            <div
              className={`absolute inset-0 -m-4 rounded-xl transition-opacity duration-300 bg-gradient-to-br ${
                hoveredSection === index ? `opacity-100 ${gradients[currentGradient]}` : 'opacity-0'
              }`}
            />
            
            {/* Contenu */}
            <div className="relative">
              <label className="text-sm font-medium text-mono-50 block mb-3">
                {section.title}
              </label>
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}