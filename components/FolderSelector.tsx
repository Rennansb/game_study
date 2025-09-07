import React, { useRef } from 'react';

interface FolderSelectorProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({ onFilesSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }
    onFilesSelected(Array.from(selectedFiles));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900 min-h-[calc(100vh-150px)] animate-fade-in-up">
        <div className="max-w-2xl">
            <p className="text-gray-400 mb-8 text-lg">
                A estrutura ideal é: <strong className="text-yellow-300">Jornada / Missão / Tarefa</strong>.
                Cada <strong className="text-yellow-300">pasta de primeiro nível</strong> é uma Jornada. Dentro dela, cada <strong className="text-yellow-300">subpasta numerada</strong> é uma Missão. Selecione o diretório raiz com todas as suas Jornadas.
            </p>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
                {...{ webkitdirectory: "", directory: "", multiple: true }}
            />
            <button
                onClick={handleFolderSelectClick}
                disabled={isLoading}
                className="w-full px-8 py-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-xl"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analisando Diretórios...
                    </>
                ) : (
                    'Selecionar Pasta de Jornadas'
                )}
            </button>
        </div>
    </div>
  );
};