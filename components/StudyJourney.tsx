import React, { useLayoutEffect, useRef, useState } from 'react';
import { Journey, CharacterState } from '../types';
import { CharacterSVG } from './CharacterGuide';

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg>;

const CastleIcon1 = ({ isOpening }: { isOpening: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Main Towers */}
        <path d="M15 95 V40 L25 30 L35 40 V95Z" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="1.5" />
        <path d="M85 95 V40 L75 30 L65 40 V95Z" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Battlements for side towers */}
        <rect x="13" y="40" width="4" height="4" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1"/>
        <rect x="19" y="40" width="4" height="4" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1"/>
        <rect x="25" y="40" width="4" height="4" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1"/>
        <rect x="83" y="40" width="4" height="4" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1"/>
        <rect x="77" y="40" width="4" height="4" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1"/>
        <rect x="71" y="40" width="4" height="4" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1"/>
        {/* Center Structure */}
        <path d="M35 95 V50 L65 50 V95 Z" fill="#71717a" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Center Tower */}
        <path d="M40 50 V20 L60 20 V50Z" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="1.5" />
        <path d="M35 20 L65 20 L50 10 Z" fill="#b91c1c" stroke="#3f3f46" strokeWidth="1.5" /> {/* Roof */}
        {/* Gate arch */}
        <path d="M42 95 V75 C 42 65, 58 65, 58 75 V95" fill="#27272a" />
        {/* Gate door */}
        <g style={{ transformOrigin: '42px 85px', transition: 'transform 0.5s ease-in-out', transform: isOpening ? 'rotateY(-110deg)' : 'none' }}>
            <path d="M42 95 V75 C 42 68, 58 68, 58 75 V95" fill="#6b5a4d" stroke="#4a3f35" strokeWidth="1.5" />
            <circle cx="45" cy="85" r="1.5" fill="#333" />
        </g>
    </svg>
);
const CastleIcon2 = ({ isOpening }: { isOpening: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Base */}
        <path d="M10 95 L20 80 L80 80 L90 95 Z" fill="#71717a" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Main Keep */}
        <path d="M25 80 V30 L75 30 V80 Z" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Turrets */}
        <path d="M20 35 V15 L35 15 V35 Z" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1.5" />
        <path d="M80 35 V15 L65 15 V35 Z" fill="#8b8b92" stroke="#3f3f46" strokeWidth="1.5" />
        <path d="M18 15 L37 15 L27.5 5 Z" fill="#b91c1c" stroke="#3f3f46" strokeWidth="1.5" /> {/* Roof */}
        <path d="M82 15 L63 15 L72.5 5 Z" fill="#b91c1c" stroke="#3f3f46" strokeWidth="1.5" /> {/* Roof */}
        {/* Windows */}
        <rect x="46" y="40" width="8" height="12" fill="#27272a" rx="1" />
        {/* Gate arch */}
        <path d="M42 80 V65 C 42 58, 58 58, 58 65 V80" fill="#27272a" />
        {/* Gate door */}
        <g style={{ transformOrigin: '42px 72px', transition: 'transform 0.5s ease-in-out', transform: isOpening ? 'rotateY(-110deg)' : 'none' }}>
            <path d="M42 80 V65 C 42 60, 58 60, 58 65 V80" fill="#6b5a4d" stroke="#4a3f35" strokeWidth="1.5" />
            <circle cx="45" cy="72" r="1.5" fill="#333" />
        </g>
    </svg>
);
const CastleIcon3 = ({ isOpening }: { isOpening: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Wall */}
        <path d="M5 95 L5 60 L95 60 L95 95 Z" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="1.5" />
        {/* Battlements */}
        <path d="M5 60 L95 60" fill="none" stroke="#3f3f46" strokeWidth="5" strokeDasharray="8 4" />
        {/* Main Tower */}
        <path d="M30 80 V20 L70 20 V80 Z" fill="#71717a" stroke="#3f3f46" strokeWidth="1.5" />
        <path d="M25 20 L75 20 L50 5 Z" fill="#b91c1c" stroke="#3f3f46" strokeWidth="1.5" /> {/* Roof */}
        {/* Flag */}
        <line x1="50" y1="5" x2="50" y2="-5" stroke="#4a3f35" strokeWidth="2" />
        <polygon points="50,-5 65,0 50,5" fill="#f59e0b" />
        {/* Window */}
        <circle cx="50" cy="35" r="5" fill="#27272a" />
        {/* Gate arch */}
        <path d="M42 95 V80 C 42 73, 58 73, 58 80 V95" fill="#27272a" />
        {/* Gate door */}
        <g style={{ transformOrigin: '42px 87px', transition: 'transform 0.5s ease-in-out', transform: isOpening ? 'rotateY(-110deg)' : 'none' }}>
            <path d="M42 95 V80 C 42 75, 58 75, 58 80 V95" fill="#6b5a4d" stroke="#4a3f35" strokeWidth="1.5" />
            <circle cx="45" cy="87" r="1.5" fill="#333" />
        </g>
    </svg>
);


