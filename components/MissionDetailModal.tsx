import React, { useState, useRef, useLayoutEffect } from 'react';
import { Mission, Task, CharacterState } from '../types';
import { CharacterSVG } from './CharacterGuide';

interface TaskViewProps {
  mission: Mission;
  onBack: () => void;
  onTaskCheck: (missionId: string, taskId: string, isChecked: boolean) => void;
  onStartQuiz: () => void;
}

const CheckAnimation: React.FC<{ taskElement: HTMLElement }> = ({ taskElement }) => {
  const [phase, setPhase] = useState<'start' | 'slashing' | 'burning' | 'success' | 'end'>('start');
  const [charStyle, setCharStyle] = useState<React.CSSProperties>({});
  const [slashPath, setSlashPath] = useState({ d: '', length: 0 });
  const [isSlashVisible, setIsSlashVisible] = useState(false);
  const [fireStyle, setFireStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    const container = taskElement.closest('[data-container="task-view"]');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    const taskText = taskElement.querySelector('span');
    const checkbox = taskElement.querySelector('[data-checkbox-icon]');
    if(!taskText || !checkbox) return;

    const taskTextRect = taskText.getBoundingClientRect();
    const checkboxRect = checkbox.getBoundingClientRect();
    
    // --- Character Positioning ---
    const initialLeft = taskTextRect.right - containerRect.left;
    const initialTop = taskTextRect.top - containerRect.top + (taskTextRect.height / 2) - 40;
    const finalLeft = checkboxRect.left - containerRect.left - 80;

    // --- Slash Path Calculation ---
    const startX = taskTextRect.left - containerRect.left - 10;
    const startY = taskTextRect.top - containerRect.top + (taskTextRect.height / 2);
    const endX = checkboxRect.left - containerRect.left + (checkboxRect.width / 2);
    const endY = checkboxRect.top - containerRect.top + (checkboxRect.height / 2);
    const controlX = startX + (endX - startX) * 0.5;
    const controlY = startY - 40; // Arc upwards
    const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', pathD);
    const pathLength = tempPath.getTotalLength();
    setSlashPath({ d: pathD, length: pathLength });
    
    // --- Initial Styles ---
    setCharStyle({
        position: 'absolute',
        top: `${initialTop}px`,
        left: `${initialLeft}px`,
        opacity: 0,
        transform: 'scale(1.2) scaleX(-1)', // Flipped to face left
        zIndex: 50,
    });
    
    setFireStyle({
        position: 'absolute',
        top: `${endY - 20}px`, left: `${endX - 20}px`,
        width: '40px', height: '40px',
        opacity: 0, zIndex: 51,
    });

    // --- Animation Sequence ---
    setTimeout(() => { // 1. Appear
        setCharStyle(s => ({ ...s, opacity: 1, transition: 'opacity 0.2s ease-in' }));
    }, 100);

    setTimeout(() => { // 2. Dash & Slash
        setPhase('slashing');
        setCharStyle(s => ({
            ...s, left: `${finalLeft}px`,
            transition: 'left 0.5s cubic-bezier(0.4, 0, 0.8, 1)',
        }));
        setIsSlashVisible(true);
    }, 400);

    setTimeout(() => { // 3. Burn
        setPhase('burning');
    }, 900); // 400ms start + 500ms travel

    setTimeout(() => { // 4. Success
        setPhase('success');
    }, 1400);

    setTimeout(() => { // 5. Disappear
        setPhase('end');
        setCharStyle(s => ({ ...s, opacity: 0, transition: 'opacity 0.3s ease-out' }));
    }, 2400);

  }, [taskElement]);

  return (
    <>
      <div style={charStyle}>
        <CharacterSVG charState={phase === 'success' ? 'success' : 'idle'} className={phase === 'slashing' ? 'character-slashing' : ''} />
      </div>
      
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-40" style={{ opacity: isSlashVisible ? 1 : 0 }}>
        <path 
            d={slashPath.d}
            fill="none"
            stroke="url(#slash-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={slashPath.length}
            strokeDashoffset={slashPath.length}
            style={{ animation: isSlashVisible ? `draw-slash-path 0.4s ease-out 0.1s forwards` : 'none' }}
        />
        <defs>
            <linearGradient id="slash-gradient">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
        </defs>
      </svg>
      
      <div style={fireStyle}>
        {phase === 'burning' && (
            <div className="w-full h-full bg-yellow-400 rounded-full" style={{ animation: 'checkbox-burn 0.5s forwards', filter: 'url(#fire-effect)' }}></div>
        )}
      </div>
    </>
  );
};

