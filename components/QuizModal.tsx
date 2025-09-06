import React, { useState, useEffect } from 'react';
import { Quiz } from '../types';

interface QuizModalProps {
  quiz: Quiz;
  missionTitle: string;
  onClose: () => void;
  onSubmit: (answer: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, missionTitle, onClose, onSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }, [quiz]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswer) {
      setIsSubmitted(true);
      setTimeout(() => {
        onSubmit(selectedAnswer);
      }, 2000); // Wait 2s to show feedback before closing
    }
  };

  const getOptionClass = (option: string) => {
    if (!isSubmitted) {
      return selectedAnswer === option
        ? 'bg-green-900/50 border-green-500'
        : 'bg-gray-900 border-gray-700 hover:border-green-600';
    }

    const isCorrect = option === quiz.correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
      return 'bg-green-500/80 border-green-400 animate-pulse'; // Correct answer
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-500/80 border-red-400'; // Selected and wrong
    }
    return 'bg-gray-900 border-gray-700 opacity-50'; // Not selected
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-green-500/50 rounded-lg shadow-lg w-full max-w-2xl animate-fade-in">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-green-400">Desafio da Missão: <span className="text-white">{missionTitle}</span></h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <p className="text-white text-xl mb-6">{quiz.question}</p>
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
                    className="h-4 w-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-600"
                    disabled={isSubmitted}
                  />
                  <span className="ml-3 text-white text-lg">{option}</span>
                </label>
              ))}
            </fieldset>
            {isSubmitted && (
                <div className="mt-4 p-4 bg-gray-900/70 rounded-md border border-gray-700">
                    <p className="text-sm text-green-300 font-bold">Explicação:</p>
                    <p className="text-gray-300">{quiz.explanation}</p>
                </div>
            )}
          </div>
          <div className="p-4 bg-gray-900/50 rounded-b-lg flex justify-end items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitted}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedAnswer || isSubmitted}
              className="px-6 py-2 text-sm font-medium rounded-md text-gray-900 bg-green-400 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isSubmitted ? 'Verificando...' : 'Enviar Resposta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};