import React, { useState, useEffect } from 'react';
import { Journey, Mission, Task, Quiz, PlayerStats, CharacterState, MissionStatus } from './types';
import { FolderSelector } from './components/FolderSelector';
import { JourneyDashboard } from './components/StudyJourney';
import { MissionDetailModal } from './components/MissionDetailModal';
import { JourneyDetailModal } from './components/JourneyDetailModal';
import { QuizModal } from './components/QuizModal';
import { PlayerStats as PlayerStatsComponent } from './components/PlayerStats';
import { CharacterGuide } from './components/CharacterGuide';
import { generateQuizFromTitles } from './services/geminiService';

const App: React.FC = () => {
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [playerStats, setPlayerStats] = useState<PlayerStats>({ score: 0, level: 1, lives: 3 });
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [missionForQuiz, setMissionForQuiz] = useState<Mission | null>(null);
    
    const [characterState, setCharacterState] = useState<CharacterState>('idle');
    const [characterMessage, setCharacterMessage] = useState('');
    const [isCharacterVisible, setIsCharacterVisible] = useState(false);

    const SCORE_PER_QUIZ = 100;
    const SCORE_TO_LEVEL_UP = 500;

    const showCharacterMessage = (message: string, state: CharacterState = 'idle', duration: number = 5000) => {
        setCharacterMessage(message);
        setCharacterState(state);
        setIsCharacterVisible(true);
        setTimeout(() => setIsCharacterVisible(false), duration);
    };

    useEffect(() => {
        showCharacterMessage('Olá, guerreiro do código! Estou aqui para guiar sua jornada. Selecione sua pasta de estudos para começarmos.', 'idle', 6000);
    }, []);

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
                // FIX: Explicitly cast the status string literal to MissionStatus to satisfy TypeScript.
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
        showCharacterMessage("Analisando seus pergaminhos de estudo... Um momento, jovem guerreiro.", 'thinking');
        setTimeout(() => {
            const structuredData = processFiles(files);
            setJourneys(structuredData);
            setIsLoading(false);
            if (structuredData.length > 0) {
                showCharacterMessage("Sua jornada foi mapeada! Selecione seu primeiro desafio.", 'success');
            } else {
                 showCharacterMessage("Hmm, não consegui entender a estrutura dos diretórios. Lembre-se: Jornada / Missão / Tarefas.", 'fail');
            }
        }, 1500);
    };

    const handleJourneySelect = (journey: Journey) => {
        setSelectedJourney(journey);
    };
    
    const handleCloseJourneyDetail = () => {
        setSelectedJourney(null);
    };

    const handleMissionSelect = (mission: Mission) => {
        setSelectedMission(mission);
    };

    const handleCloseMissionDetail = () => {
        if (!selectedMission) return;

        // Find the mission in the current state to check if it's completed
        const currentJourney = journeys.find(j => j.id === selectedMission.id.split('/')[0]);
        const missionInState = currentJourney?.missions.find(m => m.id === selectedMission.id);

        if (missionInState && missionInState.tasks.every(t => t.isCompleted) && missionInState.status !== 'completed') {
             setTimeout(() => {
                setMissionForQuiz(missionInState);
                showCharacterMessage(`Treinamento concluído! Prepare-se para o desafio final.`, 'thinking', 7000);
                generateAndShowQuiz(missionInState);
             }, 500); // Short delay for a smoother transition
        }
        setSelectedMission(null);
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
        if (selectedMission) {
            setSelectedMission(prev => prev ? {
                ...prev,
                tasks: prev.tasks.map(task => task.id === taskId ? { ...task, isCompleted: isChecked } : task)
            } : null);
        }
    };


    const generateAndShowQuiz = async (mission: Mission) => {
        setIsLoading(true);
        const journey = journeys.find(j => j.missions.some(m => m.id === mission.id));
        if (!journey) {
            setIsLoading(false);
            return;
        }

        const taskTitles = mission.tasks.map(t => t.name);
        const quiz = await generateQuizFromTitles(journey.title, mission.title, taskTitles);
        
        if (quiz) {
            setActiveQuiz(quiz);
        } else {
            showCharacterMessage("Não foi possível criar o desafio. Verifique sua conexão com a internet e tente novamente.", 'fail');
        }
        setIsLoading(false);
    };
    
    const updateProgression = (completedMissionId: string) => {
        setJourneys(prevJourneys => {
            const newJourneys = JSON.parse(JSON.stringify(prevJourneys));
            let completedJourneyId: string | null = null;

            for (const journey of newJourneys) {
                const missionIndex = journey.missions.findIndex((m: Mission) => m.id === completedMissionId);
                if (missionIndex !== -1) {
                    journey.missions[missionIndex].status = 'completed';

                    if (missionIndex + 1 < journey.missions.length) {
                        journey.missions[missionIndex + 1].status = 'unlocked';
                    } else { // Last mission of the journey
                        if (journey.missions.every((m: Mission) => m.status === 'completed')) {
                            journey.status = 'completed';
                            completedJourneyId = journey.id;
                        }
                    }
                    break;
                }
            }

            if (completedJourneyId) {
                const journeyIndex = newJourneys.findIndex((j: Journey) => j.id === completedJourneyId);
                if (journeyIndex + 1 < newJourneys.length) {
                    newJourneys[journeyIndex + 1].status = 'unlocked';
                    if (newJourneys[journeyIndex + 1].missions.length > 0) {
                        newJourneys[journeyIndex + 1].missions[0].status = 'unlocked';
                    }
                }
            }
            return newJourneys;
        });
    };


    const handleQuizSubmit = (answer: string) => {
        if (!activeQuiz || !missionForQuiz) return;
        const isCorrect = answer === activeQuiz.correctAnswer;
        if (isCorrect) {
            setPlayerStats(prev => {
                const newScore = prev.score + SCORE_PER_QUIZ;
                const newLevel = Math.floor(newScore / SCORE_TO_LEVEL_UP) + 1;
                if (newLevel > prev.level) {
                     showCharacterMessage(`Subiu de nível! Você alcançou o nível ${newLevel}!`, 'success', 6000);
                } else {
                    showCharacterMessage("Resposta correta! Sua sabedoria cresce a cada desafio.", 'success');
                }
                return { ...prev, score: newScore, level: newLevel };
            });
            updateProgression(missionForQuiz.id);
        } else {
            setPlayerStats(prev => ({ ...prev, lives: Math.max(0, prev.lives - 1) }));
            showCharacterMessage("Incorreto. Mas não desanime, cada erro é uma lição aprendida.", 'fail');
        }
        setActiveQuiz(null);
        setMissionForQuiz(null);
    };
    
    const levelUpScore = playerStats.level * SCORE_TO_LEVEL_UP;

    if (playerStats.lives <= 0) {
        return (
             <main className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-5xl font-bold text-red-500 mb-4">Fim de Jogo</h1>
                <p className="text-xl text-gray-300 mb-8">Você ficou sem vidas. Atualize a página para tentar novamente.</p>
            </main>
        );
    }
    
    if (journeys.length === 0) {
        return (
            <main className="bg-gray-900 text-white min-h-screen">
                <FolderSelector onFilesSelected={handleFilesSelected} isLoading={isLoading} />
                <CharacterGuide message={characterMessage} isVisible={isCharacterVisible} state={characterState} />
            </main>
        );
    }

    return (
        <main className="bg-gray-900 text-white min-h-screen">
            <PlayerStatsComponent stats={playerStats} levelUpScore={levelUpScore} />
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <JourneyDashboard journeys={journeys} onJourneySelect={handleJourneySelect} />
            </div>
            {selectedJourney && (
                 <JourneyDetailModal
                    journey={selectedJourney}
                    onClose={handleCloseJourneyDetail}
                    onMissionSelect={handleMissionSelect}
                 />
            )}
            {selectedMission && (
                <MissionDetailModal 
                    mission={selectedMission}
                    onClose={handleCloseMissionDetail}
                    onTaskCheck={handleTaskCheck}
                />
            )}
            {activeQuiz && missionForQuiz && (
                <QuizModal 
                    quiz={activeQuiz}
                    missionTitle={missionForQuiz.title}
                    onClose={() => { setActiveQuiz(null); setMissionForQuiz(null); }}
                    onSubmit={handleQuizSubmit}
                />
            )}
            <CharacterGuide message={characterMessage} isVisible={isCharacterVisible} state={characterState} />
        </main>
    );
};

export default App;