const JourneyIcons = [CastleIcon1, CastleIcon2, CastleIcon3, CastleIcon1, CastleIcon2];

const journeysLayout = [
    { top: '10%', left: '15%' }, { top: '30%', left: '45%' },
    { top: '15%', left: '75%' }, { top: '55%', left: '80%' },
    { top: '60%', left: '50%' }, { top: '70%', left: '20%' },
];

const JourneyNode: React.FC<{ journey: Journey; onSelect: () => void; isCurrent: boolean; style: React.CSSProperties; index: number; nodeRef: React.Ref<HTMLButtonElement>; isOpening: boolean }> = ({ journey, onSelect, isCurrent, style, index, nodeRef, isOpening }) => {
    const baseClasses = "absolute w-36 h-36 flex flex-col justify-center items-center text-center transition-all duration-500 transform group z-20 p-2";
    const statusClasses = {
        locked: "filter grayscale cursor-not-allowed opacity-60",
        unlocked: "hover:scale-105",
        completed: "opacity-80"
    };
    const IconComponent = JourneyIcons[index % JourneyIcons.length];
    
    return (
        <button ref={nodeRef} className={`${baseClasses} ${statusClasses[journey.status]}`} style={style} onClick={journey.status !== 'locked' ? onSelect : undefined} disabled={journey.status === 'locked'}>
            <div className={`relative w-28 h-28 transition-transform duration-300 group-hover:scale-110 ${isCurrent ? 'animate-glow' : ''}`}>
                <IconComponent isOpening={isOpening} />
            </div>
            <h3 className={`text-sm font-bold break-words mt-1 ${journey.status === 'unlocked' ? 'text-yellow-200' : 'text-gray-400'}`}>{journey.title}</h3>
            
            {journey.status === 'locked' && <div className="absolute top-1 right-1 p-1 bg-gray-900/50 rounded-full text-white"><LockIcon /></div>}
            {journey.status === 'completed' && <div className="absolute top-1 right-1 p-1 bg-teal-900/50 rounded-full text-teal-200"><CheckIcon /></div>}
        </button>
    );
};

