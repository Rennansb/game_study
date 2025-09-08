
import React, { useRef, useState } from 'react';
import { CharacterState } from '../types';
import { CharacterSVG } from './CharacterGuide';
import { playSound, SoundEffect } from '../services/soundService';

interface WelcomeScreenProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFilesSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [charState, setCharState] = useState<CharacterState>('idle');

  const handleFolderSelectClick = () => {
    if (isLoading) return;
    playSound(SoundEffect.ButtonClick);
    setCharState('salute');
    fileInputRef.current?.click();
    // Reset state after a bit, in case user cancels file selection
    setTimeout(() => setCharState('idle'), 1500);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      setCharState('idle'); // User cancelled
      return;
    }
    onFilesSelected(Array.from(selectedFiles));
  };

  React.useEffect(() => {
      if (isLoading) {
          setCharState('thinking');
      }
  }, [isLoading]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full overflow-hidden animate-fade-in text-center">
        {/* Background Scene */}
        <div className="absolute inset-0 z-0">
            <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800" className="opacity-80">
                <defs>
                    <radialGradient id="skyGradient" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="100%" stopColor="#111827" />
                    </radialGradient>
                </defs>
                <rect width="1200" height="800" fill="url(#skyGradient)" />
                {/* Stars */}
                {[...Array(150)].map((_, i) => (
                    <circle 
                        key={i}
                        cx={Math.random() * 1200} 
                        cy={Math.random() * 600} 
                        r={Math.random() * 1.5 + 0.5} 
                        fill="white" 
                        className="star"
                        style={{animationDelay: `${Math.random() * 4}s`}}
                    />
                ))}
                {/* Mountains */}
                <path d="M -100 800 L 300 400 L 700 800 Z" fill="#1e293b" />
                <path d="M 500 800 L 900 350 L 1300 800 Z" fill="#1e293b" opacity="0.8" />
            </svg>
        </div>
        
        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-7xl font-medieval text-yellow-300 drop-shadow-[0_2px_5px_rgba(250,204,21,0.5)] animate-glow">
                Study Journey
            </h1>
            <p className="text-gray-300 text-lg mt-4 mb-8">Sua aventura épica para a maestria do código começa agora.</p>

            <div className="relative w-80 h-48 mt-12">
                 <div className="absolute bottom-[70%] left-1/2 -translate-x-1/2 w-48 h-48">
                    <CharacterSVG charState={charState} className="w-full h-full drop-shadow-lg" />
                 </div>

                {/* Stone Pedestal Button */}
                <button onClick={handleFolderSelectClick} disabled={isLoading} className="absolute inset-0 start-stone group">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                        <path d="M 10 30 L 190 30 L 200 100 L 0 100 Z" fill="#4b5563"/>
                        <path d="M 10 30 C 10 -10, 190 -10, 190 30 L 170 30 C 170 10, 30 10, 30 30 Z" fill="#6b7280" stroke="#374151" strokeWidth="2"/>
                        <text x="100" y="70" textAnchor="middle" className="fill-yellow-200 font-bold text-2xl group-hover:fill-white transition-colors">
                             {isLoading ? 'Analisando...' : 'Iniciar Jornada'}
                        </text>
                    </svg>
                </button>
            </div>
             <p className="text-gray-400 mt-8 text-sm max-w-lg">
                Selecione a pasta raiz contendo suas jornadas. A estrutura ideal é: <strong className="text-yellow-400">Jornada/Missão/Tarefa.ext</strong>
            </p>
        </div>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
            {...{ webkitdirectory: "", directory: "", multiple: true }}
        />
    </div>
  );
};