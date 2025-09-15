import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

/**
 * Represents the structure of a user document in Firestore
 */
export interface UserData {
  credits: number;
  email?: string | null;
  displayName?: string | null;
  createdAt?: admin.firestore.Timestamp;
  lastUsed?: admin.firestore.Timestamp;
}

/**
 * Request type for tryHairstyle function
 */
export interface TryHairstyleRequest {
  userPhoto: string; // Base64 encoded image data
  hairstyleKey: string; // Key to identify the hairstyle template
}

/**
 * Response type for tryHairstyle function
 */
export interface TryHairstyleResponse {
  success: boolean;
  imageUrl?: string;
  creditsLeft?: number;
  error?: string;
}

/**
 * Response type for getUserCredits function
 */
export interface GetUserCreditsResponse {
  success: boolean;
  credits?: number;
  userInfo?: {
    email?: string | null;
    displayName?: string | null;
    createdAt?: string;
    lastUsed?: string;
  };
  error?: string;
}

/**
 * Request type for purchase verification
 */
export interface VerifyPurchaseRequest {
  receiptData?: string; // iOS receipt data
  purchaseToken?: string; // Android purchase token
  productId?: string;
  packageName?: string;
}

/**
 * Response type for purchase verification
 */
export interface VerifyPurchaseResponse {
  success: boolean;
  creditsAdded?: number;
  error?: string;
  message?: string;
}

/**
 * Request type for upload hairstyle template
 */
export interface UploadHairstyleTemplateRequest {
  hairstyleKey: string;
  imageBase64: string;
  fileName: string;
}

/**
 * Response type for upload hairstyle template
 */
export interface UploadHairstyleTemplateResponse {
  success: boolean;
  message?: string;
  filePath?: string;
  publicUrl?: string;
  error?: string;
}

/**
 * Hairstyle template info
 */
export interface HairstyleTemplate {
  key: string;
  name: string;
  available: boolean;
}

/**
 * Response type for getHairstyleTemplates function
 */
export interface GetHairstyleTemplatesResponse {
  success: boolean;
  hairstyles?: HairstyleTemplate[];
  error?: string;
}

/**
 * Request type for addCreditsToUser function
 */
export interface AddCreditsToUserRequest {
  userId: string;
  credits: number;
}

/**
 * Response type for addCreditsToUser function
 */
export interface AddCreditsToUserResponse {
  success: boolean;
  creditsAdded?: number;
  newTotal?: number;
  error?: string;
  message?: string;
}

/**
 * Context type for Firebase Functions
 */
export type FunctionContext = functions.https.CallableContext;

/**
 * Available hairstyle keys
 */
export const VALID_HAIRSTYLES = ["classic-pompadour", "fade-buzz-cut", "messy-short-curls", "short-bob"] as const;

/**
 * Type for valid hairstyle keys
 */
export type HairstyleKey = typeof VALID_HAIRSTYLES[number];

/**
 * Hairstyle file mapping
 */
export interface HairstyleFileMap {
  [key: string]: string;
}

/**
 * Result of credit transaction
 */
export interface CreditTransactionResult {
  creditsLeft: number;
}