import React, { useState, useEffect, useCallback } from 'react';
import { Journey, Mission, Task, Quiz, PlayerStats as PlayerStatsType, CharacterState, AppView, MissionStatus } from './types';
import { FolderSelector } from './components/FolderSelector';
import { JourneyMap } from './components/StudyJourney';
import { TaskView } from './components/MissionDetailModal';
import { MissionMap } from './components/JourneyDetailModal';
import { QuizView } from './components/QuizModal';
import { PlayerStats } from './components/PlayerStats';
import { CharacterGuide } from './components/CharacterGuide';
import { MissionSummary } from './components/MissionSummary';
import { generateQuizFromTitles, generateMissionSummary } from './services/geminiService';

const STORAGE_KEY = 'studyJourneyProgress';
const INITIAL_STATS: PlayerStatsType = { score: 0, level: 1, lives: 3 };

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('journeys');
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [playerStats, setPlayerStats] = useState<PlayerStatsType>(INITIAL_STATS);
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [missionForQuiz, setMissionForQuiz] = useState<Mission | null>(null);
    const [missionSummary, setMissionSummary] = useState('');
    const [missionJustCompleted, setMissionJustCompleted] = useState<string | null>(null);
    
    const [characterState, setCharacterState] = useState<CharacterState>('idle');
    const [characterMessage, setCharacterMessage] = useState('');
    const [isCharacterVisible, setIsCharacterVisible] = useState(false);
    const [showSaveNotification, setShowSaveNotification] = useState(false);

    const SCORE_PER_QUIZ = 100;
    const SCORE_TO_LEVEL_UP = 500;

    const saveProgress = (journeysToSave: Journey[], statsToSave: PlayerStatsType) => {
        try {
            const dataToSave = {
                journeys: journeysToSave,
                playerStats: statsToSave,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            setShowSaveNotification(true);
            setTimeout(() => setShowSaveNotification(false), 3000);
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    };

    useEffect(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const { journeys: savedJourneys, playerStats: savedStats } = JSON.parse(savedData);
                if (savedJourneys && savedJourneys.length > 0) {
                    setJourneys(savedJourneys);
                    setPlayerStats(savedStats);
                    showCharacterMessage('Bem-vindo de volta! Continue de onde parou.', 'idle', 5000);
                }
            } else {
                showCharacterMessage('Olá, herói do código! Estou aqui para guiar sua jornada. Selecione sua pasta de estudos para começarmos.', 'idle', 6000);
            }
        } catch (error) {
            console.error("Failed to load progress:", error);
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const showCharacterMessage = (message: string, state: CharacterState = 'idle', duration: number = 5000) => {
        setCharacterMessage(message);
        setCharacterState(state);
        setIsCharacterVisible(true);
        const timer = setTimeout(() => setIsCharacterVisible(false), duration);
        return () => clearTimeout(timer);
    };

    const processFiles = (files: File[]): Journey[] => {
        const journeyMap: { [key: string]: { missions: { [key: string]: Mission } } } = {};

        files.forEach(file => {
            const pathParts = file.webkitRelativePath.split('/');
            if (pathParts.length < 3 || pathParts[pathParts.length - 1].startsWith('.')) return;

            const journeyName = pathParts[pathParts.length - 3];
            const missionName = pathParts[pathParts.length - 2];
            const taskName = file.name.replace(/\.[^/.]+$/, "");

            if (!journeyMap[journeyName]) {
                journeyMap[journeyName] = { missions: {} };
            }

            const missionId = `${journeyName}/${missionName}`;
            if (!journeyMap[journeyName].missions[missionId]) {
                journeyMap[journeyName].missions[missionId] = {
                    id: missionId,
                    title: missionName.replace(/^\d+[-_.\s]*/, '').replace(/_/g, ' ').replace(/-/g, ' '),
                    tasks: [],
                    status: 'locked'
                };
            }
            
            journeyMap[journeyName].missions[missionId].tasks.push({
                id: `${missionId}/${file.name}`,
                name: taskName.replace(/_/g, ' ').replace(/-/g, ' '),
                isCompleted: false,
                file: file
            });
        });

        const allJourneys: Journey[] = Object.keys(journeyMap).map(journeyName => {
            const missions = Object.values(journeyMap[journeyName].missions).sort((a, b) => a.id.localeCompare(b.id));
            missions.forEach(mission => mission.tasks.sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true })));

            return {
                id: journeyName,
                title: journeyName.replace(/_/g, ' ').replace(/-/g, ' '),
                missions: missions,
                status: 'locked' as MissionStatus,
            };
        }).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
        
        if (allJourneys.length > 0) {
            allJourneys[0].status = 'unlocked';
            if (allJourneys[0].missions.length > 0) {
                allJourneys[0].missions[0].status = 'unlocked';
            }
        }
        
        return allJourneys;
    };
    
    const handleFilesSelected = (files: File[]) => {
        setIsLoading(true);
        showCharacterMessage("Analisando seus pergaminhos de estudo... Um momento, jovem herói.", 'thinking');
        setTimeout(() => {
            const structuredData = processFiles(files);
            setJourneys(structuredData);
            setPlayerStats(INITIAL_STATS);
            setIsLoading(false);
            if (structuredData.length > 0) {
                showCharacterMessage("Seu mapa foi traçado! Selecione sua primeira jornada.", 'success');
            } else {
                 showCharacterMessage("Hmm, não entendi a estrutura dos diretórios. Lembre-se: Jornada / Missão / Tarefas.", 'fail');
            }
        }, 1500);
    };

    const handleChangeCourse = () => {
        if (window.confirm("Você tem certeza que quer trocar de curso? Todo o seu progresso atual será perdido.")) {
            localStorage.removeItem(STORAGE_KEY);
            setJourneys([]);
            setPlayerStats(INITIAL_STATS);
            setSelectedJourney(null);
            setSelectedMission(null);
            setView('journeys');
        }
    };

    const handleJourneySelect = (journey: Journey) => {
        setSelectedJourney(journey);
        setView('missions');
    };
    
    const handleMissionSelect = (mission: Mission) => {
        setSelectedMission(mission);
        setView('tasks');
    };

    const handleStartQuiz = (mission: Mission) => {
        setMissionForQuiz(mission);
        setView('quiz');
        showCharacterMessage(`Prepare-se para o desafio final da missão!`, 'thinking', 7000);
        generateAndShowQuiz(mission);
    };

    const handleTaskCheck = (missionId: string, taskId: string, isChecked: boolean) => {
        const updateState = (items: Journey[]): Journey[] => {
            return items.map(journey => ({
                ...journey,
                missions: journey.missions.map(mission => {
                    if (mission.id === missionId) {
                        const updatedTasks = mission.tasks.map(task => 
                            task.id === taskId ? { ...task, isCompleted: isChecked } : task
                        );
                        return { ...mission, tasks: updatedTasks };
                    }
                    return mission;
                })
            }));
        };
        setJourneys(updateState);
    };

    const generateAndShowQuiz = async (mission: Mission) => {
        setIsLoading(true);
        const journey = journeys.find(j => j.missions.some(m => m.id === mission.id));
        if (!journey) {
            setIsLoading(false); return;
        }

        const taskTitles = mission.tasks.map(t => t.name);
        const quiz = await generateQuizFromTitles(journey.title, mission.title, taskTitles);
        
        if (quiz) {
            setActiveQuiz(quiz);
        } else {
            showCharacterMessage("Não foi possível criar o desafio. Tente novamente.", 'fail');
            setView('tasks'); // Go back
        }
        setIsLoading(false);
    };
    
    const updateProgression = (currentJourneys: Journey[], completedMissionId: string): { updatedJourneys: Journey[], nextMissionToStart: Mission | null } => {
        const newJourneys = JSON.parse(JSON.stringify(currentJourneys)) as Journey[];
        let nextMissionToStart: Mission | null = null;
        let completedJourneyIndex: number | null = null;
        let journeyWasCompleted = false;

        for (let i = 0; i < newJourneys.length; i++) {
            const journey = newJourneys[i];
            const missionIndex = journey.missions.findIndex(m => m.id === completedMissionId);

            if (missionIndex !== -1) {
                journey.missions[missionIndex].status = 'completed';

                if (missionIndex + 1 < journey.missions.length) {
                    journey.missions[missionIndex + 1].status = 'unlocked';
                    nextMissionToStart = journey.missions[missionIndex + 1];
                } else {
                    journey.status = 'completed';
                    journeyWasCompleted = true;
                    completedJourneyIndex = i;
                }
                break; 
            }
        }

        if (journeyWasCompleted && completedJourneyIndex !== null && completedJourneyIndex + 1 < newJourneys.length) {
            const nextJourney = newJourneys[completedJourneyIndex + 1];
            nextJourney.status = 'unlocked';
            if (nextJourney.missions.length > 0) {
                nextJourney.missions[0].status = 'unlocked';
                nextMissionToStart = null;
            }
        }

        return { updatedJourneys: newJourneys, nextMissionToStart };
    };


    const handleQuizSubmit = async (answer: string) => {
        if (!activeQuiz || !missionForQuiz) return;
        const isCorrect = answer === activeQuiz.correctAnswer;
        setActiveQuiz(null); 

        if (isCorrect) {
            setIsLoading(true);
            
            const newScore = playerStats.score + SCORE_PER_QUIZ;
            const newLevel = Math.floor(newScore / SCORE_TO_LEVEL_UP) + 1;
            const newStats = { ...playerStats, score: newScore, level: newLevel };
            setPlayerStats(newStats);

            if (newLevel > playerStats.level) {
                 showCharacterMessage(`Subiu de nível! Você alcançou o nível ${newLevel}!`, 'success', 6000);
            } else {
                showCharacterMessage("Resposta correta! Sua sabedoria cresce.", 'success');
            }
            
            const journey = journeys.find(j => j.id === missionForQuiz.id.split('/')[0]);
            const taskTitles = missionForQuiz.tasks.map(t => t.name);
            const summary = await generateMissionSummary(journey?.title || '', missionForQuiz.title, taskTitles);
            setMissionSummary(summary);
            setIsLoading(false);
            setView('summary');

        } else {
             const newStats = { ...playerStats, lives: Math.max(0, playerStats.lives - 1) };
             setPlayerStats(newStats);
             saveProgress(journeys, newStats);
            showCharacterMessage("Incorreto. Mas não desanime, cada erro é uma lição.", 'fail');
            setView('tasks'); // Go back to tasks to try again
        }
    };
    
    const handleFinishMission = () => {
        if (!missionForQuiz) return;

        const { updatedJourneys, nextMissionToStart } = updateProgression(journeys, missionForQuiz.id);
        
        saveProgress(updatedJourneys, playerStats);
        setJourneys(updatedJourneys);
        setMissionJustCompleted(missionForQuiz.id);
        
        const journeyOfCompletedMission = updatedJourneys.find(j => j.id === missionForQuiz.id.split('/')[0]);
        if (journeyOfCompletedMission) {
            setSelectedJourney(journeyOfCompletedMission);
        }
        
        setMissionForQuiz(null);
        setMissionSummary('');

        if (nextMissionToStart) {
            setView('missions');
        } else {
            // Journey is complete, or it's the last journey.
            setView('missions'); // Go to missions briefly to show final completed state
            setTimeout(() => {
                setView('journeys');
                showCharacterMessage("Jornada Concluída! Você é imparável!", 'success');
            }, 1800);
        }
    };

    const handleAnimationComplete = useCallback(() => {
        setMissionJustCompleted(null);
        const currentJourney = journeys.find(j => j.id === selectedJourney?.id);
        if (currentJourney) {
            const nextMission = currentJourney.missions.find(m => m.status === 'unlocked');
            if (nextMission) {
                showCharacterMessage(`Ótimo! O próximo desafio, "${nextMission.title}", está liberado. Clique nele para começar!`, 'idle', 7000);
            }
        }
    }, [journeys, selectedJourney]);


    const levelUpScore = playerStats.level * SCORE_TO_LEVEL_UP;

    const renderContent = () => {
        if (journeys.length === 0) {
            return <FolderSelector onFilesSelected={handleFilesSelected} isLoading={isLoading} />;
        }
        switch(view) {
            case 'journeys':
                return <JourneyMap journeys={journeys} onJourneySelect={handleJourneySelect} />;
            case 'missions':
                 if (!selectedJourney) { setView('journeys'); return null; }
                const currentJourneyState = journeys.find(j => j.id === selectedJourney.id) || selectedJourney;
                return <MissionMap 
                            journey={currentJourneyState} 
                            onMissionSelect={handleMissionSelect} 
                            onBack={() => setView('journeys')}
                            missionJustCompleted={missionJustCompleted}
                            onAnimationComplete={handleAnimationComplete}
                        />;
            case 'tasks':
                if (!selectedMission) { setView('missions'); return null; }
                const currentMissionState = journeys.flatMap(j => j.missions).find(m => m.id === selectedMission.id) || selectedMission;
                return <TaskView 
                            mission={currentMissionState} 
                            onTaskCheck={handleTaskCheck}
                            onStartQuiz={() => handleStartQuiz(currentMissionState)}
                            onBack={() => setView('missions')}
                        />;
            case 'quiz':
                 if (!missionForQuiz) { setView('tasks'); return null; }
                return <QuizView 
                            quiz={activeQuiz}
                            missionTitle={missionForQuiz.title}
                            isLoading={isLoading}
                            onSubmit={handleQuizSubmit}
                            onCancel={() => setView('tasks')}
                        />;
            case 'summary':
                if (!missionForQuiz) { setView('missions'); return null; }
                return <MissionSummary
                            missionTitle={missionForQuiz.title}
                            summary={missionSummary}
                            onFinish={handleFinishMission}
                        />;
            case 'game_over':
                return (
                    <div className="text-center p-4">
                        <h1 className="text-5xl font-bold text-red-500 mb-4">Fim de Jogo</h1>
                        <p className="text-xl text-gray-300 mb-8">Você ficou sem vidas. Atualize a página para recomeçar sua jornada.</p>
                    </div>
                );
            default:
                return <div>Carregando...</div>;
        }
    };

    useEffect(() => {
        if (playerStats.lives <= 0) {
            setView('game_over');
        }
    }, [playerStats.lives]);

    return (
        <main className="bg-gray-900 text-white min-h-screen">
             {journeys.length === 0 ? (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-5xl font-bold text-yellow-400 animate-fade-in">Missão de Estudo</h1>
                 </div>
             ) : (
                view !== 'game_over' && <PlayerStats stats={playerStats} levelUpScore={levelUpScore} onChangeCourse={handleChangeCourse} />
             )}
             
             <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                 {renderContent()}
             </div>

             {showSaveNotification && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-yellow-300 px-4 py-2 rounded-lg shadow-lg z-50 animate-save-notification">
                    Progresso Salvo!
                </div>
            )}
             
             <CharacterGuide message={characterMessage} isVisible={isCharacterVisible} state={characterState} />
        </main>
    );
};

export default App;