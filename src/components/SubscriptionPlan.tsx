import React from 'react';
import { Check, Star } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

interface SubscriptionPlanProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

export function SubscriptionPlan({ plan, isSelected, onSelect }: SubscriptionPlanProps) {
  return (
    <div
      className={`relative p-6 rounded-lg border transition-all cursor-pointer group ${
        isSelected
          ? 'border-mono-50 bg-gradient-to-br from-mono-700/50 to-mono-800/50 transform scale-[1.02]'
          : 'border-mono-700 bg-mono-800 hover:border-mono-600 hover:scale-[1.01]'
      }`}
      onClick={onSelect}
    >
      {/* Badge "Populaire" */}
      {plan.isPopular && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-mono-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3" />
            Populaire
          </div>
        </div>
      )}

      {/* Indicateur de sélection */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected 
              ? 'border-mono-50 bg-mono-50 scale-110' 
              : 'border-mono-600 group-hover:border-mono-500'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-mono-900" />}
        </div>
      </div>

      {/* En-tête du plan */}
      <div className="space-y-2">
        <h3 className={`text-xl font-orbitron ${isSelected ? 'text-mono-50' : 'text-mono-200 group-hover:text-mono-50'} transition-colors`}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${isSelected ? 'text-mono-50' : 'text-mono-300 group-hover:text-mono-50'} transition-colors`}>
            {plan.price}€
          </span>
          <span className="text-mono-400">/mois</span>
        </div>
      </div>

      {/* Séparateur */}
      <div className="my-4 border-t border-mono-700" />

      {/* Liste des fonctionnalités */}
      <ul className="space-y-3">
        {plan.features.map((feature, index) => (
          <li 
            key={index} 
            className={`flex items-center text-sm ${
              isSelected ? 'text-mono-200' : 'text-mono-300'
            } group-hover:text-mono-200 transition-colors`}
          >
            <div className={`mr-3 p-0.5 rounded-full ${
              isSelected 
                ? 'bg-mono-50 text-mono-900' 
                : 'bg-mono-700 text-mono-400 group-hover:bg-mono-600'
            } transition-all`}>
              <Check className="w-3 h-3" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}