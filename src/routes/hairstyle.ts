import { Router } from 'express';
import { generateHairstyle, getHairstylePrompts } from '../controllers/hairstyleController';

const router = Router();

// POST /api/hairstyle/generate - 生成新髮型
router.post('/generate', generateHairstyle);

// GET /api/hairstyle/prompts - 取得預設髮型提示
router.get('/prompts', getHairstylePrompts);

export default router;