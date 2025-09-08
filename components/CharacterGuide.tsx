import React, { useState, useEffect } from 'react';
import { CharacterState } from '../types';

interface CharacterGuideProps {
  message: string;
  isVisible: boolean;
  state: CharacterState;
}

export const CharacterSVG: React.FC<{charState: CharacterState, className?: string}> = ({ charState, className }) => (
    <svg 
        id="character-svg" 
        className={`character-${charState} ${className ?? ''}`} 
        width={80} 
        height={80} 
        viewBox="0 0 80 80"
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g id="main-group" style={{ transformOrigin: '40px 70px' }} filter="url(#shadow)">
          {/* Right Leg */}
          <g id="right-leg" style={{ transformOrigin: '50px 58px' }}>
              <path d="M 48,58 C 46,65 48,72 48,72 L 54,72 C 54,72 56,65 54,58 Z" fill="#374151"/>
              <path d="M 48,72 L 54,72 L 56,76 L 46,76 Z" fill="#94a3b8" />
          </g>
          {/* Left Leg */}
          <g id="left-leg" style={{ transformOrigin: '38px 58px' }}>
              <path d="M 36,58 C 34,65 36,72 36,72 L 42,72 C 42,72 44,65 42,58 Z" fill="#374151"/>
              <path d="M 36,72 L 42,72 L 44,76 L 34,76 Z" fill="#94a3b8" />
          </g>
          {/* Right Arm */}
          <g id="right-arm-group" style={{ transformOrigin: '55px 45px' }}>
              <path d="M 52,45 C 58,48 58,58 58,58 L 54,60 C 54,60 54,50 50,47 Z" fill="#374151" />
              <path d="M 55,59 A 4 4 0 0 1 55 67 A 4 4 0 0 1 55 59" fill="#e2e8f0" />
          </g>
          {/* Torso */}
          <path id="torso" d="M 35,40 L 53,40 L 55,58 L 33,58 Z" fill="#475569" />
          <path d="M 35,40 L 53,40 L 50,45 L 38,45 Z" fill="#e2e8f0" />
          <path d="M 33,56 L 55,56 L 54,60 L 34,60 Z" fill="#ca8a04" />

          {/* Sword Arm Group */}
          <g id="sword-arm-group" style={{ transformOrigin: '35px 45px' }}>
            {/* Sword */}
            <g id="sword" transform="translate(0 3)">
                {/* Blade */}
                <path d="M 25,50 L 25,25" stroke="#64748b" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 25,27 L 25,22" stroke="#e2e8f0" strokeWidth="1" strokeLinecap="round"/>
                {/* Guard */}
                <path d="M 19,48 H 31" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                {/* Hilt */}
                <path d="M 25,50 L 25,55" stroke="#4a3f35" strokeWidth="3" strokeLinecap="round" />
                {/* Pommel */}
                <circle cx="25" cy="57" r="2.5" fill="#ca8a04" />
            </g>
            {/* Left Arm (Bicep -> Forearm -> Hand) */}
            <g id="left-arm">
                {/* Bicep */}
                <path d="M 35,45 C 37,50 36,54 34,56 L 31,54 C 33,52 33,48 35,45 Z" fill="#374151" stroke="#1f2937" strokeWidth="0.5"/>
                {/* Forearm */}
                <path d="M 31,54 C 32,58 29,62 27,62 L 25,59 C 27,58 29,56 31,54 Z" fill="#374151" stroke="#1f2937" strokeWidth="0.5"/>
                {/* Hand (Fist) - drawn over the sword hilt */}
                <g id="left-hand" transform="translate(0, -1)">
                     <path d="M 23,52 C 21,52 20,53 20,55 C 20,57 21,58 23,58 L 29,58 C 31,58 32,57 32,55 C 32,53 31,52 29,52 Z" fill="#e2e8f0" stroke="#4b5563" strokeWidth="0.5" />
                     <path d="M 22,52 C 20,51 20,49 22,48 C 24,47 26,48 26,50 Z" fill="#e2e8f0" stroke="#4b5563" strokeWidth="0.5" />
                </g>
                {/* Shoulder Plate */}
                <circle cx="35" cy="45" r="5" fill="#94a3b8" />
            </g>
          </g>

          {/* Head */}
          <g id="head" style={{ transformOrigin: '44px 35px' }}>
              <path d="M 32 25 C 25 35, 28 48, 44 48 C 60 48, 63 35, 56 25 C 50 18, 38 18, 32 25 Z" fill="#fecaca" />
              
              {/* Eyes */}
              <g id="eyes" clipPath="url(#face-clip)">
                 <g id="eyelids" style={{transformOrigin: 'center'}}>
                    <path d="M 36 32 C 38 29, 42 29, 44 32" fill="white" stroke="#6b7280" strokeWidth="0.5"/>
                    <path d="M 46 32 C 48 29, 52 29, 54 32" fill="white" stroke="#6b7280" strokeWidth="0.5"/>
                 </g>
                 <g id="pupils" style={{transformOrigin: 'center'}}>
                    <circle cx="40" cy="32" r="2.5" fill="#3b82f6" />
                    <circle cx="50" cy="32" r="2.5" fill="#3b82f6" />
                    <circle cx="40.5" cy="31.5" r="1" fill="black" />
                    <circle cx="50.5" cy="31.5" r="1" fill="black" />
                 </g>
              </g>

               {/* Eyebrows */}
               <path d="M 35,28 C 38,27 42,27 44,28" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round"/>
               <path d="M 46,28 C 49,27 53,27 55,28" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round"/>

              {/* Nose */}
              <path id="nose" d="M 44,35 Q 45,38 46,38" stroke="#000000" strokeOpacity="0.3" strokeWidth="1" fill="none" strokeLinecap="round" />

              {/* Mouth */}
              <g id="mouth" style={{transition: 'opacity 0.2s ease-in-out'}}>
                 <path id="mouth-serious" d="M 42 42 Q 44 43 46 42" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" style={{transformOrigin: 'center'}}/>
                 <path id="mouth-smile" d="M 41 41 Q 44 44 47 41" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" style={{opacity: 0}} />
              </g>
              
              {/* Hair */}
              <g id="hair" fill="#111827">
                <path d="M 28,32 C 18,18 45,10 50,22 C 55,10 70,18 62,32" />
                <path d="M 30,22 C 35,15 45,15 50,22 L 45,20 L 40,20 Z" />
                <path d="M 40,15 C 42,10 48,10 50,15 Z" />
                <path d="M 28 32 C 30 35, 32 32, 35 30" />
                <path d="M 62 32 C 60 35, 58 32, 55 30" />
              </g>
          </g>
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
    <div className={`fixed bottom-4 right-4 max-w-sm w-full transition-opacity duration-300 z-50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-end space-x-2">
        <CharacterSVG charState={state} className="flex-shrink-0" />
        <div className="bg-gray-800/80 backdrop-blur-md border border-yellow-500/30 rounded-lg p-3 shadow-lg min-h-[60px]">
          <p className="text-yellow-300 font-mono text-sm">
            {typedMessage}
            <span className="animate-pulse">_</span>
          </p>
        </div>
      </div>
    </div>
  );
};