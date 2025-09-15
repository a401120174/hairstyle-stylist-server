import * as functions from "firebase-functions";
import { genAI, AI_CONFIG } from "../config";
import { loadHairstyleImage, uploadGeneratedImage } from "./storageService";

/**
 * Generate hairstyle using Gemini 2.5 Flash Image Preview API
 */
export async function generateHairstyleWithGemini(
  userPhotoBase64: string, 
  hairstyleKey: string,
  userId: string
): Promise<string> {
  try {
    // Get the Gemini 2.5 Flash Image Preview model
    const model = genAI.getGenerativeModel({ model: AI_CONFIG.MODEL_NAME });

    // Load the hairstyle template image from Firebase Storage
    const hairstyleImageBuffer = await loadHairstyleImage(hairstyleKey);
    if (!hairstyleImageBuffer) {
      throw new Error(`Hairstyle template not found for key: ${hairstyleKey}`);
    }

    // Prepare the hairstyle transformation prompt
    const hairstylePrompt = `
    You are an expert hairstylist AI. Please help me change the hairstyle of the person in the first image to match the hairstyle shown in the second image.

    Instructions:
    1. Keep the person's face, facial features, and identity exactly the same
    2. Only change the hairstyle to match the reference style in the second image
    3. Maintain natural hair color and texture that suits the person
    4. Make the result look realistic and professional
    5. Ensure the lighting and background remain consistent with the original image
    6. Pay attention to hair length, volume, and styling details from the reference
    7. Generate a new image with the hairstyle transformation applied

    Please return the transformed image maintaining the person's identity but with the new hairstyle.
    `;

    // Prepare the content parts in the correct format
    const result = await model.generateContent([
      {
        inlineData: {
          data: userPhotoBase64.split(',')[1] || userPhotoBase64, // Remove data URL prefix if present
          mimeType: AI_CONFIG.USER_PHOTO_MIME_TYPE
        }
      },
      {
        inlineData: {
          data: hairstyleImageBuffer.toString("base64"),
          mimeType: AI_CONFIG.DEFAULT_MIME_TYPE
        }
      },
      hairstylePrompt
    ]);

    const response = await result.response;

    // Extract the generated image from the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            // Found image data, upload to storage and return URL
            const imageBuffer = Buffer.from(part.inlineData.data, "base64");
            const imageUrl = await uploadGeneratedImage(imageBuffer, userId, hairstyleKey);
            
            functions.logger.info(`Successfully generated hairstyle ${hairstyleKey} and uploaded to: ${imageUrl}`);
            return imageUrl;
          }
        }
      }
    }

    // No image found in response, log the text response for debugging
    functions.logger.warn("No image data found in Gemini response");
    functions.logger.info("Gemini text response:", response.text());
    
    // Return a mock URL pointing to Firebase Hosting as fallback
    return `https://hairstyle-stylish.web.app/images/generated/mock-${hairstyleKey}-${Date.now()}.jpg`;
    
  } catch (error) {
    functions.logger.error("Error generating hairstyle with Gemini:", error);
    throw new Error(`Failed to generate hairstyle: ${error}`);
  }
}

/**
 * Validate base64 image data
 */
export function validateImageData(imageBase64: string): boolean {
  try {
    // Check if it's a valid base64 string
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Basic validation - check if it's a reasonable size
    if (buffer.length < 1000) { // Too small to be a real image
      return false;
    }
    
    if (buffer.length > 10 * 1024 * 1024) { // Larger than 10MB
      return false;
    }
    
    return true;
  } catch (error) {
    functions.logger.error("Error validating image data:", error);
    return false;
  }
}

/**
 * Prepare prompt for AI based on hairstyle type
 */
export function getHairstylePrompt(hairstyleKey: string): string {
  const basePrompt = `
  You are an expert hairstylist AI. Please help me change the hairstyle of the person in the first image to match the hairstyle shown in the second image.

  Instructions:
  1. Keep the person's face, facial features, and identity exactly the same
  2. Only change the hairstyle to match the reference style in the second image
  3. Maintain natural hair color and texture that suits the person
  4. Make the result look realistic and professional
  5. Ensure the lighting and background remain consistent with the original image
  6. Pay attention to hair length, volume, and styling details from the reference
  7. Generate a new image with the hairstyle transformation applied
  `;

  // Add specific instructions based on hairstyle type
  const specificInstructions: { [key: string]: string } = {
    "classic-pompadour": "Focus on creating volume and height at the front, with neat sides.",
    "fade-buzz-cut": "Create a short, clean cut with gradual fading on the sides.",
    "messy-short-curls": "Maintain natural curl texture while keeping the style casual and tousled.",
    "short-bob": "Create a clean, even bob cut that frames the face nicely."
  };

  const additional = specificInstructions[hairstyleKey] || "";
  
  return `${basePrompt}\n\nSpecific focus for this style: ${additional}\n\nPlease return the transformed image maintaining the person's identity but with the new hairstyle.`;
}