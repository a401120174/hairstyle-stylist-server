import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HairstyleFileMap } from "./types";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export Firebase services
export const db = admin.firestore();
export const storage = admin.storage();

// Initialize Gemini AI
export const genAI = new GoogleGenerativeAI(
  functions.config().gemini?.api_key || process.env.GEMINI_API_KEY || ""
);

// Configuration constants
export const DEFAULT_USER_CREDITS = 5;
export const CREDIT_DEDUCTION_AMOUNT = 1;

// Hairstyle file mapping configuration
export const HAIRSTYLE_FILE_MAP: HairstyleFileMap = {
  "classic-pompadour": "hairstyles/classic-pompadour.png",
  "fade-buzz-cut": "hairstyles/fade-buzz-cut.png",
  "messy-short-curls": "hairstyles/messy-short-curls.png",
  "short-bob": "hairstyles/short-bob.jpg"
};

// Storage configuration
export const STORAGE_PATHS = {
  HAIRSTYLES: "hairstyles/",
  GENERATED: "generated/",
  TEMP: "temp/"
} as const;

// AI model configuration
export const AI_CONFIG = {
  MODEL_NAME: "gemini-2.5-flash-image-preview",
  DEFAULT_MIME_TYPE: "image/png",
  USER_PHOTO_MIME_TYPE: "image/jpeg"
} as const;

// Validation constants
export const VALIDATION = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/jpg"],
  MIN_CREDITS_REQUIRED: 1
} as const;