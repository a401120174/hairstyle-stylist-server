import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// 中間件設定
app.use(helmet()); // 安全性中間件
app.use(cors()); // 跨域請求
app.use(morgan('combined')); // 日誌記錄
app.use(express.json()); // 解析 JSON 請求體
app.use(express.urlencoded({ extended: true })); // 解析 URL 編碼請求體

// 基本路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Hairstyle Stylist Server!',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// API 路由
app.use('/api', apiRoutes);

// 404 錯誤處理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// 全域錯誤處理中間件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

export default app;