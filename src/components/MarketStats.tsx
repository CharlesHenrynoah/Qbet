import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { playHoverSound, stopAllSounds } from '../services/sound';
import type { Freelancer } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MarketStatsProps {
  freelancers: Freelancer[];
}

// Palette de couleurs variées pour les graphiques
const colorThemes = [
  {
    name: 'emerald',
    gradient: ['rgba(16, 185, 129, 0.8)', 'rgba(20, 184, 166, 0.8)'],
    accent: 'rgb(52, 211, 153)',
  },
  {
    name: 'rose',
    gradient: ['rgba(244, 63, 94, 0.8)', 'rgba(236, 72, 153, 0.8)'],
    accent: 'rgb(251, 113, 133)',
  },
  {
    name: 'amber',
    gradient: ['rgba(245, 158, 11, 0.8)', 'rgba(249, 115, 22, 0.8)'],
    accent: 'rgb(251, 191, 36)',
  },
  {
    name: 'violet',
    gradient: ['rgba(139, 92, 246, 0.8)', 'rgba(168, 85, 247, 0.8)'],
    accent: 'rgb(167, 139, 250)',
  },
  {
    name: 'blue',
    gradient: ['rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.8)'],
    accent: 'rgb(96, 165, 250)',
  },
  {
    name: 'fuchsia',
    gradient: ['rgba(217, 70, 239, 0.8)', 'rgba(168, 85, 247, 0.8)'],
    accent: 'rgb(232, 121, 249)',
  },
  {
    name: 'lime',
    gradient: ['rgba(132, 204, 22, 0.8)', 'rgba(34, 197, 94, 0.8)'],
    accent: 'rgb(163, 230, 53)',
  },
  {
    name: 'red',
    gradient: ['rgba(239, 68, 68, 0.8)', 'rgba(244, 63, 94, 0.8)'],
    accent: 'rgb(248, 113, 113)',
  }
];

