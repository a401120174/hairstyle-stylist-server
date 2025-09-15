import * as functions from "firebase-functions";
import { storage, HAIRSTYLE_FILE_MAP, STORAGE_PATHS } from "../config";

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
 * Upload generated image to Firebase Storage and return public URL
 */
export async function uploadGeneratedImage(
  imageBuffer: Buffer, 
  userId: string, 
  hairstyleKey: string
): Promise<string> {
  const bucket = storage.bucket();
  const timestamp = Date.now();
  const fileName = `${STORAGE_PATHS.GENERATED}${userId}/${hairstyleKey}-${timestamp}.jpg`;
  
  const file = bucket.file(fileName);
  
  await file.save(imageBuffer, {
    metadata: {
      contentType: "image/jpeg",
    },
    public: true,
  });
  
  // Make the file publicly accessible
  await file.makePublic();
  
  // Return the public URL
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

/**
 * Upload hairstyle template to Firebase Storage
 */
export async function uploadHairstyleTemplate(
  imageBase64: string,
  fileName: string
): Promise<{ filePath: string; publicUrl: string }> {
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(imageBase64.split(',')[1] || imageBase64, "base64");

  // Upload to Firebase Storage
  const bucket = storage.bucket();
  const filePath = `${STORAGE_PATHS.HAIRSTYLES}${fileName}`;
  const file = bucket.file(filePath);

  await file.save(imageBuffer, {
    metadata: {
      contentType: fileName.endsWith('.png') ? 'image/png' : 'image/jpeg',
    },
    public: true,
  });

  // Make the file publicly accessible
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

  return { filePath, publicUrl };
}

/**
 * Check if a file exists in Firebase Storage
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    functions.logger.error(`Error checking file existence: ${filePath}`, error);
    return false;
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    await file.delete();
    functions.logger.info(`Successfully deleted file: ${filePath}`);
    return true;
  } catch (error) {
    functions.logger.error(`Error deleting file: ${filePath}`, error);
    return false;
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