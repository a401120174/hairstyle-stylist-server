import { Request, Response } from 'express';
import { HealthCheckResponse } from '../types/index';

export const healthCheck = (req: Request, res: Response): void => {
  const healthData: HealthCheckResponse = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };

  res.status(200).json(healthData);
};