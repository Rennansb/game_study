import React, { useState, useEffect } from 'react';
import { PlayerStats as PlayerStatsType } from '../types';

interface PlayerStatsProps {
  stats: PlayerStatsType;
  levelUpScore: number;
  onChangeCourse: () => void;
}

const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.598 18.501 18.501 0 0 1-4.49-3.46c-1.933-2.11-3.17-4.423-3.17-7.11C2.565 5.406 5.405 2.565 9 2.565c1.944 0 3.766.822 5.034 2.186C15.297 3.387 17.118 2.565 19 2.565c3.595 0 6.435 2.84 6.435 6.345 0 2.686-1.237 5-3.17 7.11a18.495 18.495 0 0 1-4.49 3.46 15.21 15.21 0 0 1-1.383.598l-.022.012-.007.004-.004.001a.752.752 0 0 1-.67-.006Z" />
    </svg>
);

const ScoreIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
);

const ChangeCourseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.204 2.772l.143-.091a.75.75 0 0 1 .99 1.125l-.143.091a7 7 0 0 0 11.72-3.541l.12-.121a.75.75 0 0 0-1.06-1.06l-.12.121a5.5 5.5 0 0 1-2.446 1.252Zm-10.624-2.848a5.5 5.5 0 0 1 9.204-2.772l-.143.091a.75.75 0 1 1-.99-1.125l.143-.091a7 7 0 0 0-11.72 3.541l-.12.121a.75.75 0 1 0 1.06 1.06l.12-.121a5.5 5.5 0 0 1 2.446-1.252Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M8.25 10a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Zm2.25.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z" clipRule="evenodd" />
    </svg>
);


export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats, levelUpScore, onChangeCourse }) => {
  const scoreForCurrentLevel = stats.score - ((stats.level - 1) * 500);
  const progressPercentage = levelUpScore > 0 ? Math.max(0, (scoreForCurrentLevel / 500) * 100) : 100;
  
  const [isScoreUpdating, setIsScoreUpdating] = useState(false);

  useEffect(() => {
    if (stats.score > 0) {
      setIsScoreUpdating(true);
      const timer = setTimeout(() => setIsScoreUpdating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [stats.score]);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="fixed top-4 left-4 z-20 bg-gray-900/70 backdrop-blur-sm border border-yellow-500/30 p-3 rounded-xl shadow-lg flex items-center gap-4 animate-fade-in">
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 70 70">
                <circle className="text-gray-700/50" strokeWidth="5" stroke="currentColor" fill="transparent" r={radius} cx="35" cy="35"/>
                <circle
                    className="progress-ring__circle text-yellow-400"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="35"
                    cy="35"
                />
            </svg>
            <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-yellow-400">NÍVEL</span>
                <span className="text-3xl font-bold text-white -mt-1">{stats.level}</span>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <ScoreIcon />
                <span className={`text-xl font-bold text-white ${isScoreUpdating ? 'animate-scoreUpdate' : ''}`}>{stats.score}</span>
            </div>
            <div className="flex items-center gap-2">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className={`transition-all duration-300 ${i < stats.lives ? 'opacity-100' : 'opacity-20'}`}>
                        <HeartIcon />
                    </div>
                ))}
            </div>
        </div>
        <div className="self-start">
            <button 
                onClick={onChangeCourse} 
                title="Trocar de Curso"
                className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors duration-200 rounded-full hover:bg-gray-700/50"
            >
                <ChangeCourseIcon />
            </button>
        </div>
    </div>
  );
};