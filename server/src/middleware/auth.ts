import { Request, Response, NextFunction, RequestHandler } from 'express';

export const apiKeyAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  console.log('Request headers:', req.headers);
  console.log('Received API Key:', apiKey);
  console.log('Valid API Key:', validApiKey);
  console.log('Keys match:', apiKey === validApiKey);
  console.log('API Key type:', typeof apiKey);
  console.log('Valid Key type:', typeof validApiKey);

  if (!apiKey || apiKey !== validApiKey) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or missing API key'
    });
    return;
  }

  next();
}; 