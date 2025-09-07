import React from 'react';
import { Mission, Task } from '../types';

interface TaskViewProps {
  mission: Mission;
  onBack: () => void;
  onTaskCheck: (missionId: string, taskId: string, isChecked: boolean) => void;
  onStartQuiz: () => void;
}

export const TaskView: React.FC<TaskViewProps> = ({ mission, onBack, onTaskCheck, onStartQuiz }) => {
  const allTasksCompleted = mission.tasks.every(task => task.isCompleted);

  return (
    <div className="animate-fade-in w-full">
        <div className="p-6 border-b border-gray-700">
            <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-200 mb-2">&larr; Voltar para Missões</button>
            <h2 className="text-3xl font-bold text-white">{mission.title}</h2>
            <p className="text-gray-400 mt-1">Conclua todas as tarefas para desbloquear o desafio final.</p>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {mission.tasks.map(task => (
              <li key={task.id}>
                <label className={`flex items-center p-4 rounded-md border border-gray-700 transition-all duration-200 cursor-pointer ${task.isCompleted ? 'bg-teal-900/30' : 'bg-gray-900/50 hover:border-yellow-600'}`}>
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={(e) => onTaskCheck(mission.id, task.id, e.target.checked)}
                        className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-600"
                    />
                    <span className={`ml-4 text-lg ${task.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{task.name}</span>
                </label>
              </li>
            ))}
          </ul>
           {allTasksCompleted && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={onStartQuiz}
                        className="px-8 py-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 animate-pulse-strong"
                    >
                        Testar minhas novas habilidades
                    </button>
                </div>
           )}
        </div>
    </div>
  );
};