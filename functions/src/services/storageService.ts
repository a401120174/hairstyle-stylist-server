import * as functions from "firebase-functions";
import { storage, HAIRSTYLE_FILE_MAP } from "../config";

/**
 * Load hairstyle template image from Firebase Storage
 */
export async function loadHairstyleImage(hairstyleKey: string): Promise<Buffer | null> {
  try {
    const filePath = HAIRSTYLE_FILE_MAP[hairstyleKey];
    if (!filePath) {
      functions.logger.error(`Hairstyle key not found in mapping: ${hairstyleKey}`);
      return null;
    }

    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      functions.logger.error(`Hairstyle image file not found in Storage: ${filePath}`);
      return null;
    }

    // Download the file
    const [buffer] = await file.download();
    functions.logger.info(`Successfully loaded hairstyle image from Storage: ${filePath}`);
    return buffer;
    
  } catch (error) {
    functions.logger.error(`Error loading hairstyle image for key ${hairstyleKey}:`, error);
    return null;
  }
}

/**
 * Get public URL for a file in Storage
 */
export function getPublicUrl(filePath: string): string {
  const bucket = storage.bucket();
  // Use simple Firebase Storage download URL format for public files
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
}