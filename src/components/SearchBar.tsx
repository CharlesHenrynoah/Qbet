import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onUpload?: () => void;
}

export function SearchBar({ onSearch, onUpload }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [gradientPosition, setGradientPosition] = useState(0);

  // Palette de couleurs pour l'animation
  const gradients = [
    'from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
    'from-rose-500/10 via-pink-500/5 to-fuchsia-500/10',
    'from-amber-500/10 via-orange-500/5 to-yellow-500/10',
    'from-violet-500/10 via-purple-500/5 to-indigo-500/10',
    'from-blue-500/10 via-sky-500/5 to-cyan-500/10',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  const handleFocus = () => {
    setIsAnimating(true);
    animateGradient();
  };

  const handleBlur = () => {
    setIsAnimating(false);
    setGradientPosition(0);
  };

  const animateGradient = () => {
    let position = 0;
    const animate = () => {
      if (!isAnimating) return;
      position = (position + 1) % gradients.length;
      setGradientPosition(position);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Fond animé */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 rounded-lg ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          } ${gradients[gradientPosition]}`}
        />

        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Describe the freelancer you're looking for..."
            className="w-full py-4 px-4 pr-24 text-mono-50 bg-mono-800/90 backdrop-blur-sm border border-mono-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-mono-600 focus:border-transparent placeholder-mono-400 transition-all duration-300"
          />
          <div className="absolute right-3 flex items-center gap-2">
            {onUpload && (
              <button
                type="button"
                onClick={onUpload}
                className="p-2 text-mono-400 hover:text-mono-50 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              className={`p-2 transition-all duration-300 disabled:opacity-50 ${
                query.trim() ? 'text-mono-50 hover:scale-110' : 'text-mono-400'
              }`}
              disabled={!query.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}