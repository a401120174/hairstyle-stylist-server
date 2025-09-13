// 全域類型定義
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
}

// 髮型相關類型定義
export interface HairstyleData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// AI 相關類型定義
export interface UserImage {
  base64: string;
  mimeType: string;
}

export interface HairstyleChangeRequest {
  userImage: UserImage;
  hairstylePrompt: string;
}

export interface HairstyleChangeResponse {
  success: boolean;
  generatedImageBase64?: string;
  message: string;
}