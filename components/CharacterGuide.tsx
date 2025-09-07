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
        width="80" 
        height="80" 
        viewBox="0 0 80 80"
    >
      <defs>
          <pattern id="checker" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" fill="#059669" />
            <rect x="4" y="0" width="4" height="4" fill="#1f2937" />
            <rect x="0" y="4" width="4" height="4" fill="#1f2937" />
            <rect x="4" y="4" width="4" height="4" fill="#059669" />
          </pattern>
      </defs>
      <g id="main-group" transform="translate(0, 5)">
          {/* -- Sword -- */}
          <g id="sword" transform="translate(10, -5) rotate(15 50 40)">
              <line x1="60" y1="20" x2="60" y2="55" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
              <rect x="56" y="55" width="8" height="3" fill="#4b5563" rx="1.5" />
          </g>

          {/* -- Legs -- */}
          <g id="legs" style={{transformOrigin: '40px 60px'}}>
              <g id="right-leg" style={{transformOrigin: '45px 60px'}}>
                  <path d="M 45 60 L 48 72" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 48 72 L 52 75" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 52 75 L 54 78" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g id="left-leg" style={{transformOrigin: '35px 60px'}}>
                  <path d="M 35 60 L 32 72" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 32 72 L 28 75" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 28 75 L 26 78" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
              </g>
          </g>

          {/* -- Body and Arms -- */}
          <g id="body-and-arms" style={{transformOrigin: '40px 45px'}}>
              <g id="body">
                  {/* -- Haori (Checkered Coat) -- */}
                  <path d="M 20 40 L 20 65 L 60 65 L 60 40 C 55 35, 25 35, 20 40 Z" fill="url(#checker)" />
                  <path d="M 20 40 L 20 65 L 60 65 L 60 40 C 55 35, 25 35, 20 40 Z" fill="none" stroke="#101827" strokeWidth="1" />
                  
                  {/* -- Arms -- */}
                  <g id="right-arm" style={{transformOrigin: '58px 42px'}}>
                    <path d="M 58 42 C 62 48, 62 55, 62 55" stroke="url(#checker)" strokeWidth="10" strokeLinecap="round" />
                    <g id="default-hand"><circle cx="63" cy="58" r="4" fill="#fecaca"/></g>
                    <g id="thumbs-up">
                        <path d="M 60 55 C 58 52, 58 52, 60 50 L 64 48 C 66 49, 66 49, 65 52 L 68 59 C 68 62, 65 62, 62 61 Z" fill="#fecaca" />
                        <path d="M 60 50 L 64 48" stroke="#991b1b" strokeWidth="0.5" fill="none" />
                    </g>
                  </g>
                  <path id="left-arm" d="M 22 42 C 15 50, 15 58, 15 58" stroke="url(#checker)" strokeWidth="10" strokeLinecap="round" style={{transformOrigin: '22px 42px'}}/>
                  
                  {/* -- Under Clothes & Belt -- */}
                  <rect x="30" y="38" width="20" height="25" fill="#4b5563" />
                  <rect x="28" y="50" width="24" height="6" fill="#e5e7eb" stroke="#374151" strokeWidth="1" rx="2" />
              </g>
          </g>

          {/* -- Head -- */}
          <g id="head" style={{transformOrigin: '40px 30px'}}>
              {/* -- Earrings -- */}
              <rect x="23" y="32" width="2" height="8" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1" rx="1" />
              <rect x="55" y="32" width="2" height="8" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1" rx="1" />

              {/* -- Face -- */}
              <circle cx="40" cy="30" r="16" fill="#fecaca"/>
              <circle cx="40" cy="30" r="16" fill="none" stroke="#991b1b" strokeWidth="0.5" />
              <path id="scar" d="M 28 20 Q 33 16, 35 21 Q 30 19 28 20" fill="#b91c1c" opacity="0.9"/>
              
              {/* -- Hair -- */}
              <path id="hair" d=" M 20 35 C 15 10, 65 10, 60 35 C 65 20, 50 12, 40 12 C 30 12, 15 20, 20 35 M 25 18 C 35 5, 45 5, 40 18 M 55 18 C 45 5, 35 5, 40 18" fill="#450a0a" />
              
              <g id="face">
                  <g id="eyes" style={{ transformOrigin: '40px 30px' }}>
                    <g id="left-eye" style={{ transformOrigin: '35px 30px' }}>
                        <path d="M 32 30 C 34 27, 37 27, 39 30" stroke="#44403c" fill="none" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="35.5" cy="30" r="1" fill="#450a0a" />
                    </g>
                    <g id="right-eye" style={{ transformOrigin: '45px 30px' }}>
                        <path d="M 42 30 C 44 27, 47 27, 49 30" stroke="#44403c" fill="none" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="45.5" cy="30" r="1" fill="#450a0a" />
                    </g>
                  </g>
                  <path id="mouth" d="M 37 38 Q 40 40, 43 38" stroke="#44403c" strokeWidth="1.5" strokeLinecap="round" fill="none" style={{transformOrigin: '40px 38px'}} />
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