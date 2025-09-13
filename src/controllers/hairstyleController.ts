import { Request, Response } from 'express';
import { changeHairstyle } from '../services/aiService';
import { HairstyleChangeRequest, HairstyleChangeResponse } from '../types';

export const generateHairstyle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userImage, hairstylePrompt }: HairstyleChangeRequest = req.body;

    // 驗證輸入
    if (!userImage || !userImage.base64 || !userImage.mimeType) {
      res.status(400).json({
        success: false,
        message: 'User image is required with base64 data and mimeType'
      } as HairstyleChangeResponse);
      return;
    }

    if (!hairstylePrompt || typeof hairstylePrompt !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Hairstyle prompt is required and must be a string'
      } as HairstyleChangeResponse);
      return;
    }

    // 驗證圖片格式
    const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedMimeTypes.includes(userImage.mimeType)) {
      res.status(400).json({
        success: false,
        message: 'Unsupported image format. Please use JPEG, PNG, or WebP'
      } as HairstyleChangeResponse);
      return;
    }

    // 呼叫 AI 服務
    const generatedImageBase64 = await changeHairstyle(userImage, hairstylePrompt);

    if (generatedImageBase64) {
      res.status(200).json({
        success: true,
        generatedImageBase64,
        message: 'Hairstyle generated successfully'
      } as HairstyleChangeResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate hairstyle image'
      } as HairstyleChangeResponse);
    }

  } catch (error) {
    console.error('Error in generateHairstyle controller:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({
      success: false,
      message: errorMessage
    } as HairstyleChangeResponse);
  }
};

export const getHairstylePrompts = (req: Request, res: Response): void => {
  const prompts = [
    {
      id: 1,
      name: '現代短髮',
      prompt: 'Change this person\'s hairstyle to a modern short bob cut with clean lines and a professional look'
    },
    {
      id: 2,
      name: '浪漫長捲髮',
      prompt: 'Transform this hairstyle to long romantic curls with volume and bounce'
    },
    {
      id: 3,
      name: '時尚中長髮',
      prompt: 'Give this person a trendy medium-length layered hairstyle with subtle waves'
    },
    {
      id: 4,
      name: '個性像素頭',
      prompt: 'Create an edgy pixie cut hairstyle that\'s bold and modern'
    },
    {
      id: 5,
      name: '優雅盤髮',
      prompt: 'Style this hair into an elegant updo suitable for formal occasions'
    }
  ];

  res.status(200).json({
    success: true,
    data: prompts,
    message: 'Hairstyle prompts retrieved successfully'
  });
};