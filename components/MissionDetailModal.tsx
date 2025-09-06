import React from 'react';
import { Mission, Task } from '../types';

interface MissionDetailModalProps {
  mission: Mission;
  onClose: () => void;
  onTaskCheck: (missionId: string, taskId: string, isChecked: boolean) => void;
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({ mission, onClose, onTaskCheck }) => {
  const allTasksCompleted = mission.tasks.every(task => task.isCompleted);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-green-500/50 rounded-lg shadow-lg w-full max-w-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-green-400">{mission.title}</h2>
            <p className="text-gray-400">Marque as tarefas que você já concluiu.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-3">
            {mission.tasks.map(task => (
              <li key={task.id}>
                <label className={`flex items-center p-4 rounded-md border border-gray-700 transition-all duration-200 cursor-pointer ${task.isCompleted ? 'bg-green-900/30' : 'bg-gray-900/50 hover:border-green-600'}`}>
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={(e) => onTaskCheck(mission.id, task.id, e.target.checked)}
                        className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-600"
                    />
                    <span className={`ml-4 text-lg ${task.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{task.name}</span>
                </label>
              </li>
            ))}
          </ul>
           {allTasksCompleted && (
                <div className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-md text-center">
                    <p className="font-bold text-green-300">Treinamento concluído! Feche esta janela para iniciar seu desafio final.</p>
                </div>
           )}
        </div>
         <div className="p-4 bg-gray-900/50 rounded-b-lg flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium rounded-md text-gray-900 bg-green-400 hover:bg-green-500 transition-colors duration-300"
            >
              Fechar
            </button>
        </div>
      </div>
    </div>
  );
};