import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

/**
 * Represents the structure of a user document in Firestore
 */
interface UserData {
  credits: number;
  email?: string;
  displayName?: string;
  createdAt?: admin.firestore.Timestamp;
  lastUsed?: admin.firestore.Timestamp;
}

/**
 * Response type for tryHairstyle function
 */
interface TryHairstyleResponse {
  success: boolean;
  imageUrl?: string;
  creditsLeft?: number;
  error?: string;
}

/**
 * AI Hairstyle Generation Function
 * 
 * This function:
 * 1. Verifies the user is authenticated
 * 2. Checks if user has enough credits (at least 1)
 * 3. Deducts 1 credit using Firestore transaction
 * 4. Returns a mock image URL and remaining credits
 * 
 * Future: Will integrate with Gemini API for actual image generation
 */
export const tryHairstyle = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext): Promise<TryHairstyleResponse> => {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to try hairstyles"
      );
    }

    const userId = context.auth.uid;
    const userRef = db.collection("users").doc(userId);

    try {
      // Use transaction to safely deduct credits
      const result = await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
        const userDoc = await transaction.get(userRef);

        // Create user document if it doesn't exist (first time user)
        if (!userDoc.exists) {
          const newUserData: UserData = {
            credits: 5, // Give new users 5 free credits
            email: context.auth?.token.email,
            displayName: context.auth?.token.name,
            createdAt: admin.firestore.Timestamp.now(),
            lastUsed: admin.firestore.Timestamp.now(),
          };
          transaction.set(userRef, newUserData);
          
          // New user gets their first try for free, but still deduct 1 credit
          transaction.update(userRef, {
            credits: 4,
            lastUsed: admin.firestore.Timestamp.now(),
          });
          
          return { creditsLeft: 4 };
        }

        const userData = userDoc.data() as UserData;

        // Check if user has enough credits
        if (userData.credits < 1) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "Insufficient credits. Please purchase more credits to continue."
          );
        }

        // Deduct 1 credit
        const newCredits = userData.credits - 1;
        transaction.update(userRef, {
          credits: newCredits,
          lastUsed: admin.firestore.Timestamp.now(),
        });

        return { creditsLeft: newCredits };
      });

      // TODO: Replace with actual Gemini API call
      // For MVP, return a mock image URL
      const mockImageUrl = generateMockImageUrl(userId);

      functions.logger.info(
        `User ${userId} successfully tried hairstyle. Credits left: ${result.creditsLeft}`
      );

      return {
        success: true,
        imageUrl: mockImageUrl,
        creditsLeft: result.creditsLeft,
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
);

/**
 * Generate a mock image URL for MVP
 * TODO: Replace with actual Gemini API integration
 */
function generateMockImageUrl(userId: string): string {
  const timestamp = Date.now();
  const mockStyles = [
    "modern-short-cut",
    "classic-bob",
    "layered-waves",
    "pixie-cut",
    "long-curls",
    "beach-waves"
  ];
  
  const randomStyle = mockStyles[Math.floor(Math.random() * mockStyles.length)];
  
  // Return a mock URL that could represent a generated hairstyle image
  return `https://mock-hairstyle-generator.com/generated/${userId}/${randomStyle}-${timestamp}.jpg`;
}

/**
 * Verify iOS In-App Purchase
 * TODO: Implement iOS purchase verification with App Store Connect API
 */
export const verifyIosPurchase = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to verify purchases"
      );
    }

    functions.logger.info("iOS purchase verification requested", {
      userId: context.auth.uid,
      receiptData: data.receiptData ? "present" : "missing"
    });

    // TODO: Implement iOS purchase verification
    // 1. Validate receipt with Apple's servers
    // 2. Check if purchase is valid and not already processed
    // 3. Add credits to user account
    // 4. Store purchase record for audit

    return {
      success: false,
      error: "unimplemented",
      message: "iOS purchase verification is not yet implemented"
    };
  }
);

/**
 * Verify Android In-App Purchase
 * TODO: Implement Android purchase verification with Google Play Console API
 */
export const verifyAndroidPurchase = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to verify purchases"
      );
    }

    functions.logger.info("Android purchase verification requested", {
      userId: context.auth.uid,
      purchaseToken: data.purchaseToken ? "present" : "missing"
    });

    // TODO: Implement Android purchase verification
    // 1. Validate purchase token with Google Play API
    // 2. Check if purchase is valid and not already processed
    // 3. Add credits to user account
    // 4. Store purchase record for audit

    return {
      success: false,
      error: "unimplemented",
      message: "Android purchase verification is not yet implemented"
    };
  }
);

/**
 * Admin function to manually add credits to a user (for testing/support)
 * TODO: Add proper admin authentication
 */
export const addCreditsToUser = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    // TODO: Implement admin role verification
    // For now, just log the request
    functions.logger.warn("Admin function called - not yet implemented", {
      caller: context.auth?.uid,
      targetUser: data.userId,
      creditsToAdd: data.credits
    });

    return {
      success: false,
      error: "unimplemented",
      message: "Admin functions are not yet implemented"
    };
  }
);