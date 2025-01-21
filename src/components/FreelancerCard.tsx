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
    accent: 'text-emerald-400',
    border: 'hover:border-emerald-400',
    shadow: 'hover:shadow-emerald-500/30',
  },
  {
    name: 'rose',
    accent: 'text-rose-400',
    border: 'hover:border-rose-400',
    shadow: 'hover:shadow-rose-500/30',
  },
  {
    name: 'amber',
    accent: 'text-amber-400',
    border: 'hover:border-amber-400',
    shadow: 'hover:shadow-amber-500/30',
  },
  {
    name: 'violet',
    accent: 'text-violet-400',
    border: 'hover:border-violet-400',
    shadow: 'hover:shadow-violet-500/30',
  },
  {
    name: 'blue',
    accent: 'text-blue-400',
    border: 'hover:border-blue-400',
    shadow: 'hover:shadow-blue-500/30',
  },
  {
    name: 'fuchsia',
    accent: 'text-fuchsia-400',
    border: 'hover:border-fuchsia-400',
    shadow: 'hover:shadow-fuchsia-500/30',
  },
  {
    name: 'lime',
    accent: 'text-lime-400',
    border: 'hover:border-lime-400',
    shadow: 'hover:shadow-lime-500/30',
  },
  {
    name: 'red',
    accent: 'text-red-400',
    border: 'hover:border-red-400',
    shadow: 'hover:shadow-red-500/30',
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
      className={`relative overflow-hidden bg-mono-800 rounded-lg p-4 group cursor-pointer 
      transform transition-all duration-300 
      hover:scale-[1.03] hover:-translate-y-1
      border-2 border-mono-700 ${theme.border}
      shadow-lg ${theme.shadow}
      hover:shadow-xl hover:shadow-2xl`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className="relative">
          <img
            src={freelancer.avatar}
            alt={freelancer.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-mono-50 transition-transform duration-300 group-hover:scale-110"
          />
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