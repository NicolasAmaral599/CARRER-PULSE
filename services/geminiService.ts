
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

export const isAiAvailable = !!API_KEY;

let ai: GoogleGenAI | null = null;

if (isAiAvailable) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY as string });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("API_KEY is not set. AI features will not work.");
}


export const generateSummary = async (input: string): Promise<string> => {
  if (!ai) return "API Key not configured. Please set it up to use AI features.";
  try {
    const prompt = `P: O cliente do Career Pulse é um ${input}. Crie uma seção "Sobre Mim" para o currículo. Vamos pensar passo a passo, incorporando a energia do Career Pulse.

R:
IA (Raciocínio):
Primeiro, identifico as palavras-chave principais e a personalidade do candidato: ${input}.
Em seguida, começo com uma frase impactante que resuma a experiência e a especialização, alinhada com o dinamismo do Career Pulse.
Depois, expando sobre as habilidades e paixões, usando verbos de ação e, se possível, quantificadores.
Finalizo com uma declaração sobre o impacto que o profissional busca, conectando com a ideia de "pulso" e "crescimento".
Garanto um tom profissional, moderno e persuasivo, digno de um currículo do Career Pulse.

IA (Resposta Final):`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text.replace("Sobre Mim\n", "").trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary. Please try again.";
  }
};

export const generateExperienceBullet = async (responsibility: string, jobTitle: string): Promise<string> => {
   if (!ai) return "API Key not configured. Please set it up to use AI features.";
  try {
    const prompt = `P: Você me ajudará a transformar minhas responsabilidades em conquistas impactantes para o currículo do Career Pulse. Eu era "${jobTitle}" e minha responsabilidade era "${responsibility}".

Primeiro, dê um passo para trás e explique o princípio fundamental de como responsabilidades genéricas podem ser transformadas em conquistas quantificáveis e impactantes. Pense em "como", "o quê", "o quanto" e "o impacto", alinhando-se à visão do Career Pulse de destacar o potencial.

Depois, usando esse princípio, explique como eu poderia refinar a minha responsabilidade de "${responsibility}" em uma conquista de currículo que realmente brilhe no Career Pulse, sugerindo o tipo de informação que eu deveria buscar ou o que eu deveria focar para torná-la poderosa e atraente para recrutadores. Gere apenas a conquista refinada final.

R:
IA (Abstração - Princípio Fundamental para o Career Pulse):
No Career Pulse, a chave para transformar responsabilidades em conquistas que realmente "pulsem" é demonstrar ação, resultado e valor. Em vez de apenas listar tarefas, focamos em contar a história do seu impacto. Para isso, considere:
* A Ação Estratégica (o "como"): Quais foram as suas iniciativas, métodos ou ferramentas específicas que você utilizou?
* O Resultado Mensurável (o "o quê"): Qual foi o efeito direto e tangível da sua ação? O que mudou ou melhorou?
* A Quantificação (o "o quanto"): Sempre que possível, inclua números, porcentagens, valores monetários ou prazos.
* O Impacto no Negócio (o "porquê"): Qual foi a relevância dessa conquista para a empresa?

IA (Aplicação - Refinamento da Conquiça para o Career Pulse):
Aplicando esses princípios de destaque do Career Pulse à sua responsabilidade "${responsibility}", você pode refiná-la buscando as seguintes informações ou focando em:
* Ação Estratégica: Que táticas criativas você utilizou?
* Resultado Quantificável: Em quanto o resultado mudou?
* Impacto no Negócio: Qual o benefício final para a empresa?

Sugestão de Conquista Refinada (no estilo Career Pulse):
`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text.replace(/"/g, '').trim();
  } catch (error) {
    console.error("Error generating experience bullet:", error);
    return "Failed to generate suggestion. Please try again.";
  }
};

export const generateSkills = async (jobTitle: string, experience: string): Promise<string[]> => {
  if (!ai) return ["API Key not configured."];
  try {
    const prompt = `Baseado no cargo de "${jobTitle}" e na seguinte experiência: "${experience}", liste 10 habilidades (skills) relevantes, tanto técnicas (hard skills) quanto interpessoais (soft skills). Retorne apenas uma lista separada por vírgulas. Exemplo: React.js, Liderança de Equipe, Gestão de Projetos, Comunicação Eficaz`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.split(',').map(skill => skill.trim());
  } catch (error)    {
    console.error("Error generating skills:", error);
    return ["Failed to generate skills."];
  }
};
