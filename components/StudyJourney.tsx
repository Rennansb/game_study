import React, { useLayoutEffect, useRef, useState } from 'react';
import { Journey } from '../types';
import { CharacterSVG } from './CharacterGuide';

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg>;

const ToriiGateIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.5 160.2H759.7v-45.8c0-4.4-3.6-8-8-8h-53.5c-4.4 0-8 3.6-8 8v45.8H333.8v-45.8c0-4.4-3.6-8-8-8h-53.5c-4.4 0-8 3.6-8 8v45.8H138.5c-4.4 0-8 3.6-8 8v53.5c0 4.4 3.6 8 8 8h52.3v635.8h-52.3c-4.4 0-8 3.6-8 8v53.5c0 4.4 3.6 8 8 8h747c4.4 0 8-3.6 8-8v-53.5c0-4.4-3.6-8-8-8h-52.3V229.7h52.3c4.4 0 8-3.6 8-8v-53.5c0-4.4-3.6-8-8-8zM751.7 857.5H272.3V229.7h479.4v627.8z"></path></svg>;
const MountainIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M414 233.5C414 225.5 400 224 400 224h-24c-12.3 0-24.3-6.6-31-17.7l-48.8-78.1-19-30.4c-7.3-11.7-21.7-18.7-36.8-18.7c-12.7 0-24.8 5.4-33.3 14.2l-43 43.4-34.5-43.1c-9.3-11.6-23.7-18.5-39.2-18.5c-15.1 0-29.2 6.5-38.6 17.5l-45.1 52.3-14.6 16.9c-8.8 10.2-22.1 16.2-36.4 16.2H16c-8.8 0-16 7.2-16 16s7.2 16 16 16h38.2c16.1 0 31-7.2 41.6-19.1l14.4-16.7 44.9-52.1c5-5.8 12.3-9.1 20-9.1c9.3 0 17.9 4.7 23.3 12.6l34.5 43.1 43.3-43.2c5.4-5.4 12.8-8.4 20.7-8.4c8.4 0 16.3 3.6 21.6 9.8l19 30.4 48.8 78.1c6.7 11.1 18.7 17.7 31 17.7h24c8 0 22 1.5 22 9.5c0 7.8-12.3 9.2-22.3 9.2H291.5c-11.5 0-22.5 5.5-29.3 14.8l-37.4 51.5-18.1 24.9c-7.9 10.9-20.9 17.5-35.4 17.5c-11.4 0-22.2-4.8-29.9-12.9L116 394.5c-9.9-10.7-24.7-17-40.5-17H16c-8.8 0-16 7.2-16 16s7.2 16 16 16h59.5c20.3 0 39.2 9.7 51.2 25.5l25.3 32.9c16.3 21.1 41.4 33.9 68.5 33.9c18.5 0 35.8-7.2 48.9-20.2l18.1-24.9 37.4-51.5c6.8-9.3 17.8-14.8 29.3-14.8h122.2c9.8 0 22-1.5 22-9.5z"></path></svg>;
const FortressIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 10V7c0-1.103-.897-2-2-2h-3c0-1.654-1.346-3-3-3S8 3.346 8 5H5c-1.103 0-2 .897-2 2v3h16zM5 12v7h14v-7H5zm5 5h4v-3h-4v3z"></path></svg>;
const OasisIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M495.2 225.2c-2.3-5.2-7-9.2-12.4-10.8L354 169.3l4.8-16.4c1.2-4.1.2-8.6-2.6-11.8s-7.1-4.7-11.3-4.2l-149.3 17.4-44.2-44.2c-9.1-9.1-21.3-14.1-34.3-14.1H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48.4c3.2 0 6.3-1.3 8.5-3.5l44.2-44.2 136.1-15.9-26.6 90.9c-2.3 8.2 3 16.7 11.6 18.5l140.3 29.1-89.2 76.5c-6.8 5.8-9.5 15.1-6.9 23.6l23.5 76.2c2.2 7.2 9.2 12.1 16.8 12.1 2.1 0 4.2-.4 6.3-1.2 8-3.2 13.1-11.1 11.8-19.6l-20.8-67.2 82.2-70.5c7.4-6.3 10.4-16.1 7.7-25.2zM21.3 292.1c-6.2-1.7-12.5 1.5-14.2 7.7l-6.4 23.2c-1.7 6.2 1.5 12.5 7.7 14.2 6.2 1.7 12.5-1.5 14.2-7.7l6.4-23.2c1.7-6.2-1.5-12.5-7.7-14.2zm64 64c-1.7 6.2 1.5 12.5 7.7 14.2 6.2 1.7 12.5-1.5 14.2-7.7l6.4-23.2c1.7-6.2-1.5-12.5-7.7-14.2-6.2-1.7-12.5 1.5-14.2 7.7l-6.4 23.2zm-42.7 8.1c-1.7 6.2 1.5 12.5 7.7 14.2 6.2 1.7 12.5-1.5 14.2-7.7l6.4-23.2c1.7-6.2-1.5-12.5-7.7-14.2-6.2-1.7-12.5 1.5-14.2 7.7l-6.4 23.2z"></path></svg>;
const VolcanoIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19.467 2.45c-2.14-1.92-5.462-2.14-7.461-.151-2.022-1.983-5.321-1.763-7.461.151-2.269 2.029-2.338 5.485-.156 7.57l7.617 8.356 7.618-8.356c2.18-2.085 2.112-5.541-.157-7.57zM12 11c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path><path d="m14.467 17.45-2.467 2.55-2.465-2.55C7.3 19.82 4 22 4 22h16s-3.3-2.18-5.533-4.55z"></path></svg>;

