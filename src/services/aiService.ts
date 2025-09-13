import { GoogleGenAI, Modality } from "@google/genai";
import { type UserImage } from '../types';

// 延遲檢查 API 金鑰，只在實際使用時檢查
let ai: GoogleGenAI | null = null;

function getAIInstance(): GoogleGenAI {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY environment variable not set");
  }
  
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  }
  
  return ai;
}

export async function changeHairstyle(
  userImage: UserImage,
  hairstylePrompt: string
): Promise<string | null> {
  try {
    // 獲取 AI 實例（會檢查 API 金鑰）
    const aiInstance = getAIInstance();
    
    // 確保 base64 資料格式正確
    const base64Data = userImage.base64.includes(',') 
      ? userImage.base64.split(',')[1] 
      : userImage.base64;

    // 驗證 base64 資料存在
    if (!base64Data) {
      throw new Error('Invalid base64 image data');
    }

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: userImage.mimeType,
            },
          },
          {
            text: hairstylePrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    // The model can return multiple parts (text, image). We need to find the image part.
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
        }
    }

    return null; // No image part found

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate new hairstyle. Please check your API key and try again.");
  }
}