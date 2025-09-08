
import React, { useState, useEffect } from 'react';
import { Quiz } from '../types';
import { playSound, SoundEffect } from '../services/soundService';

interface QuizViewProps {
  quiz: Quiz | null;
  missionTitle: string;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (answer: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, missionTitle, isLoading, onCancel, onSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }, [quiz]);

  if (isLoading || !quiz) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <svg className="animate-spin h-10 w-10 text-yellow-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-yellow-400">Criando seu Desafio...</h2>
            <p className="text-gray-400">O mestre está forjando uma pergunta digna de sua habilidade.</p>
        </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswer) {
      playSound(SoundEffect.ButtonClick);
      setIsSubmitted(true);
      setTimeout(() => {
        onSubmit(selectedAnswer);
      }, 2000); // Wait 2s to show feedback before closing
    }
  };

  const handleCancel = () => {
    playSound(SoundEffect.ButtonClick);
    onCancel();
  };

  const getOptionClass = (option: string) => {
    if (!isSubmitted) {
      return selectedAnswer === option
        ? 'bg-yellow-900/50 border-yellow-500'
        : 'bg-gray-900 border-gray-700 hover:border-yellow-600';
    }

    const isCorrect = option === quiz.correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
      return 'bg-teal-500/80 border-teal-400 animate-pulse'; // Correct answer
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-500/80 border-red-400'; // Selected and wrong
    }
    return 'bg-gray-900 border-gray-700 opacity-50'; // Not selected
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <div className="p-6 border-b border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-yellow-400">Desafio da Missão: <span className="text-white">{missionTitle}</span></h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <p className="text-white text-xl mb-6 text-center">{quiz.question}</p>
            <fieldset disabled={isSubmitted} className="space-y-3">
              {quiz.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-md border-2 cursor-pointer transition-all duration-300 ${getOptionClass(option)}`}
                >
                  <input
                    type="radio"
                    name="quiz-option"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => setSelectedAnswer(option)}
                    className="h-4 w-4 text-yellow-500 bg-gray-700 border-gray-600 focus:ring-yellow-600"
                    disabled={isSubmitted}
                  />
                  <span className="ml-3 text-white text-lg">{option}</span>
                </label>
              ))}
            </fieldset>
            {isSubmitted && (
                <div className="mt-4 p-4 bg-gray-900/70 rounded-md border border-gray-700">
                    <p className="text-sm text-yellow-300 font-bold">Explicação:</p>
                    <p className="text-gray-300">{quiz.explanation}</p>
                </div>
            )}
          </div>
          <div className="p-4 flex justify-center items-center space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitted}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedAnswer || isSubmitted}
              className="px-6 py-2 text-sm font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isSubmitted ? 'Verificando...' : 'Enviar Resposta'}
            </button>
          </div>
        </form>
    </div>
  );
};