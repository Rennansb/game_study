import React, { useState, useEffect } from 'react';
import { PlayerStats as PlayerStatsType } from '../types';

interface PlayerStatsProps {
  stats: PlayerStatsType;
  levelUpScore: number | null;
}

// FIX: Added `children: React.ReactNode` to the props type to allow child elements.
const StatBox: React.FC<{ label: string; className?: string; isUpdating?: boolean; children: React.ReactNode }> = ({ label, children, className, isUpdating = false }) => (
  <div className={`bg-gray-800 border border-green-500/30 rounded-md p-3 text-center transition-shadow duration-300 shadow-md hover:shadow-green-500/20 ${className}`}>
    <div className="text-xs text-green-400 uppercase tracking-widest">{label}</div>
    <div className={`text-2xl font-bold text-white transition-all duration-300 ${isUpdating ? 'animate-scoreUpdate' : ''}`}>{children}</div>
  </div>
);

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 transition-all duration-300 ${filled ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.598 18.501 18.501 0 0 1-4.49-3.46c-1.933-2.11-3.17-4.423-3.17-7.11C2.565 5.406 5.405 2.565 9 2.565c1.944 0 3.766.822 5.034 2.186C15.297 3.387 17.118 2.565 19 2.565c3.595 0 6.435 2.84 6.435 6.345 0 2.686-1.237 5-3.17 7.11a18.495 18.495 0 0 1-4.49 3.46 15.21 15.21 0 0 1-1.383.598l-.022.012-.007.004-.004.001a.752.752 0 0 1-.67-.006Z" />
    </svg>
);


export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats, levelUpScore }) => {
  const scoreToNextLevel = levelUpScore ? levelUpScore - stats.score : 0;
  const progressPercentage = levelUpScore ? Math.max(0, (stats.score / levelUpScore) * 100) : 100;

  const [isScoreUpdating, setIsScoreUpdating] = useState(false);

  useEffect(() => {
    // Prevent animation on initial load
    if (stats.score > 0) {
      setIsScoreUpdating(true);
      const timer = setTimeout(() => setIsScoreUpdating(false), 600); // duration of animation
      return () => clearTimeout(timer);
    }
  }, [stats.score]);


  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-green-500/30 p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-green-400">./MissaoEstudo</h1>
        <div className="grid grid-cols-3 gap-4">
          <StatBox label="Nível">{stats.level}</StatBox>
          <StatBox label="Pontos" isUpdating={isScoreUpdating}>{stats.score}</StatBox>
          <StatBox label="Vidas">
            <div className="flex justify-center items-center h-full gap-1">
              {[...Array(3)].map((_, i) => <HeartIcon key={i} filled={i < stats.lives} />)}
            </div>
          </StatBox>
        </div>
      </div>
       {levelUpScore !== null && levelUpScore > 0 && (
         <div className="max-w-7xl mx-auto mt-3">
          <div className="text-xs text-center mb-1 text-gray-400">
            Próximo Nível: {scoreToNextLevel > 0 ? `Faltam ${scoreToNextLevel} pts` : 'Nível Máximo Atingido!'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};