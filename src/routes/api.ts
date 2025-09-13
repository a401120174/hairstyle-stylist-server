import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const router = Router();

// 健康檢查路由
router.get('/health', healthCheck);

export default router;