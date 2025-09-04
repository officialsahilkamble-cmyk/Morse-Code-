
import { GoogleGenAI } from "@google/genai";
import { MORSE_CODE_MAP } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getMorseHint = async (challenge: string): Promise<string> => {
  const isWord = challenge.length > 1;
  
  try {
    if (isWord) {
      const morseBreakdown = challenge.toUpperCase().split('').map(char => `${char}: ${MORSE_CODE_MAP[char]}`).join(' | ');
      const prompt = `The user is learning Morse code and needs a hint for the word '${challenge}'. The breakdown is: ${morseBreakdown}. Provide a simple, encouraging hint. You could give a mnemonic for the first letter or a tip for breaking down the word. Keep it to one short sentence.`;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              temperature: 0.7,
              thinkingConfig: { thinkingBudget: 0 }
          }
      });
      return response.text;

    } else {
      const morse = MORSE_CODE_MAP[challenge.toUpperCase()];
      if (!morse) {
        return "Could not find Morse code for this character.";
      }
      
      const prompt = `The user needs a memorable mnemonic for the letter '${challenge}', which is '${morse}' in Morse code.

      Here are some excellent examples to follow:
      - T (-): "Tall tree, a single long dash."
      - I (..): "Insects have two antennae."
      - M (--): "Mail man, two long letters."
      - A (.-): "A-bove and below, a dot then a dash."
      - N (-.): "Na-vy, a dash then a dot."

      Now, create a new, similar-quality mnemonic for '${challenge}' ('${morse}').`;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              systemInstruction: "You are an expert Morse code instructor creating clever, visual mnemonics for students. The mnemonic you create must start with the letter it is for. Your response must be ONLY the single mnemonic sentence, without any preamble, explanation, or quotation marks.",
              temperature: 0.7,
              thinkingConfig: { thinkingBudget: 0 }
          }
      });
      return response.text;
    }
  } catch (error) {
    console.error("Error fetching hint from Gemini API:", error);
    if (!navigator.onLine) {
        return "You appear to be offline. Please connect to the internet to get AI hints.";
    }
    return "Sorry, I couldn't get a hint right now. Maybe check your API key?";
  }
};
