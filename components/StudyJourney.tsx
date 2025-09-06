import React from 'react';
import { Journey } from '../types';

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className ?? ''}`}>
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
    </svg>
);


const JourneyCard: React.FC<{ journey: Journey; onSelect: () => void; index: number }> = ({ journey, onSelect, index }) => {
    const progress = (journey.missions.filter(m => m.status === 'completed').length / (journey.missions.length || 1)) * 100;
    
    const baseClasses = "aspect-square border rounded-lg p-6 flex flex-col justify-between transition-all duration-300 transform group";
    const statusClasses = {
        locked: "bg-gray-800/50 border-gray-700 filter grayscale cursor-not-allowed",
        unlocked: "bg-gray-800 border-green-700/50 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2",
        completed: "bg-green-900/40 border-green-400/50"
    };
    const animationStyle = { animationDelay: `${index * 100}ms` };

    return (
        <div className="animate-card-flip-in" style={animationStyle}>
            <button className={`${baseClasses} ${statusClasses[journey.status]}`} onClick={journey.status !== 'locked' ? onSelect : undefined} disabled={journey.status === 'locked'}>
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className={`text-2xl font-bold ${journey.status === 'unlocked' ? 'text-green-400' : journey.status === 'completed' ? 'text-green-300' : 'text-gray-400'}`}>{journey.title}</h3>
                         {journey.status === 'locked' && <LockIcon />}
                         {journey.status === 'completed' && <div className="p-1 bg-green-500/20 rounded-full"><CheckIcon className="text-green-300" /></div>}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{journey.missions.length} {journey.missions.length === 1 ? 'missão' : 'missões'}</p>
                </div>
                <div>
                     <div className="text-xs text-right mb-1 text-gray-400">
                        {Math.round(progress)}%
                     </div>
                     <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                     </div>
                </div>
            </button>
        </div>
    );
};

interface JourneyDashboardProps {
    journeys: Journey[];
    onJourneySelect: (journey: Journey) => void;
}

export const JourneyDashboard: React.FC<JourneyDashboardProps> = ({ journeys, onJourneySelect }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Seu Caminho do Mestre</h2>
                <p className="text-gray-400">Conclua uma jornada para desbloquear a próxima. Clique em um card para ver as missões.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {journeys.map((journey, index) => (
                    <JourneyCard key={journey.id} journey={journey} onSelect={() => onJourneySelect(journey)} index={index} />
                ))}
            </div>
        </div>
    );
};