const JourneyIcons = [ToriiGateIcon, MountainIcon, FortressIcon, VolcanoIcon, OasisIcon];

const journeysLayout = [
    { top: '10%', left: '15%' }, { top: '30%', left: '45%' },
    { top: '15%', left: '75%' }, { top: '55%', left: '80%' },
    { top: '60%', left: '50%' }, { top: '70%', left: '20%' },
];

const JourneyNode: React.FC<{ journey: Journey; onSelect: () => void; isUnlocked: boolean; style: React.CSSProperties; index: number; nodeRef: React.Ref<HTMLButtonElement>; progress: number; }> = ({ journey, onSelect, isUnlocked, style, index, nodeRef, progress }) => {
    const baseClasses = "absolute w-36 h-36 flex flex-col justify-center items-center text-center transition-all duration-500 transform group z-10 p-2 rounded-full border-4";
    const statusClasses = {
        locked: "bg-gray-800/80 border-gray-700 filter grayscale cursor-not-allowed",
        unlocked: "bg-gray-800/90 border-yellow-500 hover:border-yellow-300 hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-105",
        completed: "bg-teal-900/60 border-teal-700/50"
    };
    const IconComponent = JourneyIcons[index % JourneyIcons.length];
    
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <button ref={nodeRef} className={`${baseClasses} ${statusClasses[journey.status]}`} style={style} onClick={journey.status !== 'locked' ? onSelect : undefined} disabled={journey.status === 'locked'}>
            <svg className="absolute w-[120px] h-[120px]" viewBox="0 0 52 52">
                <circle className="text-gray-700/50" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx="26" cy="26"/>
                <circle
                    className="progress-ring__circle text-yellow-400"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="26"
                    cy="26"
                />
            </svg>
            <div className="text-4xl mb-1 text-yellow-300 group-hover:text-white transition-colors">
                <IconComponent />
            </div>
            <h3 className={`text-sm font-bold break-words ${journey.status === 'unlocked' ? 'text-yellow-300' : 'text-gray-400'}`}>{journey.title}</h3>
            <div className={`absolute bottom-3 text-xs font-mono ${journey.status === 'unlocked' ? 'text-yellow-200' : 'text-gray-400'}`}>{Math.round(progress)}%</div>
            
            {isUnlocked && <div className="absolute -top-2 -left-2 w-40 h-40 border-2 border-yellow-400 rounded-full animate-pulse-strong z-0"></div>}
            {journey.status === 'locked' && <div className="absolute top-1 right-1 p-1 bg-gray-600/50 rounded-full text-white"><LockIcon /></div>}
            {journey.status === 'completed' && <div className="absolute top-1 right-1 p-1 bg-teal-500/50 rounded-full text-teal-200"><CheckIcon /></div>}
        </button>
    );
};

