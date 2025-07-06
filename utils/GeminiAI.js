// lib/gemini.js
import { GoogleGenAI } from '@google/genai';

export async function getGeminiResponse(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.0-flash';

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = '';

  for await (const chunk of response) {
    fullResponse += chunk.text;
  }

  return fullResponse;
}
