
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { subnetRouter } from './routes/subnet.js';
import { scannerRouter } from './routes/scanner.js';
import { ipToolsRouter } from './routes/ipTools.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.API_PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Network Toolkit API'
  });
});

// API Routes
app.use('/auth', authRouter);
app.use('/subnet', subnetRouter);
app.use('/scanner', scannerRouter);
app.use('/ip-tools', ipToolsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   Network Toolkit API Server             ║
║   Status: Running                         ║
║   Port: ${PORT}                          ║
║   Environment: ${process.env.NODE_ENV || 'development'}       ║
║   Time: ${new Date().toLocaleString()}     ║
╚═══════════════════════════════════════════╝
  `);
});

export default app;