interface JourneyMapProps {
    journeys: Journey[];
    onJourneySelect: (journey: Journey) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ journeys, onJourneySelect }) => {
    const currentJourneyIndex = journeys.findIndex(j => j.status === 'unlocked');
    const charPos = currentJourneyIndex !== -1 ? journeysLayout[currentJourneyIndex % journeysLayout.length] : null;
    
    const [paths, setPaths] = useState<React.CSSProperties[]>([]);
    const nodeRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
    const mapContainerRef = useRef<HTMLDivElement>(null);

    journeys.forEach(j => {
        if (!nodeRefs.current.has(j.id)) {
            nodeRefs.current.set(j.id, null);
        }
    });

    useLayoutEffect(() => {
        const mapContainer = mapContainerRef.current;
        if (!mapContainer) return;

        const calculatePaths = () => {
            const mapRect = mapContainer.getBoundingClientRect();
            if (mapRect.width === 0) return; // Don't calculate if not visible
            const newPaths: React.CSSProperties[] = [];

            for (let i = 1; i < journeys.length; i++) {
                const prevNode = nodeRefs.current.get(journeys[i - 1].id);
                const currNode = nodeRefs.current.get(journeys[i].id);

                if (prevNode && currNode) {
                    const prevRect = prevNode.getBoundingClientRect();
                    const currRect = currNode.getBoundingClientRect();

                    const x1 = (prevRect.left - mapRect.left) + prevRect.width / 2;
                    const y1 = (prevRect.top - mapRect.top) + prevRect.height / 2;
                    const x2 = (currRect.left - mapRect.left) + currRect.width / 2;
                    const y2 = (currRect.top - mapRect.top) + currRect.height / 2;

                    const distance = Math.hypot(x2 - x1, y2 - y1);
                    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

                    newPaths.push({
                        top: `${y1}px`,
                        left: `${x1}px`,
                        width: `${distance}px`,
                        transform: `rotate(${angle}deg)`,
                    });
                }
            }
            setPaths(newPaths);
        };
        
        const resizeObserver = new ResizeObserver(calculatePaths);
        resizeObserver.observe(mapContainer);

        return () => resizeObserver.disconnect();
    }, [journeys]);

    return (
        <div className="animate-fade-in py-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Mapa do Mundo</h2>
                <p className="text-gray-400 text-center">Sua aventura épica começa aqui. Complete uma jornada para revelar o próximo desafio.</p>
            </div>
            <div ref={mapContainerRef} className="relative mt-8 w-full h-[80vh] game-map-background rounded-lg shadow-xl p-4 overflow-hidden">
                {/* Paths */}
                {paths.map((style, i) => (
                    <div key={`path-${i}`} className="map-path" style={style}></div>
                ))}
                
                 {/* Character */}
                {charPos && (
                    <div 
                        style={{ top: `calc(${charPos.top} + 90px)`, left: `calc(${charPos.left} + 50px)` }} 
                        className="absolute transition-all duration-1000 ease-in-out z-20"
                    >
                        <CharacterSVG charState={'idle'} className="w-20 h-20"/>
                    </div>
                )}
                
                {/* Nodes */}
                {journeys.map((journey, index) => {
                     const completedMissions = journey.missions.filter(m => m.status === 'completed').length;
                     const totalMissions = journey.missions.length;
                     const progress = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : (journey.status === 'completed' ? 100 : 0);

                     return <JourneyNode 
                        key={journey.id}
                        journey={journey} 
                        onSelect={() => onJourneySelect(journey)} 
                        isUnlocked={journey.status === 'unlocked'}
                        style={journeysLayout[index % journeysLayout.length]}
                        index={index}
                        progress={progress}
                        nodeRef={(el) => { nodeRefs.current.set(journey.id, el); }}
                    />
                })}
            </div>
        </div>
    );
};
