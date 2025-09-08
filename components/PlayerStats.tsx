import React, { useState, useEffect } from 'react';
import { PlayerStats as PlayerStatsType } from '../types';

interface PlayerStatsProps {
  stats: PlayerStatsType;
  levelUpScore: number;
  onChangeCourse: () => void;
}

const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.598 18.501 18.501 0 0 1-4.49-3.46c-1.933-2.11-3.17-4.423-3.17-7.11C2.565 5.406 5.405 2.565 9 2.565c1.944 0 3.766.822 5.034 2.186C15.297 3.387 17.118 2.565 19 2.565c3.595 0 6.435 2.84 6.435 6.345 0 2.686-1.237 5-3.17 7.11a18.495 18.495 0 0 1-4.49 3.46 15.21 15.21 0 0 1-1.383.598l-.022.012-.007.004-.004.001a.752.752 0 0 1-.67-.006Z" />
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
  const progressPercentage = Math.min(100, (scoreForCurrentLevel / 500) * 100);

  const [isScoreUpdating, setIsScoreUpdating] = useState(false);
  const [prevLevel, setPrevLevel] = useState(stats.level);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  useEffect(() => {
    if (stats.score > 0) {
      setIsScoreUpdating(true);
      const timer = setTimeout(() => setIsScoreUpdating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [stats.score]);

  useEffect(() => {
      if (stats.level > prevLevel) {
          setIsLevelingUp(true);
          const timer = setTimeout(() => setIsLevelingUp(false), 1200);
          setPrevLevel(stats.level);
          return () => clearTimeout(timer);
      }
  }, [stats.level, prevLevel]);

  return (
    <div className="fixed top-4 right-4 z-20 bg-gray-900/70 backdrop-blur-sm border border-yellow-500/30 p-1.5 rounded-xl shadow-lg animate-fade-in w-52">
      {/* Top Row: Level and Character Info */}
      <div className="flex items-center gap-2">
          <div className={`relative flex-shrink-0 w-10 h-10 flex flex-col items-center justify-center rounded-full bg-gray-800 border-2 border-yellow-500 ${isLevelingUp ? 'animate-level-up' : ''}`}>
              <span className="text-[8px] text-yellow-400 -mb-1">NÍVEL</span>
              <span className="text-lg font-bold text-white">{stats.level}</span>
          </div>
          <div className="flex-grow">
              <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Herói do Código</h3>
                  <button 
                      onClick={onChangeCourse} 
                      title="Trocar de Curso"
                      className="p-1 text-gray-400 hover:text-yellow-400 transition-colors duration-200 rounded-full hover:bg-gray-700/50"
                  >
                      <ChangeCourseIcon />
                  </button>
              </div>
              <div className="flex items-center gap-1 mt-1">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className={`transition-all duration-300 ${i < stats.lives ? 'opacity-100 animate-heart-pulse' : 'opacity-20'}`}>
                          <HeartIcon />
                      </div>
                  ))}
              </div>
          </div>
      </div>
      {/* Bottom Row: XP */}
      <div className="mt-1.5">
          <div className="flex justify-between items-end text-[9px] text-gray-400 mb-0.5">
              <span className="font-semibold">Progresso</span>
              <span className={`${isScoreUpdating ? 'animate-scoreUpdate' : ''}`}><span className="font-bold text-white">{scoreForCurrentLevel}</span> / 500 XP</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 border border-black/20">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-center" style={{ width: `${progressPercentage}%` }}>
                 {progressPercentage > 20 && <span className="text-[8px] font-bold text-gray-900">{Math.round(progressPercentage)}%</span>}
              </div>
          </div>
      </div>
    </div>
  );
};