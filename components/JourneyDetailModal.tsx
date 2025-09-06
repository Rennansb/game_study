import React from 'react';
import { Journey, Mission } from '../types';

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-300">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
    </svg>
);

const MissionCard: React.FC<{ mission: Mission; onSelect: () => void; }> = ({ mission, onSelect }) => {
    const baseClasses = "border rounded-lg p-4 transition-all duration-300 transform text-left w-full";
    const statusClasses = {
        locked: "bg-gray-800/50 border-gray-700 filter grayscale cursor-not-allowed",
        unlocked: "bg-gray-800 border-green-700/50 hover:border-green-500 hover:shadow-lg hover:-translate-y-1",
        completed: "bg-gray-900/60 border-gray-800 opacity-70"
    };

    return (
        <button className={`${baseClasses} ${statusClasses[mission.status]}`} onClick={mission.status !== 'locked' ? onSelect : undefined} disabled={mission.status === 'locked'}>
            <div className="flex justify-between items-center">
                <h3 className={`font-bold ${mission.status === 'unlocked' ? 'text-green-400' : 'text-gray-400'}`}>{mission.title}</h3>
                {mission.status === 'completed' && <div className="flex items-center text-xs font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full"><CheckIcon /></div>}
                {mission.status === 'locked' && <LockIcon />}
            </div>
            <p className="text-xs text-gray-500 mt-1">{mission.tasks.length} {mission.tasks.length === 1 ? 'tarefa' : 'tarefas'}</p>
        </button>
    );
};

interface JourneyDetailModalProps {
  journey: Journey;
  onClose: () => void;
  onMissionSelect: (mission: Mission) => void;
}

export const JourneyDetailModal: React.FC<JourneyDetailModalProps> = ({ journey, onClose, onMissionSelect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-green-500/50 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-green-400">{journey.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journey.missions.map(mission => (
                    <MissionCard key={mission.id} mission={mission} onSelect={() => onMissionSelect(mission)} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};