import React, { useState } from 'react';
import { Star, ExternalLink, Clock, MapPin, Paperclip } from 'lucide-react';
import { playHoverSound, stopAllSounds } from '../services/sound';
import type { Freelancer } from '../types';

interface FreelancerCardProps {
  freelancer: Freelancer;
  searchTerms?: string[];
}

// Palette de couleurs variées pour les cartes
const colorThemes = [
  {
    name: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    accent: 'text-emerald-400',
    hover: 'hover:shadow-emerald-500/20',
  },
  {
    name: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    accent: 'text-rose-400',
    hover: 'hover:shadow-rose-500/20',
  },
  {
    name: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    accent: 'text-amber-400',
    hover: 'hover:shadow-amber-500/20',
  },
  {
    name: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    accent: 'text-violet-400',
    hover: 'hover:shadow-violet-500/20',
  },
  {
    name: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    accent: 'text-blue-400',
    hover: 'hover:shadow-blue-500/20',
  },
  {
    name: 'fuchsia',
    gradient: 'from-fuchsia-500 to-purple-500',
    accent: 'text-fuchsia-400',
    hover: 'hover:shadow-fuchsia-500/20',
  },
  {
    name: 'lime',
    gradient: 'from-lime-500 to-green-500',
    accent: 'text-lime-400',
    hover: 'hover:shadow-lime-500/20',
  },
  {
    name: 'red',
    gradient: 'from-red-500 to-rose-500',
    accent: 'text-red-400',
    hover: 'hover:shadow-red-500/20',
  }
];

export function FreelancerCard({ freelancer, searchTerms = [] }: FreelancerCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [theme] = useState(() => colorThemes[Math.floor(Math.random() * colorThemes.length)]);

  const availabilityColor = {
    immediate: 'text-mono-900 bg-mono-50',
    within_week: 'text-mono-900 bg-mono-200',
    within_month: 'text-mono-900 bg-mono-300',
  }[freelancer.availability];

  const availabilityText = {
    immediate: 'Disponible immédiatement',
    within_week: 'Disponible sous 1 semaine',
    within_month: 'Disponible sous 1 mois',
  }[freelancer.availability];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopAllSounds();
  };

  return (
    <div
      className={`relative overflow-hidden bg-mono-800 rounded-lg shadow-lg border border-mono-700 p-4 group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme.hover}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient de fond animé */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} transition-opacity duration-500 ${isHovered ? 'opacity-10' : 'opacity-0'}`} />
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="relative">
          <img
            src={freelancer.avatar}
            alt={freelancer.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-mono-50 transition-transform duration-300 group-hover:scale-110"
          />
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-orbitron text-mono-50 transition-all duration-300 group-hover:text-lg ${theme.accent}`}>
              {freelancer.name}
            </h3>
            <span className="flex items-center text-sm font-medium text-mono-300 transition-colors duration-300 group-hover:text-mono-50">
              <Star className={`w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110 ${theme.accent}`} />
              {freelancer.rating.toFixed(1)}
            </span>
          </div>
          
          <div className="mt-1 flex items-center gap-2 text-sm text-mono-300">
            <MapPin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            {freelancer.location}
          </div>

          <p className="mt-3 text-sm text-mono-200 leading-relaxed transition-colors duration-300 group-hover:text-mono-50">
            {freelancer.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {freelancer.skills.map((skill) => (
              <span
                key={skill}
                className={`px-2 py-0.5 rounded-full text-sm transition-all duration-300 ${
                  searchTerms.includes(skill.toLowerCase())
                    ? 'bg-mono-50 text-mono-900 group-hover:scale-105'
                    : 'bg-mono-900 text-mono-300 group-hover:bg-mono-700 group-hover:text-mono-50'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>

          {freelancer.attachments && freelancer.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-sm font-medium text-mono-200 flex items-center gap-1 transition-colors duration-300 group-hover:text-mono-50">
                <Paperclip className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                Pièces jointes
              </div>
              {freelancer.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-mono-300 hover:text-mono-50 transition-all duration-300 group-hover:translate-x-1"
                >
                  <span className="truncate">{attachment.name}</span>
                  <span className="text-mono-400">({formatFileSize(attachment.size)})</span>
                </a>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-base font-semibold transition-all duration-300 group-hover:text-lg group-hover:tracking-wide ${theme.accent}`}>
                {freelancer.hourlyRate}€/h
              </span>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-transform duration-300 group-hover:scale-105 ${availabilityColor}`}>
                <Clock className="w-3 h-3" />
                {availabilityText}
              </span>
            </div>
            
            <button className={`flex items-center gap-1 px-3 py-1.5 bg-mono-50 text-mono-900 rounded-lg transition-all duration-300 hover:bg-mono-200 group-hover:scale-105 group-hover:shadow-lg`}>
              <ExternalLink className="w-3 h-3" />
              <span className="font-orbitron">Voir profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}