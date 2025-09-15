import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { db, DEFAULT_USER_CREDITS, CREDIT_DEDUCTION_AMOUNT } from "../config";
import { 
  UserData, 
  GetUserCreditsResponse, 
  FunctionContext,
  CreditTransactionResult 
} from "../types";

/**
 * Create a new user with default credits
 */
export async function createNewUser(
  userId: string, 
  email?: string, 
  displayName?: string
): Promise<UserData> {
  const newUserData: UserData = {
    credits: DEFAULT_USER_CREDITS,
    email: email,
    displayName: displayName,
    createdAt: admin.firestore.Timestamp.now(),
    lastUsed: admin.firestore.Timestamp.now(),
  };

  const userRef = db.collection("users").doc(userId);
  await userRef.set(newUserData);
  
  functions.logger.info(`New user created with ${DEFAULT_USER_CREDITS} free credits: ${userId}`);
  
  return newUserData;
}

/**
 * Get user data from Firestore
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    return null;
  }
  
  return userDoc.data() as UserData;
}

/**
 * Update user's last used timestamp
 */
export async function updateLastUsed(userId: string): Promise<void> {
  const userRef = db.collection("users").doc(userId);
  await userRef.update({
    lastUsed: admin.firestore.Timestamp.now(),
  });
}

/**
 * Deduct credits from user using Firestore transaction
 * Returns the remaining credits after deduction
 */
export async function deductUserCredits(
  userId: string, 
  creditsToDeduct: number = CREDIT_DEDUCTION_AMOUNT
): Promise<CreditTransactionResult> {
  const userRef = db.collection("users").doc(userId);

  return await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
    const userDoc = await transaction.get(userRef);

    // Create user document if it doesn't exist (first time user)
    if (!userDoc.exists) {
      const newUserData: UserData = {
        credits: DEFAULT_USER_CREDITS,
        createdAt: admin.firestore.Timestamp.now(),
        lastUsed: admin.firestore.Timestamp.now(),
      };
      transaction.set(userRef, newUserData);
      
      // New user gets their first try for free, but still deduct credits
      const remainingCredits = DEFAULT_USER_CREDITS - creditsToDeduct;
      transaction.update(userRef, {
        credits: remainingCredits,
        lastUsed: admin.firestore.Timestamp.now(),
      });
      
      return { creditsLeft: remainingCredits };
    }

    const userData = userDoc.data() as UserData;

    // Check if user has enough credits
    if (userData.credits < creditsToDeduct) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Insufficient credits. Please purchase more credits to continue."
      );
    }

    // Deduct credits
    const newCredits = userData.credits - creditsToDeduct;
    transaction.update(userRef, {
      credits: newCredits,
      lastUsed: admin.firestore.Timestamp.now(),
    });

    return { creditsLeft: newCredits };
  });
}

/**
 * Add credits to user account
 */
export async function addCreditsToUser(userId: string, creditsToAdd: number): Promise<number> {
  const userRef = db.collection("users").doc(userId);
  
  return await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists) {
      // Create new user if doesn't exist
      const newUserData: UserData = {
        credits: DEFAULT_USER_CREDITS + creditsToAdd,
        createdAt: admin.firestore.Timestamp.now(),
        lastUsed: admin.firestore.Timestamp.now(),
      };
      transaction.set(userRef, newUserData);
      return newUserData.credits;
    }
    
    const userData = userDoc.data() as UserData;
    const newCredits = userData.credits + creditsToAdd;
    
    transaction.update(userRef, {
      credits: newCredits,
      lastUsed: admin.firestore.Timestamp.now(),
    });
    
    return newCredits;
  });
}

/**
 * Get user credits and information
 */
export async function getUserCreditsService(
  context: FunctionContext
): Promise<GetUserCreditsResponse> {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to get credits"
    );
  }

  const userId = context.auth.uid;

  try {
    // Try to get existing user
    let userData = await getUserData(userId);

    // Create user document if it doesn't exist (first time user)
    if (!userData) {
      userData = await createNewUser(
        userId,
        context.auth?.token.email,
        context.auth?.token.name
      );

      return {
        success: true,
        credits: userData.credits,
        userInfo: {
          email: userData.email,
          displayName: userData.displayName,
          createdAt: userData.createdAt?.toDate().toISOString(),
          lastUsed: userData.lastUsed?.toDate().toISOString(),
        }
      };
    }

    // Update lastUsed timestamp for existing user
    await updateLastUsed(userId);

    functions.logger.info(`User credits retrieved: ${userId}, credits: ${userData.credits}`);

    return {
      success: true,
      credits: userData.credits,
      userInfo: {
        email: userData.email,
        displayName: userData.displayName,
        createdAt: userData.createdAt?.toDate().toISOString(),
        lastUsed: userData.lastUsed?.toDate().toISOString(),
      }
    };

  } catch (error) {
    functions.logger.error("Error in getUserCredits function:", error);
    
    throw new functions.https.HttpsError(
      "internal",
      "An unexpected error occurred while retrieving user credits"
    );
  }
}