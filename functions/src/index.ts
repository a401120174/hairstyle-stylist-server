import * as functions from "firebase-functions";

// Import service functions
import { getUserCreditsService } from "./services/userService";
import { tryHairstyleService, getHairstyleTemplatesService } from "./services/hairstyleService";
import { verifyIosPurchaseService, verifyAndroidPurchaseService } from "./services/purchaseService";
import { uploadHairstyleTemplateService, addCreditsToUserService } from "./services/adminService";

// Import types
import { 
  TryHairstyleRequest, 
  TryHairstyleResponse,
  GetUserCreditsResponse,
  VerifyPurchaseRequest,
  VerifyPurchaseResponse,
  UploadHairstyleTemplateRequest,
  UploadHairstyleTemplateResponse,
  GetHairstyleTemplatesResponse,
  AddCreditsToUserRequest,
  AddCreditsToUserResponse
} from "./types";

/**
 * AI Hairstyle Generation Function
 * 
 * This function:
 * 1. Verifies the user is authenticated
 * 2. Validates input parameters (user photo and hairstyle key)
 * 3. Checks if user has enough credits (at least 1)
 * 4. Deducts 1 credit using Firestore transaction
 * 5. Calls Gemini API to generate new hairstyle
 * 6. Returns the generated image URL and remaining credits
 */
export const tryHairstyle = functions.https.onCall(
  async (data: TryHairstyleRequest, context: functions.https.CallableContext): Promise<TryHairstyleResponse> => {
    return tryHairstyleService(data, context);
  }
);

/**
 * Get User Credits Function
 * 
 * This function:
 * 1. Verifies the user is authenticated
 * 2. Retrieves user's current credit balance from Firestore
 * 3. Returns user info including credits and basic profile data
 * 4. Creates user document with default credits if it doesn't exist
 */
export const getUserCredits = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext): Promise<GetUserCreditsResponse> => {
    return getUserCreditsService(context);
  }
);

/**
 * Verify iOS In-App Purchase
 * TODO: Implement iOS purchase verification with App Store Connect API
 */
export const verifyIosPurchase = functions.https.onCall(
  async (data: VerifyPurchaseRequest, context: functions.https.CallableContext): Promise<VerifyPurchaseResponse> => {
    return verifyIosPurchaseService(data, context);
  }
);

/**
 * Verify Android In-App Purchase
 * TODO: Implement Android purchase verification with Google Play Console API
 */
export const verifyAndroidPurchase = functions.https.onCall(
  async (data: VerifyPurchaseRequest, context: functions.https.CallableContext): Promise<VerifyPurchaseResponse> => {
    return verifyAndroidPurchaseService(data, context);
  }
);

/**
 * Admin function to upload hairstyle templates to Firebase Storage
 * This function helps upload hairstyle reference images to Storage
 */
export const uploadHairstyleTemplate = functions.https.onCall(
  async (data: UploadHairstyleTemplateRequest, context: functions.https.CallableContext): Promise<UploadHairstyleTemplateResponse> => {
    return uploadHairstyleTemplateService(data, context);
  }
);

/**
 * Get list of available hairstyle templates
 */
export const getHairstyleTemplates = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext): Promise<GetHairstyleTemplatesResponse> => {
    return getHairstyleTemplatesService();
  }
);

/**
 * Admin function to manually add credits to a user (for testing/support)
 * TODO: Add proper admin authentication
 */
export const addCreditsToUser = functions.https.onCall(
  async (data: AddCreditsToUserRequest, context: functions.https.CallableContext): Promise<AddCreditsToUserResponse> => {
    return addCreditsToUserService(data, context);
  }
);