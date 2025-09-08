
import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { Journey, Mission, CharacterState } from '../types';
import { CharacterSVG } from './CharacterGuide';
import { playSound, SoundEffect } from '../services/soundService';

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-gray-400"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-300"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg>;

// --- Castle Decoration Components ---
const Guard: React.FC<{ status: 'idle' | 'defeated', index: number }> = ({ status, index }) => {
    const animationClass = useMemo(() => `guard-idle-${(index % 10) + 1}`, [index]);

    if (status === 'defeated') {
        return (
            <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-md guard-defeated">
                <g transform="translate(30, 35) rotate(-80)">
                    {/* Fallen spear */}
                    <path d="M 5 -30 V 25" stroke="#4a3f35" strokeWidth="3" transform="rotate(15)" />
                    <path d="M 5 -30 L 2 -22 L 5 -26 L 8 -22 Z" fill="#a1a1aa" stroke="#4a3f35" strokeWidth="1" transform="rotate(15)" />
                    
                    {/* Fallen body parts */}
                    <g transform="translate(0, 10)">
                        <path className="guard-torso" d="M -10 0 L 10 0 L 12 20 L -12 20 Z" fill="#71717a" transform="rotate(20)"/>
                        <path className="guard-helmet" d="M -15 -10 C -15 -25, 15 -25, 15 -10 L -15 -10 Z" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="2" transform="translate(10, -5) rotate(-30)" />
                        <path className="guard-left-leg" d="M -12 20 L -15 35" stroke="#52525b" strokeWidth="8" strokeLinecap="round" transform="rotate(10)"/>
                        <path className="guard-right-leg" d="M 12 20 L 15 35" stroke="#52525b" strokeWidth="8" strokeLinecap="round" transform="rotate(-10)"/>
                    </g>
                </g>
            </svg>
        );
    }

    return (
        <svg width="40" height="60" viewBox="0 0 40 60" className={`drop-shadow-md ${animationClass}`}>
            <g>
                {/* Spear */}
                <g className="guard-spear" style={{transformOrigin: '20px 58px'}}>
                    <path d="M 28 0 V 58" stroke="#4a3f35" strokeWidth="3" />
                    <path d="M 28 0 L 25 8 L 28 4 L 31 8 Z" fill="#a1a1aa" stroke="#4a3f35" strokeWidth="1" />
                </g>
                
                {/* Body */}
                <g className="guard-body-group">
                    <g className="guard-legs">
                        <path className="guard-left-leg" d="M 14 42 L 12 56" stroke="#52525b" strokeWidth="8" strokeLinecap="round" style={{transformOrigin: '14px 42px'}}/>
                        <path className="guard-right-leg" d="M 20 42 L 22 56" stroke="#52525b" strokeWidth="8" strokeLinecap="round" style={{transformOrigin: '20px 42px'}}/>
                    </g>
                    <g className="guard-arms">
                        <path className="guard-left-arm" d="M 10 28 L 8 40" stroke="#71717a" strokeWidth="7" strokeLinecap="round" />
                        <path className="guard-right-arm" d="M 24 28 L 26 40" stroke="#71717a" strokeWidth="7" strokeLinecap="round" style={{transformOrigin: '24px 28px'}} />
                    </g>
                    <path className="guard-torso" d="M 10 25 L 24 25 L 26 42 L 8 42 Z" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="1.5" style={{transformOrigin: 'center'}} />

                    <g className="guard-head" style={{transformOrigin: '17px 20px'}}>
                        <path className="guard-helmet" d="M 5 10 C 5 -5, 30 -5, 30 10 L 25 25 L 10 25 Z" fill="#8b8b92" stroke="#3f3f46" strokeWidth="2" />
                        <rect x="10" y="18" width="15" height="7" fill="#27272a" />
                        <circle cx="14" cy="21" r="1" fill="#f59e0b" />
                        <circle cx="21" cy="21" r="1" fill="#f59e0b" />
                    </g>
                </g>
            </g>
        </svg>
    );
};


