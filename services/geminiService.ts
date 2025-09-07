import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING }
    },
    required: ["question", "options", "correctAnswer", "explanation"]
};

export const generateQuizFromTitles = async (journeyTitle: string, missionTitle: string, taskTitles: string[]): Promise<Quiz | null> => {
    try {
        const prompt = `
            Você é um criador de quizzes para um estudante de programação.
            Crie um quiz desafiador para avaliar o conhecimento do usuário sobre a missão "${missionTitle}", que faz parte da jornada de estudos "${journeyTitle}".
            As tarefas dentro desta missão são: ${taskTitles.join(', ')}.
            Use os títulos da jornada, missão e tarefas para inferir o conteúdo e criar uma pergunta relevante e específica.
            
            Gere uma pergunta de múltipla escolha com 4 opções.
            Indique a resposta correta e forneça uma breve explicação do porquê.
            A resposta correta DEVE estar entre as opções.
            Não inclua a formatação markdown 'json' no início ou no fim da sua resposta.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });

        const text = response.text;
        const quizData = JSON.parse(text);

        if (quizData.question && quizData.options && quizData.options.length > 0 && quizData.correctAnswer && quizData.explanation) {
             if (!quizData.options.includes(quizData.correctAnswer)) {
                quizData.options[Math.floor(Math.random() * 3)] = quizData.correctAnswer;
            }
            return quizData as Quiz;
        } else {
            console.error("Generated quiz data is invalid:", quizData);
            return null;
        }
    } catch (error) {
        console.error("Error generating quiz with Gemini API:", error);
        return null;
    }
};

export const generateMissionSummary = async (journeyTitle: string, missionTitle: string, taskTitles: string[]): Promise<string> => {
    try {
        const prompt = `
            Você é um tutor de programação experiente e amigável.
            Baseado na jornada de estudos '${journeyTitle}', na missão '${missionTitle}', e nas tarefas concluídas (${taskTitles.join(', ')}), gere um resumo conciso e encorajador em português do Brasil.
            O resumo deve focar nos principais conceitos e habilidades que o usuário aprendeu.
            
            Siga esta estrutura:
            1. Comece com uma frase de parabenização vibrante pela conclusão da missão.
            2. Apresente 3 ou 4 dos aprendizados mais importantes em formato de lista (bullet points com "-").
            3. Termine com uma frase motivacional curta para a próxima missão.
            
            Não inclua a formatação markdown. A resposta deve ser um texto simples.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error generating mission summary with Gemini API:", error);
        return "Não foi possível gerar o resumo da missão. Mas parabéns por completá-la! Continue assim.";
    }
};
