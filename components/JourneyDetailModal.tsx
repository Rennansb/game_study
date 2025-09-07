import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Journey, Mission, CharacterState } from '../types';
import { CharacterSVG } from './CharacterGuide';

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-300"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg>;
const MissionIcons = ['🏁', '🎯', '🚩', '📍', '📌', '⚔️', '🛡️'];

const MissionNode: React.FC<{ mission: Mission; onSelect: () => void; nodeRef: React.Ref<HTMLButtonElement>; index: number; style: React.CSSProperties, isDisabled: boolean }> = ({ mission, onSelect, nodeRef, index, style, isDisabled }) => {
    const baseClasses = "absolute z-10 border-2 rounded-lg p-4 transition-all duration-300 transform text-left w-full max-w-sm flex items-center space-x-4";
    const statusClasses = {
        locked: "bg-gray-800/50 border-gray-700 filter grayscale cursor-not-allowed",
        unlocked: "bg-gray-800 border-yellow-600 hover:border-yellow-400 hover:shadow-lg hover:-translate-y-1 animate-pulse-strong",
        completed: "bg-gray-900/60 border-gray-800 opacity-60"
    };
    const alignmentClass = index % 2 === 0 ? 'flex-row-reverse space-x-reverse' : '';

    return (
        <button ref={nodeRef} style={style} className={`${baseClasses} ${statusClasses[mission.status]} ${alignmentClass}`} onClick={mission.status !== 'locked' ? onSelect : undefined} disabled={mission.status === 'locked' || isDisabled}>
            <div className="text-3xl bg-gray-900/50 p-2 rounded-md">{MissionIcons[index % MissionIcons.length]}</div>
            <div className="flex-1">
                <h3 className={`font-bold ${mission.status === 'unlocked' ? 'text-yellow-400' : 'text-gray-400'}`}>{mission.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{mission.tasks.length} {mission.tasks.length === 1 ? 'tarefa' : 'tarefas'}</p>
            </div>
            {mission.status === 'completed' && <div className="text-teal-300"><CheckIcon /></div>}
            {mission.status === 'locked' && <LockIcon />}
        </button>
    );
};

interface MissionMapProps {
  journey: Journey;
  onBack: () => void;
  onMissionSelect: (mission: Mission) => void;
  missionJustCompleted: string | null;
  onAnimationComplete: () => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({ journey, onBack, onMissionSelect, missionJustCompleted, onAnimationComplete }) => {
  const [charPos, setCharPos] = useState<React.CSSProperties>({ top: -100, opacity: 0 });
  const [charState, setCharState] = useState<CharacterState>('idle');
  const [branchPaths, setBranchPaths] = useState<React.CSSProperties[]>([]);
  
  const nodeRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const isAnimatingMove = useRef(false);

  journey.missions.forEach(m => {
      if (!nodeRefs.current.has(m.id)) {
          nodeRefs.current.set(m.id, null);
      }
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || journey.missions.length === 0) return;

    const calculateLayout = () => {
        const lastMissionId = journey.missions[journey.missions.length - 1].id;
        const lastNode = nodeRefs.current.get(lastMissionId);

        if (lastNode && pathRef.current) {
            const pathHeight = lastNode.offsetTop + lastNode.offsetHeight / 2;
            pathRef.current.style.height = `${pathHeight}px`;
            container.style.minHeight = `${pathHeight + 100}px`;
        }

        const newBranchPaths: React.CSSProperties[] = [];
        const containerWidth = container.offsetWidth;
        const centerX = containerWidth / 2;

        journey.missions.forEach((mission, index) => {
            const node = nodeRefs.current.get(mission.id);
            if(node) {
                const nodeTop = node.offsetTop + node.offsetHeight / 2;
                if(index % 2 === 0) { // Left side
                     newBranchPaths.push({
                        top: `${nodeTop}px`,
                        left: `${node.offsetLeft + node.offsetWidth}px`,
                        width: `${centerX - (node.offsetLeft + node.offsetWidth)}px`
                    });
                } else { // Right side
                    newBranchPaths.push({
                        top: `${nodeTop}px`,
                        left: `${centerX}px`,
                        width: `${node.offsetLeft - centerX}px`
                    });
                }
            }
        });
        setBranchPaths(newBranchPaths);

        if (isAnimatingMove.current) return;

        const firstUnlockedIndex = journey.missions.findIndex(m => m.status === 'unlocked');
        const lastCompletedMission = [...journey.missions].reverse().find(m => m.status === 'completed');
        let currentIndex = 0;
        if (firstUnlockedIndex !== -1) {
            currentIndex = firstUnlockedIndex;
        } else if (lastCompletedMission) {
            currentIndex = journey.missions.findIndex(m => m.id === lastCompletedMission.id);
        }
        
        const currentNode = nodeRefs.current.get(journey.missions[currentIndex].id);
        if(currentNode) {
            const top = currentNode.offsetTop + currentNode.offsetHeight / 2;
            if (characterRef.current) {
                characterRef.current.style.transitionDuration = '0s';
            }
            setCharPos({
                top: `${top}px`, left: '50%', transform: 'translateX(-50%) translateY(-50%)', opacity: 1,
            });
        }
    };

    const resizeObserver = new ResizeObserver(calculateLayout);
    resizeObserver.observe(container);

    calculateLayout(); // Initial calculation

    return () => resizeObserver.disconnect();
  }, [journey]);
  
  useEffect(() => {
    if (!missionJustCompleted) return;

    isAnimatingMove.current = true;
    const completedIndex = journey.missions.findIndex(m => m.id === missionJustCompleted);
    const nextMissionIndex = completedIndex + 1;

    if (nextMissionIndex < journey.missions.length) {
        const nextMission = journey.missions[nextMissionIndex];
        const nextNode = nodeRefs.current.get(nextMission.id);
        
        if (nextNode) {
            if (characterRef.current) {
                characterRef.current.style.transitionDuration = '1.5s';
            }
            const top = nextNode.offsetTop + nextNode.offsetHeight / 2;
            setCharState('moving');
            setCharPos(prev => ({ ...prev, top: `${top}px`}));
        }
    } else {
        isAnimatingMove.current = false;
        onAnimationComplete();
    }
  }, [missionJustCompleted, journey.missions, onAnimationComplete]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (isAnimatingMove.current && event.propertyName === 'top') {
      isAnimatingMove.current = false;
      setCharState('idle');
      onAnimationComplete();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="p-6 border-b border-gray-700 bg-gray-900/50 rounded-t-lg">
         <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-200 mb-2">&larr; Voltar para o Mapa</button>
         <h2 className="text-3xl font-bold text-white">{journey.title}</h2>
      </div>
      <div ref={containerRef} className="p-6 relative mt-0 game-map-background rounded-b-lg shadow-xl overflow-hidden">
        <div ref={pathRef} className="mission-tree-path"></div>
        {branchPaths.map((style, i) => <div key={`branch-${i}`} className="mission-branch-path" style={style}></div>)}
        
        <div 
          ref={characterRef}
          onTransitionEnd={handleTransitionEnd}
          style={charPos} 
          className="absolute transition-all ease-in-out z-20"
        >
          <CharacterSVG charState={charState} className="w-24 h-24" />
        </div>
        
        {journey.missions.map((mission, index) => (
             <MissionNode 
                key={mission.id} 
                mission={mission} 
                onSelect={() => onMissionSelect(mission)} 
                nodeRef={(el) => { nodeRefs.current.set(mission.id, el); }} 
                index={index}
                isDisabled={isAnimatingMove.current}
                style={{
                    top: `${index * 140 + 40}px`,
                    left: '50%',
                    transform: index % 2 === 0 ? 'translateX(calc(-100% - 40px))' : 'translateX(40px)'
                }}
            />
        ))}
      </div>
    </div>
  );
};