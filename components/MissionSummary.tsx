
import React from 'react';
import { CharacterSVG } from './CharacterGuide';
import { playSound, SoundEffect } from '../services/soundService';

interface MissionSummaryProps {
  missionTitle: string;
  summary: string;
  onFinish: () => void;
}

export const MissionSummary: React.FC<MissionSummaryProps> = ({ missionTitle, summary, onFinish }) => {
  const handleFinish = () => {
    playSound(SoundEffect.ButtonClick);
    onFinish();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in-up -mt-20">
      <div className="bg-gray-800 border border-yellow-500/50 rounded-lg shadow-2xl shadow-yellow-500/10 w-full max-w-3xl text-center p-8">
        <div className="flex justify-center mb-4 transform scale-125">
            <CharacterSVG charState="success" />
        </div>
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">Missão Concluída!</h1>
        <h2 className="text-xl text-white mb-6">{missionTitle}</h2>
        
        <div className="text-left bg-gray-900/50 p-6 rounded-md border border-gray-700 mb-8">
            <p className="whitespace-pre-wrap text-gray-300">{summary || "Carregando resumo..."}</p>
        </div>
        
        <button
          onClick={handleFinish}
          className="px-8 py-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 animate-pulse-strong"
        >
          Finalizar e Avançar
        </button>
      </div>
    </div>
  );
};