const Torch: React.FC<{className?: string}> = ({ className }) => (
    <div className={`w-16 h-24 ${className} torch-glow`}>
        <svg viewBox="0 0 40 60" className="w-full h-full">
            <g transform="translate(0,0) scale(0.8)">
                <path d="M 15 60 V 40 L 10 35 H 30 L 25 40 V 60 Z" fill="#3f3f46" />
                <path d="M 10 35 L 15 25 H 25 L 30 35 Z" fill="#6b5a4d" stroke="#4a3f35" strokeWidth="2" />
                <g className="torch-flame" transform="translate(20, 25)">
                    <path d="M 0 0 C -10 -15, 10 -15, 0 0 Z" fill="#f59e0b" transform="scale(1.1)" />
                    <path d="M 0 0 C -6 -12, 6 -12, 0 0 Z" fill="#facc15" />
                    <path d="M 0 0 C -3 -8, 3 -8, 0 0 Z" fill="#fef3c7" />
                </g>
            </g>
        </svg>
    </div>
);

const Banner: React.FC<{className?: string}> = ({ className }) => (
    <div className={`w-20 h-32 ${className}`}>
        <svg viewBox="0 0 50 80" className="w-full h-full drop-shadow-lg">
            <rect x="0" y="0" width="50" height="5" fill="#4a3f35" />
            <path d="M 5 5 V 75 L 25 65 L 45 75 V 5 Z" fill="#b91c1c" stroke="#3f3f46" strokeWidth="1" />
            <path d="M25,30 L28,38 L37,38 L30,43 L33,51 L25,46 L17,51 L20,43 L13,38 L22,38 Z" fill="#f0b90b" />
        </svg>
    </div>
);
// --- End Decoration Components ---


const DoorNode: React.FC<{ mission: Mission; onSelect: () => void; nodeRef: React.Ref<HTMLButtonElement>; isOpening: boolean; index: number; }> = ({ mission, onSelect, nodeRef, isOpening, index }) => {
    const baseClasses = "relative group flex flex-col items-center p-4 transition-all duration-300 w-32 h-48";
    const statusClasses = {
        locked: "filter grayscale cursor-not-allowed opacity-60",
        unlocked: "hover:scale-105",
        completed: "opacity-70"
    };

    const handleSelect = () => {
        playSound(SoundEffect.ButtonClick);
        onSelect();
    }

    return (
        <div className="relative flex-shrink-0">
             <div className="absolute -left-8 bottom-0 z-10 pointer-events-none">
                 <Guard status={mission.status === 'completed' ? 'defeated' : 'idle'} index={index} />
             </div>
            <button ref={nodeRef} className={`${baseClasses} ${statusClasses[mission.status]} ${isOpening ? 'door-open' : ''}`} onClick={mission.status !== 'locked' ? handleSelect : undefined} disabled={mission.status === 'locked'}>
                <div className="absolute top-0 w-full text-center p-1 bg-[#4a3f35] rounded-t-md border-b-2 border-black/20 shadow-md z-10">
                    <h3 className={`font-bold text-sm ${mission.status === 'unlocked' ? 'text-yellow-200' : 'text-gray-400'}`}>{mission.title}</h3>
                </div>
                <div className="w-full h-full mt-8 door-frame">
                    <div className="relative w-full h-full bg-[#52525b] border-8 border-[#3f3f46] rounded-t-lg">
                        <div className="absolute inset-0 door bg-[#6b5a4d] flex items-center justify-center p-4">
                            <div className="w-3 h-3 rounded-full bg-[#27272a] absolute right-4 top-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </div>
                {mission.status === 'completed' && <div className="absolute top-10 right-2"><CheckIcon /></div>}
                {mission.status === 'locked' && <div className="absolute top-10 right-2"><LockIcon /></div>}
            </button>
        </div>
    );
};

