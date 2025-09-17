import * as functions from "firebase-functions";
import { 
  TryHairstyleRequest, 
  TryHairstyleResponse, 
  FunctionContext, 
  GetHairstyleTemplatesResponse
} from "../types";
import { deductUserCredits } from "./userService";
import { generateHairstyleWithGemini, validateImageData } from "./aiService";
import { isValidHairstyleKey, getAllHairstyleKeys, HAIRSTYLE_TEMPLATES } from "../hairstyleTemplates";

/**
 * Validate hairstyle key
 */
function validateHairstyleKey(hairstyleKey: string): boolean {
  return isValidHairstyleKey(hairstyleKey);
}

/**
 * Try hairstyle transformation service
 */
export async function tryHairstyleService(
  data: TryHairstyleRequest, 
  context: FunctionContext
): Promise<TryHairstyleResponse> {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to try hairstyles"
    );
  }

  // Validate input parameters
  if (!data.userPhoto || !data.hairstyleKey) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "userPhoto and hairstyleKey are required parameters"
    );
  }

  // Validate image data
  if (!validateImageData(data.userPhoto)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid image data provided"
    );
  }

  // Validate hairstyle key format and existence
  if (!validateHairstyleKey(data.hairstyleKey)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Invalid hairstyle key. Supported hairstyles: ${getAllHairstyleKeys().join(", ")}`
    );
  }

  const userId = context.auth.uid;

  try {
    // Use transaction to safely deduct credits
    const transactionResult = await deductUserCredits(userId);

    // Generate hairstyle using Gemini API
    functions.logger.info(`Starting hairstyle generation for user ${userId} with style ${data.hairstyleKey}`);
    
    const generatedImageUrl = await generateHairstyleWithGemini(
      data.userPhoto, 
      data.hairstyleKey,
      userId
    );

    functions.logger.info(
      `User ${userId} successfully generated hairstyle ${data.hairstyleKey}. Credits left: ${transactionResult.creditsLeft}`
    );

    return {
      success: true,
      imageUrl: generatedImageUrl,
      creditsLeft: transactionResult.creditsLeft,
    };

  } catch (error) {
    functions.logger.error("Error in tryHairstyle function:", error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      "internal",
      "An unexpected error occurred while processing your request"
    );
  }
}

/**
 * Get list of available hairstyle templates service
 */
export async function getHairstyleTemplatesService(): Promise<GetHairstyleTemplatesResponse> {
  try {
    return {
      success: true,
      hairstyles: HAIRSTYLE_TEMPLATES
    };

  } catch (error) {
    functions.logger.error("Error getting hairstyle templates:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get hairstyle templates"
    );
  }
}

/**
 * Get formatted hairstyle name from key
 */
export function formatHairstyleName(key: string): string {
  return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Check if hairstyle is available
 */
export function isHairstyleAvailable(hairstyleKey: string): boolean {
  return validateHairstyleKey(hairstyleKey);
}