import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean base64 string if it contains metadata
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity or detect from input
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Using default config for images. 
      // Note: responseMimeType is not supported for nano banana series models per guidelines.
    });

    // Check parts for the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