const EntryDoor: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <div className={`absolute top-4 left-4 w-32 h-40 door-frame z-10 pointer-events-none ${isOpen ? 'door-open' : ''}`}>
        <div className="absolute bottom-0 w-full h-full">
             <svg viewBox="0 0 100 120" className="w-full h-full">
                <path d="M 5 120 V 30 C 5 5, 95 5, 95 30 V 120" fill="#3f3f46" stroke="#2a2522" strokeWidth="3"/>
                <path d="M 15 115 V 35 C 15 15, 85 15, 85 35 V 115" fill="#27272a" />
            </svg>
        </div>
        <div 
            className="absolute bottom-0 left-[15%] w-[70%] h-[96%] door bg-[#6b5a4d] border-4 border-[#4a3f35]"
            style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
        >
             <div className="w-3 h-3 rounded-full bg-[#27272a] absolute right-2 top-1/2 -translate-y-1/2"></div>
        </div>
    </div>
);

const ExitDoor: React.FC<{ isUnlocked: boolean; isSinking: boolean; onClick: () => void; nodeRef: React.Ref<HTMLButtonElement> }> = ({ isUnlocked, isSinking, onClick, nodeRef }) => {
    const statusClasses = isUnlocked
        ? 'hover:scale-105 cursor-pointer'
        : 'filter grayscale cursor-not-allowed opacity-60';
    
    const handleClick = () => {
        playSound(SoundEffect.ButtonClick);
        onClick();
    }

    return (
        <button 
            ref={nodeRef}
            onClick={handleClick} 
            disabled={!isUnlocked}
            className={`relative group flex flex-col items-center transition-transform duration-300 w-48 h-60 ${statusClasses}`}
        >
            <div className={`w-full h-full ${isSinking ? 'door-sinking' : ''}`}>
                <svg viewBox="0 0 140 170" className="w-full h-full absolute inset-0">
                    {/* Portal glow (behind door) */}
                     <defs>
                        <radialGradient id="portal-gradient-exit" gradientTransform="translate(-0.5, -0.5) scale(2, 2)">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#b45309" />
                        </radialGradient>
                        <filter id="portal-glow-filter">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                        </filter>
                    </defs>
                    <path d="M 15 165 L 15 60 C 15 10, 125 10, 125 60 L 125 165 Z" fill="url(#portal-gradient-exit)" className={isUnlocked ? 'animate-glow' : ''} filter={isUnlocked ? "url(#portal-glow-filter)" : "none"} />
                    
                    {/* Frame */}
                    <path d="M 5 170 L 5 60 C 5 5, 135 5, 135 60 L 135 170 L 120 170 L 120 65 C 120 20, 20 20, 20 65 L 20 170 Z" fill="#3f3f46" stroke="#2a2522" strokeWidth="3"/>
                    <rect x="20" y="10" width="100" height="10" fill="#3f3f46" />
                    <circle cx="25" cy="15" r="3" fill="#2a2522" />
                    <circle cx="115" cy="15" r="3" fill="#2a2522" />
                </svg>
                {/* The door that sinks */}
                <div className="absolute left-[14.5%] top-[12%] w-[71%] h-[86%] stone-door transition-transform duration-1000 ease-in overflow-hidden" style={{ clipPath: 'path("M 0 145 L 0 45 C 0 0, 100 0, 100 45 L 100 145 Z")'}}>
                   <svg viewBox="0 0 100 150" className="w-full h-full">
                     <path d="M 0 150 L 0 45 C 0 0, 100 0, 100 45 L 100 150 Z" fill="#6b5a4d" stroke="#4a3f35" strokeWidth="2" />
                     <path d="M 0 150 L 0 45 C 0 0, 100 0, 100 45 L 100 150 Z" fill="url(#stone-texture)" opacity="0.1" />
                     {/* Horizontal Bars */}
                     <rect x="0" y="50" width="100" height="10" fill="#4a3f35" opacity="0.6" />
                     <rect x="0" y="100" width="100" height="10" fill="#4a3f35" opacity="0.6" />
                     {/* Glowing Runes when Unlocked */}
                     <g opacity={isUnlocked ? 1 : 0} className={isUnlocked ? 'animate-glow' : ''} style={{transition: 'opacity 0.5s'}}>
                        <path d="M 50 75 L 40 85 L 60 85 Z M 40 95 L 60 95" stroke="#fef08a" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <circle cx="50" cy="70" r="15" stroke="#fef08a" strokeWidth="3" fill="none" strokeDasharray="5 8"/>
                     </g>
                     <defs>
                        <filter id="stone-texture-filter">
                            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
                            <feDiffuseLighting in="noise" lighting-color="#a1a1aa" surfaceScale="2">
                                <feDistantLight azimuth="45" elevation="60" />
                            </feDiffuseLighting>
                        </filter>
                        <pattern id="stone-texture" patternUnits="userSpaceOnUse" width="100" height="150">
                            <rect width="100" height="150" fill="#52525b" />
                            <rect width="100" height="150" filter="url(#stone-texture-filter)" />
                        </pattern>
                     </defs>
                   </svg>
                </div>
            </div>
             {!isUnlocked && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full">
                    <LockIcon />
                </div>
            )}
        </button>
    );
};


