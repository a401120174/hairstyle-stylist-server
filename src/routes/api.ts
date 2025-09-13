import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import hairstyleRoutes from './hairstyle';

const router = Router();

// 健康檢查路由
router.get('/health', healthCheck);

// 髮型相關路由
router.use('/hairstyle', hairstyleRoutes);

export default router;