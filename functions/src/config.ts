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
  // Male hairstyles
  "male_korean_wolf_cut": "male_korean_wolf_cut.png",
  "male_taper_fade": "male_taper_fade.png", 
  "male_buzz_cut": "male_buzz_cut.png",
  "male_american_curls": "male_american_curls.png",
  "male_middle_part_bob": "male_middle_part_bob.png",
  "male_longer_wolf_cut": "male_longer_wolf_cut.png",
  "male_pompadour": "male_pompadour.png",
  "male_slicked_back_undercut": "male_slicked_back_undercut.png",
  "male_teddy_bear_perm": "male_teddy_bear_perm.png",
  "male_samurai_bun": "male_samurai_bun.png",
  // Female hairstyles
  "female_hime_cut": "female_hime_cut.png",
  "female_high_layered_lob": "female_high_layered_lob.png",
  "female_japanese_wool_perm": "female_japanese_wool_perm.png",
  "female_korean_layered_short_hair": "female_korean_layered_short_hair.png",
  "female_french_wave_mid_length_hair": "female_french_wave_mid_length_hair.png",
  "female_hidden_earlobe_dye": "female_hidden_earlobe_dye.png",
  "female_manga_bangs": "female_manga_bangs.png",
  "female_shoulder_length_flip_out": "female_shoulder_length_flip_out.png",
  "female_lazy_curls": "female_lazy_curls.png",
  "female_collarbone_hime_cut": "female_collarbone_hime_cut.png",
  // Legacy hairstyles (for backward compatibility)
  "classic-pompadour": "classic-pompadour.png",
  "fade-buzz-cut": "fade-buzz-cut.png",
  "messy-short-curls": "messy-short-curls.png",
  "short-bob": "short-bob.jpg"
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