interface MissionMapProps {
  journey: Journey;
  onBack: () => void;
  onMissionSelect: (mission: Mission) => void;
  missionJustCompleted: string | null;
  onAnimationComplete: () => void;
  isInitialEntry: boolean;
  onEntryAnimationComplete: () => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({ journey, onBack, onMissionSelect, missionJustCompleted, onAnimationComplete, isInitialEntry, onEntryAnimationComplete }) => {
  const [charState, setCharState] = useState<CharacterState>('idle');
  const [charStyle, setCharStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [targetMission, setTargetMission] = useState<Mission | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isEntryDoorOpen, setIsEntryDoorOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const nodeRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const exitDoorRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  journey.missions.forEach(m => {
      if (!nodeRefs.current.has(m.id)) {
          nodeRefs.current.set(m.id, null);
      }
  });

  const allMissionsCompleted = useMemo(() => journey.missions.every(m => m.status === 'completed'), [journey.missions]);

  const getCharacterPositionForNode = (targetNode: HTMLElement | null, container: HTMLElement | null, side: 'left' | 'right' = 'right'): { left: number; bottom: number } | null => {
    if (!targetNode || !container) return null;
    
    const containerRect = container.getBoundingClientRect();
    const targetNodeRect = targetNode.getBoundingClientRect();
    const characterWidth = 80;

    const offset = side === 'right' ? targetNode.offsetWidth - (characterWidth / 2) + 10 : -(characterWidth / 2) - 10;
    const left = (targetNodeRect.left - containerRect.left) + offset;
    const bottom = containerRect.bottom - targetNodeRect.bottom;
    return { left, bottom };
  };

  useEffect(() => {
    if (!isInitialEntry) return;

    const container = containerRef.current;
    if (!container) return;

    const characterWidth = 80;
    const doorLeft = 16;
    const doorWidth = 128;

    setCharStyle({
        left: `${doorLeft + (doorWidth / 2) - (characterWidth / 2)}px`,
        top: `6rem`,
        opacity: 0,
        transform: 'scale(0.5)',
        transition: 'none',
    });
    setCharState('moving');

    const openDoorTimer = setTimeout(() => setIsEntryDoorOpen(true), 300);

    const emergeTimer = setTimeout(() => {
        setCharStyle(prev => ({
            ...prev,
            top: '12rem',
            opacity: 1,
            transform: 'scale(1)',
            transition: 'all 1000ms cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        }));
    }, 600);
    
    const walkTimer = setTimeout(() => {
        const getTargetNode = () => {
            const firstUnlocked = journey.missions.find(m => m.status === 'unlocked');
            if (firstUnlocked) return nodeRefs.current.get(firstUnlocked.id);
            const lastCompleted = [...journey.missions].reverse().find(m => m.status === 'completed');
            if (lastCompleted) return nodeRefs.current.get(lastCompleted.id);
            return nodeRefs.current.get(journey.missions[0]?.id);
        };
        const targetNode = getTargetNode();
        const position = getCharacterPositionForNode(targetNode, container);
        
        if (position) {
            setCharStyle({
                left: `${position.left}px`,
                bottom: `${position.bottom}px`,
                // @ts-ignore
                top: 'auto',
                opacity: 1,
                transform: 'scale(1)',
                transition: 'all 1200ms ease-in-out',
            });
        } else {
             setCharStyle(prev => ({
                ...prev,
                left: `${container.offsetWidth / 2 - 40}px`,
                bottom: '8rem',
                top: 'auto',
                transition: 'all 1200ms ease-in-out',
            }));
        }
    }, 1600);

    const cleanupTimer = setTimeout(() => {
        setIsEntryDoorOpen(false);
        setCharState('idle');
        onEntryAnimationComplete();
    }, 2900);

    return () => {
        clearTimeout(openDoorTimer);
        clearTimeout(emergeTimer);
        clearTimeout(walkTimer);
        clearTimeout(cleanupTimer);
    };
  }, [isInitialEntry, onEntryAnimationComplete, journey]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (isInitialEntry || isNavigating || !container) return;

    const getTargetNode = () => {
        if (allMissionsCompleted) return exitDoorRef.current;
        const firstUnlocked = journey.missions.find(m => m.status === 'unlocked');
        if (firstUnlocked) return nodeRefs.current.get(firstUnlocked.id);
        const lastCompleted = [...journey.missions].reverse().find(m => m.status === 'completed');
        if (lastCompleted) return nodeRefs.current.get(lastCompleted.id);
        return nodeRefs.current.get(journey.missions[0]?.id);
    };
    
    const targetNode = getTargetNode();
    const position = getCharacterPositionForNode(targetNode, container, allMissionsCompleted ? 'left' : 'right');
            
    if (position) {
        setCharStyle({
            left: `${position.left}px`,
            bottom: `${position.bottom}px`,
            opacity: 0,
            transform: 'translateY(10px) scale(0.95)',
            transition: 'none',
        });
        setTimeout(() => {
            setCharStyle({
                left: `${position.left}px`,
                bottom: `${position.bottom}px`,
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                transition: 'all 0.4s ease-out',
            });
        }, 50);
    } else {
        setCharStyle({
            left: `${container.offsetWidth / 2 - 40}px`,
            bottom: '8rem',
            opacity: 1,
            transform: 'translateY(0) scale(1)',
            transition: 'opacity 0.4s ease-out',
        });
    }
  }, [journey, isNavigating, isInitialEntry, allMissionsCompleted]);
  
  const handleSelect = (mission: Mission) => {
    if(isNavigating || mission.status === 'locked') return;

    setIsNavigating(true);
    setTargetMission(mission);
    const targetNode = nodeRefs.current.get(mission.id);
    const container = containerRef.current;

    if (!targetNode || !container) {
        setIsNavigating(false);
        setTargetMission(null);
        return;
    }
    
    const position = getCharacterPositionForNode(targetNode, container);

    if (position) {
        setCharState('moving');
        const travelTime = 1000;

        setCharStyle(prev => ({
            ...prev,
            left: `${position.left}px`,
            bottom: `${position.bottom}px`,
            transition: `all ${travelTime}ms ease-in-out`,
        }));

        setTimeout(() => {
            setCharState('idle');
            setTimeout(() => {
                setCharState('moving');
                
                const containerRect = container.getBoundingClientRect();
                const targetNodeRect = targetNode.getBoundingClientRect();
                const characterWidth = 80;

                const doorCenterX = (targetNodeRect.left - containerRect.left) + (targetNode.offsetWidth / 2) - (characterWidth / 2);
                const doorEntryBottom = (containerRect.bottom - targetNodeRect.bottom) + 20;

                setCharStyle({
                    left: `${doorCenterX}px`,
                    bottom: `${doorEntryBottom}px`,
                    transform: 'scale(0.4)',
                    opacity: 0,
                    transition: 'all 600ms ease-in',
                });

                setTimeout(() => {
                    onMissionSelect(mission);
                    setTimeout(() => {
                        setIsNavigating(false);
                        setTargetMission(null);
                    }, 500);
                }, 600);
            }, 300);
        }, travelTime);
    } else {
        setIsNavigating(false);
    }
  };

  const handleExit = () => {
    if (isNavigating || !allMissionsCompleted) return;

    setIsNavigating(true);
    const exitNode = exitDoorRef.current;
    const container = containerRef.current;
    if (!exitNode || !container) {
        setIsNavigating(false);
        return;
    }

    setCharState('moving');
    const travelTime = 1200;
    
    const position = getCharacterPositionForNode(exitNode, container, 'left');
    if(!position) { setIsNavigating(false); return; }

    setCharStyle({
        left: `${position.left}px`,
        bottom: `${position.bottom}px`,
        transition: `all ${travelTime}ms ease-in-out`,
    });

    setTimeout(() => {
        setCharState('idle');
        setIsExiting(true); // Start sinking the door

        setTimeout(() => { // After door sinks (1s)
            setCharState('moving');
            
            const containerRect = container.getBoundingClientRect();
            const exitNodeRect = exitNode.getBoundingClientRect();
            const characterWidth = 80;
            const doorCenterX = (exitNodeRect.left - containerRect.left) + (exitNode.offsetWidth / 2) - (characterWidth / 2);
            const doorEntryBottom = (containerRect.bottom - exitNodeRect.bottom) + 40;

            setCharStyle({
                left: `${doorCenterX}px`,
                bottom: `${doorEntryBottom}px`,
                transform: 'scale(0.2)',
                opacity: 0,
                transition: 'all 800ms ease-in',
            });

            setTimeout(() => {
                onBack();
                setTimeout(() => {
                    setIsNavigating(false);
                    setIsExiting(false);
                }, 500);
            }, 800);
        }, 1100);
    }, travelTime);
  };

  const handleBack = () => {
    playSound(SoundEffect.ButtonClick);
    onBack();
  }

  return (
    <div className="animate-fade-in w-full">
      <button
        onClick={handleBack}
        className="mb-4 z-30 text-sm text-yellow-400 hover:text-yellow-200 bg-gray-800/70 px-4 py-2 rounded-md border border-yellow-500/30 hover:border-yellow-500/50 transition-all shadow-md"
      >
        &larr; Voltar para o Mapa
      </button>
      <div ref={containerRef} className="relative p-8 castle-interior-background rounded-lg shadow-xl overflow-hidden min-h-[75vh] w-full">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-sm py-2 px-8 rounded-lg border border-yellow-500/30 shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-300 text-center whitespace-nowrap">{journey.title}</h2>
        </div>
        
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Torch className="absolute top-[25%] left-8" />
            <Torch className="absolute top-[60%] left-8" />
            <Torch className="absolute top-[25%] right-8" />
            <Torch className="absolute top-[60%] right-8" />
            <Banner className="absolute top-12 right-1/4" />
            <Banner className="absolute top-12 left-1/4 scale-x-[-1]" />
        </div>
        <EntryDoor isOpen={isEntryDoorOpen} />
        <div className="relative z-10 flex flex-wrap items-end justify-center gap-x-20 gap-y-12 pt-48 pl-4">
            {journey.missions.map((mission, index) => (
                <DoorNode 
                    key={mission.id} 
                    mission={mission} 
                    onSelect={() => handleSelect(mission)} 
                    nodeRef={(el) => { nodeRefs.current.set(mission.id, el); }} 
                    isOpening={targetMission?.id === mission.id}
                    index={index}
                />
            ))}
        </div>

        <div className="absolute bottom-4 right-4 z-10">
            <ExitDoor
                isUnlocked={allMissionsCompleted}
                isSinking={isExiting}
                onClick={handleExit}
                nodeRef={exitDoorRef}
            />
        </div>
        
        <div 
          style={charStyle} 
          className="absolute z-20"
        >
          <CharacterSVG charState={charState} className="w-20 h-20" />
        </div>
      </div>
    </div>
  );
};