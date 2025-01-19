import React from 'react';
import { X } from 'lucide-react';

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-mono-800 border-t border-mono-700 p-4 shadow-lg z-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-mono-50 text-sm leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site.
              Vous pouvez choisir d'accepter ou de refuser ces cookies.
            </p>
            <p className="text-mono-300 text-xs mt-1">
              Les cookies essentiels ne peuvent pas être refusés car ils sont nécessaires au fonctionnement du site.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAccept}
              className="px-4 py-2 text-sm bg-mono-50 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors"
            >
              Accepter
            </button>
            <button
              onClick={onDecline}
              className="px-4 py-2 text-sm text-mono-300 hover:text-mono-50 transition-colors"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}