import React, { useState, useEffect } from 'react';
import { CharacterState } from '../types';

interface CharacterGuideProps {
  message: string;
  isVisible: boolean;
  state: CharacterState;
}

// FIX: Export CharacterSVG to be used in other components.
export const CharacterSVG: React.FC<{charState: CharacterState}> = ({ charState }) => (
    <svg id="character-svg" className={`character-${charState}`} width="150" height="150" viewBox="0 0 100 100">
        {/* Sword Handle */}
        <g id="sword-handle">
            <rect x="20" y="55" width="5" height="15" fill="#5A5A5A"/>
            <rect x="18" y="70" width="9" height="3" fill="#3A3A3A"/>
        </g>
        {/* Right Arm (behind body) */}
        <g id="right-arm" style={{ transformOrigin: '25px 50px', transition: 'transform 0.3s ease-out' }}>
            <path d="M25 50 C 20 60, 25 70, 30 70 L 35 65 Z" fill="#333"/>
            <circle cx="33" cy="68" r="5" fill="#F0EAD6"/>
        </g>
        {/* Body */}
        <g id="body">
            <path d="M30 40 L 70 40 L 65 80 L 35 80 Z" fill="#4A4A4A"/>
            <path d="M30 40 L 35 80 L 50 80 L 50 40 Z" fill="#5A5A5A"/>
            <rect x="48" y="40" width="4" height="40" fill="#333"/>
        </g>
        {/* Head */}
        <g id="head" style={{ transformOrigin: '50px 30px', transition: 'transform 0.3s ease-out' }}>
            <circle cx="50" cy="30" r="15" fill="#F0EAD6"/>
            {/* Hair */}
            <path d="M35 20 Q 50 10, 65 20 L 60 35 Q 50 40, 40 35 Z" fill="#E53E3E"/>
            <path d="M45 25 L 47 30" stroke="black" strokeWidth="1"/>
            <path d="M55 25 L 53 30" stroke="black" strokeWidth="1"/>
        </g>
    </svg>
);

export const CharacterGuide: React.FC<CharacterGuideProps> = ({ message, isVisible, state }) => {
  const [typedMessage, setTypedMessage] = useState('');
  
  useEffect(() => {
    if (isVisible && message) {
      setTypedMessage('');
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < message.length) {
          setTypedMessage(prev => prev + message.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 30);
      return () => clearInterval(typingInterval);
    }
  }, [message, isVisible]);

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full transition-opacity duration-300 z-20 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-end space-x-2">
        <CharacterSVG charState={state} />
        <div className="bg-gray-800/80 backdrop-blur-md border border-green-500/30 rounded-lg p-3 shadow-lg min-h-[60px]">
          <p className="text-green-300 font-mono text-sm">
            {typedMessage}
            <span className="animate-pulse">_</span>
          </p>
        </div>
      </div>
    </div>
  );
};