interface JourneyMapProps {
    journeys: Journey[];
    onJourneySelect: (journey: Journey) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ journeys, onJourneySelect }) => {
    const currentJourneyIndex = journeys.findIndex(j => j.status === 'unlocked');
    const [paths, setPaths] = useState<React.CSSProperties[]>([]);
    const nodeRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const characterRef = useRef<HTMLDivElement>(null);

    const [charState, setCharState] = useState<CharacterState>('idle');
    const [charStyle, setCharStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const [isNavigating, setIsNavigating] = useState(false);
    const [targetJourney, setTargetJourney] = useState<Journey | null>(null);

    journeys.forEach(j => {
        if (!nodeRefs.current.has(j.id)) {
            nodeRefs.current.set(j.id, null);
        }
    });

    useLayoutEffect(() => {
        const mapContainer = mapContainerRef.current;
        if (!mapContainer) return;

        const calculateLayout = () => {
            const mapRect = mapContainer.getBoundingClientRect();
            if (mapRect.width === 0 || isNavigating) return;

            // Paths
            const newPaths: React.CSSProperties[] = [];
            for (let i = 1; i < journeys.length; i++) {
                const prevNode = nodeRefs.current.get(journeys[i - 1].id);
                const currNode = nodeRefs.current.get(journeys[i].id);
                if (prevNode && currNode) {
                    const x1 = prevNode.offsetLeft + prevNode.offsetWidth / 2;
                    const y1 = prevNode.offsetTop + prevNode.offsetHeight / 2;
                    const x2 = currNode.offsetLeft + currNode.offsetWidth / 2;
                    const y2 = currNode.offsetTop + currNode.offsetHeight / 2;
                    const distance = Math.hypot(x2 - x1, y2 - y1);
                    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                    newPaths.push({
                        top: `${y1}px`, left: `${x1}px`, width: `${distance}px`, transform: `rotate(${angle}deg)`,
                    });
                }
            }
            setPaths(newPaths);

            // Character
            const charNode = nodeRefs.current.get(journeys[currentJourneyIndex]?.id);
            if (charNode && characterRef.current) {
                // Position the character in FRONT of (below) the current castle.
                setCharStyle({
                    top: charNode.offsetTop + charNode.offsetHeight - charNode.firstElementChild.clientHeight/4, // Position his feet near the base of the castle
                    left: charNode.offsetLeft + charNode.offsetWidth / 2 - characterRef.current.offsetWidth / 2,
                    opacity: 1,
                    transform: 'scale(1)',
                    transition: 'opacity 0.5s ease-in',
                });
            }
        };
        
        const resizeObserver = new ResizeObserver(calculateLayout);
        resizeObserver.observe(mapContainer);
        calculateLayout(); // Initial call

        return () => resizeObserver.disconnect();
    }, [journeys, currentJourneyIndex, isNavigating]);

    const handleSelect = (journey: Journey) => {
        if (isNavigating || journey.status === 'locked' || !characterRef.current) return;

        const targetNode = nodeRefs.current.get(journey.id);
        if (!targetNode) return;

        setIsNavigating(true);
        setTargetJourney(journey);
        
        setCharState('salute');

        // 1. After salute (1.2s)
        setTimeout(() => {
            setCharState('moving');
            const walkTime = 2000;

            // Walk to a spot IN FRONT of the target castle gate
            const targetTop = targetNode.offsetTop + targetNode.offsetHeight - characterRef.current.offsetHeight/2;
            const targetLeft = targetNode.offsetLeft + targetNode.offsetWidth / 2 - characterRef.current.offsetWidth / 2;
            
            setCharStyle({
                top: targetTop,
                left: targetLeft,
                opacity: 1,
                transform: 'scale(1)',
                transition: `all ${walkTime}ms linear`,
            });

            // 2. After walking is done
            setTimeout(() => {
                setCharState('idle'); // Pause

                // 3. After a brief pause, start entering
                setTimeout(() => {
                    const enterTime = 800;
                    // The gate is opening via CSS because targetJourney is set.
                    // Animate character moving "into" the gate (move towards center and shrink)
                    setCharStyle(prev => ({
                        ...prev,
                        top: targetNode.offsetTop + targetNode.offsetHeight / 2,
                        opacity: 0,
                        transform: 'scale(0.3)',
                        transition: `all ${enterTime}ms ease-in`,
                    }));

                    // 4. After entering animation is complete, switch view
                    setTimeout(() => {
                        onJourneySelect(journey);
                        // Reset state after a delay to allow modal transition
                        setTimeout(() => {
                            setIsNavigating(false);
                            setTargetJourney(null);
                            setCharState('idle');
                        }, 500);
                    }, enterTime);

                }, 400); // Pause for 400ms before entering

            }, walkTime);

        }, 1200); // Salute time
    };

    return (
        <div className="animate-fade-in py-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Mapa do Mundo</h2>
                <p className="text-gray-400 text-center">Sua aventura épica começa aqui. Complete uma jornada para revelar o próximo desafio.</p>
            </div>
            <div ref={mapContainerRef} className="relative mt-8 w-full h-[80vh] game-map-background rounded-lg shadow-xl p-4 overflow-hidden">
                {paths.map((style, i) => (
                    <div key={`path-${i}`} className="map-path" style={style}></div>
                ))}
                
                <div 
                    ref={characterRef}
                    style={charStyle} 
                    className="absolute z-30 w-20 h-20"
                >
                    <CharacterSVG charState={charState} className="w-full h-full"/>
                </div>
                
                {journeys.map((journey, index) => (
                     <JourneyNode 
                        key={journey.id}
                        journey={journey} 
                        onSelect={() => handleSelect(journey)} 
                        isCurrent={index === currentJourneyIndex}
                        style={journeysLayout[index % journeysLayout.length]}
                        index={index}
                        isOpening={targetJourney?.id === journey.id}
                        nodeRef={(el) => { nodeRefs.current.set(journey.id, el); }}
                    />
                ))}
            </div>
        </div>
    );
};