const CustomCheckbox: React.FC<{ isCompleted: boolean, isAnimating: boolean }> = ({ isCompleted, isAnimating }) => {
    const baseClass = "w-7 h-7 stroke-yellow-700 transition-all duration-300";
    const completedClass = "stroke-yellow-400 fill-yellow-400/20";
    
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            data-checkbox-icon="true"
            className={`${baseClass} ${isCompleted ? completedClass : 'stroke-2'}`}
            style={{ opacity: isAnimating ? 0 : 1 }}
        >
            <rect x="2" y="2" width="20" height="20" rx="2" className="transition-all duration-300" />
            {isCompleted && (
                <path d="M7 12.5L10.5 16L17 8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-glow" style={{ animation: 'rune-glow 2s infinite' }} />
            )}
        </svg>
    );
};

export const TaskView: React.FC<TaskViewProps> = ({ mission, onBack, onTaskCheck, onStartQuiz }) => {
  const allTasksCompleted = mission.tasks.every(task => task.isCompleted);
  const [animatingTask, setAnimatingTask] = useState<{ id: string, element: HTMLElement } | null>(null);
  const taskRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());

  const handleTaskClick = (task: Task) => {
    if (animatingTask || task.isCompleted) return;
    const element = taskRefs.current.get(task.id);
    if (element) {
      setAnimatingTask({ id: task.id, element });
      setTimeout(() => onTaskCheck(mission.id, task.id, true), 1000);
      setTimeout(() => setAnimatingTask(null), 2800);
    }
  };

  return (
    <div className="animate-fade-in w-full flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-4xl">
            <button
                onClick={onBack}
                className="mb-4 text-sm text-yellow-400 hover:text-yellow-200 bg-gray-800/70 px-4 py-2 rounded-md border border-yellow-500/30 hover:border-yellow-500/50 transition-all shadow-md"
            >
                &larr; Voltar para o Castelo
            </button>

            <div className="relative mission-scroll-background rounded-lg p-8" data-container="task-view">
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-medieval text-gray-800">{mission.title}</h2>
                    <p className="text-yellow-900/80 mt-2">Complete as tarefas para desvendar o segredo final.</p>
                </div>

                <div className="p-4">
                    <ul className="space-y-4">
                        {mission.tasks.map(task => (
                            <li
                                key={task.id}
                                ref={(el) => { taskRefs.current.set(task.id, el); }}
                                onClick={() => handleTaskClick(task)}
                                className={`flex items-center p-3 rounded-md transition-all duration-300 ${task.isCompleted ? 'bg-black/5' : 'bg-transparent hover:bg-black/10'} ${animatingTask || task.isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <CustomCheckbox isCompleted={task.isCompleted} isAnimating={animatingTask?.id === task.id} />
                                <span className={`ml-4 text-2xl font-medieval ${task.isCompleted ? 'text-yellow-900/50 line-through' : 'text-gray-800'}`}>{task.name}</span>
                            </li>
                        ))}
                    </ul>
                    {allTasksCompleted && (
                        <div className="mt-10 text-center animate-fade-in-up">
                            <button
                                onClick={onStartQuiz}
                                className="px-8 py-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 animate-pulse-strong border-2 border-yellow-700/50 shadow-lg"
                            >
                                Enfrentar o Desafio Final
                            </button>
                        </div>
                    )}
                </div>

                {animatingTask && <CheckAnimation taskElement={animatingTask.element} />}
            </div>
        </div>
    </div>
  );
};