export interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
  file: File;
}

export type MissionStatus = 'locked' | 'unlocked' | 'completed';

export interface Mission {
  id: string; // Composite ID like "Jornada-Dart/01-Introducao"
  title: string;
  tasks: Task[];
  status: MissionStatus;
}

export interface Journey {
  id: string;
  title: string;
  missions: Mission[];
  status: MissionStatus;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PlayerStats {
  score: number;
  level: number;
  lives: number;
}

export type CharacterState = 'idle' | 'thinking' | 'success' | 'fail' | 'moving';
export type AppView = 'journeys' | 'missions' | 'tasks' | 'quiz' | 'summary' | 'game_over';