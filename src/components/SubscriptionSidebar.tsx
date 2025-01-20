import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SubscriptionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
  onSelectPlan: (plan: string) => void;
  onConfirm: () => void;
}

const plans = [
  {
    name: 'Basic',
    price: '0',
    features: [
      'Basic search access',
      '10 searches per day',
      'Email support'
    ]
  },
  {
    name: 'Pro',
    price: '29',
    features: [
      'Unlimited searches',
      'Advanced filters',
      'Priority support',
      'Data export'
    ],
    isPopular: true
  },
  {
    name: 'Enterprise',
    price: '99',
    features: [
      'Everything in Pro',
      'Dedicated API',
      '24/7 support',
      'Custom training',
      'Guaranteed SLA'
    ]
  }
];

export function SubscriptionSidebar({ isOpen, onClose, selectedPlan, onSelectPlan, onConfirm }: SubscriptionSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-mono-900 shadow-xl overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onClose} className="text-mono-400 hover:text-mono-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-orbitron text-mono-50">Choose your plan</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-3 rounded border ${
                  selectedPlan === plan.name
                    ? 'border-mono-50 bg-mono-800'
                    : 'border-mono-700 bg-mono-800/50 hover:border-mono-600'
                } cursor-pointer transition-all`}
                onClick={() => onSelectPlan(plan.name)}
              >
                {plan.isPopular && (
                  <span className="absolute right-2 top-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 font-medium">
                    Populaire
                  </span>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-mono-50">{plan.name}</span>
                  <div className="flex items-baseline gap-0.5 mt-1 mb-2">
                    <span className="text-xl font-bold text-mono-50">{plan.price}€</span>
                    <span className="text-[10px] text-mono-400">/mois</span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3 h-3 text-mono-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-xs text-mono-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onConfirm}
            disabled={!selectedPlan}
            className="w-full mt-3 py-1.5 bg-mono-50 text-mono-900 rounded hover:bg-mono-200 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedPlan ? `Complete registration with ${selectedPlan}` : 'Select a plan to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}