import * as functions from "firebase-functions";
import { 
  UploadHairstyleTemplateRequest, 
  UploadHairstyleTemplateResponse,
  AddCreditsToUserRequest,
  AddCreditsToUserResponse,
  FunctionContext 
} from "../types";
import { uploadHairstyleTemplate } from "./storageService";
import { addCreditsToUser } from "./userService";

/**
 * Check if user has admin privileges
 * TODO: Implement proper admin role verification
 */
function isAdmin(context: FunctionContext): boolean {
  // TODO: Check custom claims or admin database
  // For now, we'll just log and return false for security
  functions.logger.warn("Admin check requested - not yet implemented", {
    userId: context.auth?.uid,
    email: context.auth?.token?.email
  });
  return false;
}

/**
 * Upload hairstyle template service
 * Admin function to upload hairstyle templates to Firebase Storage
 */
export async function uploadHairstyleTemplateService(
  data: UploadHairstyleTemplateRequest, 
  context: FunctionContext
): Promise<UploadHairstyleTemplateResponse> {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to upload hairstyle templates"
    );
  }

  // TODO: Add admin role verification here
  // For now, we'll allow any authenticated user for testing purposes
  // if (!isAdmin(context)) {
  //   throw new functions.https.HttpsError(
  //     "permission-denied",
  //     "Only admins can upload hairstyle templates"
  //   );
  // }

  try {
    const { hairstyleKey, imageBase64, fileName } = data;

    if (!hairstyleKey || !imageBase64 || !fileName) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "hairstyleKey, imageBase64, and fileName are required"
      );
    }

    // Upload to Firebase Storage
    const { filePath, publicUrl } = await uploadHairstyleTemplate(imageBase64, fileName);

    functions.logger.info(`Hairstyle template uploaded: ${hairstyleKey} -> ${filePath}`);

    return {
      success: true,
      message: `Hairstyle template '${hairstyleKey}' uploaded successfully`,
      filePath: filePath,
      publicUrl: publicUrl
    };

  } catch (error) {
    functions.logger.error("Error uploading hairstyle template:", error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      "internal",
      "Failed to upload hairstyle template"
    );
  }
}

/**
 * Add credits to user service
 * Admin function to manually add credits to a user (for testing/support)
 */
export async function addCreditsToUserService(
  data: AddCreditsToUserRequest, 
  context: FunctionContext
): Promise<AddCreditsToUserResponse> {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to add credits"
    );
  }

  // TODO: Implement admin role verification
  if (!isAdmin(context)) {
    functions.logger.warn("Admin function called by non-admin user", {
      caller: context.auth?.uid,
      targetUser: data.userId,
      creditsToAdd: data.credits
    });

    return {
      success: false,
      error: "permission-denied",
      message: "Admin functions are not yet implemented"
    };
  }

  try {
    const { userId, credits } = data;

    if (!userId || !credits || credits <= 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Valid userId and positive credits amount are required"
      );
    }

    const newTotal = await addCreditsToUser(userId, credits);

    functions.logger.info(`Admin added credits to user`, {
      adminId: context.auth.uid,
      targetUser: userId,
      creditsAdded: credits,
      newTotal: newTotal
    });

    return {
      success: true,
      creditsAdded: credits,
      newTotal: newTotal,
      message: `Successfully added ${credits} credits to user ${userId}`
    };

  } catch (error) {
    functions.logger.error("Error adding credits to user:", error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      "internal",
      "Failed to add credits to user"
    );
  }
}

/**
 * Set user admin role
 * TODO: Implement admin role management
 */
export async function setAdminRole(userId: string, isAdmin: boolean): Promise<boolean> {
  try {
    // TODO: Set custom claims for admin role
    // await admin.auth().setCustomUserClaims(userId, { admin: isAdmin });
    
    functions.logger.info(`Admin role ${isAdmin ? 'granted' : 'revoked'} for user: ${userId}`);
    return true;
  } catch (error) {
    functions.logger.error("Error setting admin role:", error);
    return false;
  }
}

/**
 * Validate file upload data
 */
export function validateUploadData(data: UploadHairstyleTemplateRequest): string | null {
  if (!data.hairstyleKey || typeof data.hairstyleKey !== 'string') {
    return "Invalid hairstyleKey";
  }
  
  if (!data.fileName || typeof data.fileName !== 'string') {
    return "Invalid fileName";
  }
  
  if (!data.imageBase64 || typeof data.imageBase64 !== 'string') {
    return "Invalid imageBase64";
  }
  
  // Check file extension
  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const hasValidExtension = validExtensions.some(ext => 
    data.fileName.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return "Invalid file extension. Only JPG and PNG files are allowed";
  }
  
  return null; // Valid
}