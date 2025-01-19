import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SubscriptionPlan } from './SubscriptionPlan';

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
      <div className="fixed inset-y-0 right-0 w-full max-w-6xl bg-mono-800 shadow-xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-4 p-6 border-b border-mono-700">
            <button
              onClick={onClose}
              className="p-2 text-mono-400 hover:text-mono-50 transition-colors rounded-lg hover:bg-mono-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-orbitron text-mono-50">Choose your plan</h2>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-3 gap-6 h-full">
              {plans.map((plan) => (
                <SubscriptionPlan
                  key={plan.name}
                  plan={plan}
                  isSelected={selectedPlan === plan.name}
                  onSelect={() => onSelectPlan(plan.name)}
                />
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-mono-700">
            <button
              onClick={onConfirm}
              disabled={!selectedPlan}
              className="w-full px-8 py-3 bg-mono-50 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors font-orbitron disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete registration with {selectedPlan || 'selected plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}