export function MarketStats({ freelancers }: MarketStatsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
  const [chartThemes] = useState(() => {
    const shuffled = [...colorThemes].sort(() => Math.random() - 0.5);
    return {
      trading: shuffled[0],
      skills: shuffled[1],
      rates: shuffled[2],
    };
  });

  // Animation des statistiques
  useEffect(() => {
    const stats = {
      avgRate: Math.round(freelancers.reduce((sum, f) => sum + f.hourlyRate, 0) / freelancers.length),
      available: freelancers.filter(f => f.availability === 'immediate').length,
      total: freelancers.length
    };

    Object.entries(stats).forEach(([key, target]) => {
      let start = 0;
      const step = Math.ceil(target / 20);
      const interval = setInterval(() => {
        start = Math.min(start + step, target);
        setAnimatedStats(prev => ({ ...prev, [key]: start }));
        if (start >= target) clearInterval(interval);
      }, 50);
    });
  }, [freelancers]);

  // Rotation automatique des slides
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % 3);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const skillDistribution = freelancers.reduce((acc, freelancer) => {
    freelancer.skills.forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skillDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const rateRanges = {
    '< 100€': freelancers.filter(f => f.hourlyRate < 100).length,
    '100-120€': freelancers.filter(f => f.hourlyRate >= 100 && f.hourlyRate < 120).length,
    '120-140€': freelancers.filter(f => f.hourlyRate >= 120 && f.hourlyRate < 140).length,
    '≥ 140€': freelancers.filter(f => f.hourlyRate >= 140).length,
  };

  const tradingData = {
    labels: ['00h', '04h', '08h', '12h', '16h', '20h'],
    datasets: [
      {
        label: 'Tarif moyen',
        data: [115, 120, 118, 125, 122, animatedStats.avgRate || 0],
        borderColor: chartThemes.trading.accent,
        backgroundColor: `rgba(${chartThemes.trading.accent.match(/\d+/g)?.join(', ')}, 0.1)`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const skillsChartData = {
    labels: topSkills.map(([skill]) => skill),
    datasets: [
      {
        label: 'Nombre de freelances',
        data: topSkills.map(([, count]) => count),
        backgroundColor: chartThemes.skills.gradient,
        borderColor: chartThemes.skills.accent,
        borderWidth: 1,
      },
    ],
  };

  const rateChartData = {
    labels: Object.keys(rateRanges),
    datasets: [
      {
        data: Object.values(rateRanges),
        backgroundColor: chartThemes.rates.gradient,
        borderColor: [chartThemes.rates.accent],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            family: "'Orbitron', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Orbitron', sans-serif",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: "'Orbitron', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: "'Orbitron', sans-serif",
          },
        },
      },
    },
  };

  const slides = [
    {
      title: "Évolution des tarifs (24h)",
      component: <Line data={tradingData} options={chartOptions} />,
      theme: chartThemes.trading
    },
    {
      title: "Top 5 des compétences",
      component: <Bar data={skillsChartData} options={chartOptions} />,
      theme: chartThemes.skills
    },
    {
      title: "Distribution des tarifs",
      component: <Doughnut data={rateChartData} options={chartOptions} />,
      theme: chartThemes.rates
    }
  ];

  const stats = [
    {
      title: "Tarif moyen",
      value: animatedStats.avgRate || 0,
      unit: "€/h",
      description: "Moyenne des tarifs horaires",
      theme: colorThemes[0]
    },
    {
      title: "Disponibles",
      value: animatedStats.available || 0,
      unit: "now",
      description: "Freelances disponibles immédiatement",
      theme: colorThemes[1]
    },
    {
      title: "Top skill",
      value: topSkills[0]?.[0] || 'N/A',
      description: "Compétence la plus demandée",
      theme: colorThemes[2]
    },
    {
      title: "Total",
      value: animatedStats.total || 0,
      unit: "pros",
      description: "Nombre total de freelances",
      theme: colorThemes[3]
    }
  ];

  const handleStatHover = (index: number) => {
    if (hoveredStat !== index) {
      setHoveredStat(index);
      playHoverSound();
    }
  };

  const handleStatLeave = () => {
    setHoveredStat(null);
    stopAllSounds();
  };

  const handleSlideChange = (index: number) => {
    if (currentSlide !== index) {
      setIsAnimating(true);
      playHoverSound();
      setTimeout(() => {
        setCurrentSlide(index);
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <div className="bg-mono-800 rounded-lg p-6 space-y-6">
      <div 
        className="relative overflow-hidden rounded-lg bg-mono-900" 
        style={{ height: '400px' }}
        onMouseEnter={() => playHoverSound()}
        onMouseLeave={() => stopAllSounds()}
      >
        <div className="absolute inset-0 p-6">
          <h3 className="text-mono-50 text-lg font-orbitron mb-4">
            {slides[currentSlide].title}
          </h3>
          <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {slides[currentSlide].component}
          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${slides[currentSlide].theme.gradient.join(', ')})`
            }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index 
                ? `w-8 bg-gradient-to-r from-[${slide.theme.gradient[0]}] to-[${slide.theme.gradient[1]}]` 
                : 'bg-mono-600 hover:bg-mono-500'
            }`}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden bg-mono-900 rounded-lg group cursor-pointer transform transition-all duration-300 ${
              hoveredStat === index ? 'scale-105 shadow-xl z-10' : ''
            }`}
            onMouseEnter={() => handleStatHover(index)}
            onMouseLeave={handleStatLeave}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${stat.theme.gradient.join(', ')})`
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" />
            
            <div className="relative z-10 p-6">
              <h4 className="text-mono-400 text-sm font-orbitron mb-2 group-hover:text-mono-200 transition-colors">
                {stat.title}
              </h4>
              <div className="flex items-baseline gap-1">
                <p 
                  className={`font-bold font-orbitron tracking-wider transition-all duration-300 ${
                    typeof stat.value === 'number' ? 'text-3xl' : 'text-2xl'
                  } group-hover:text-4xl`}
                  style={{ color: stat.theme.accent }}
                >
                  {stat.value}
                </p>
                {stat.unit && (
                  <span className="text-mono-400 text-lg font-normal transition-colors group-hover:text-mono-300">
                    {stat.unit}
                  </span>
                )}
              </div>
              
              <div className="absolute inset-x-6 bottom-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-xs text-mono-400">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}