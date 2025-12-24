
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { scanPorts } from '../lib/portScanner.js';

const router = Router();
const prisma = new PrismaClient();

const scanInputSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  startPort: z.number().min(1).max(65535),
  endPort: z.number().min(1).max(65535),
  timeout: z.number().optional()
});

router.post('/scan', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedData = scanInputSchema.parse(req.body);
    const userId = (req as any).user.userId;

    const result = await scanPorts(validatedData);

    await prisma.scanHistory.create({
      data: {
        userId,
        targetHost: validatedData.host,
        portRange: `${validatedData.startPort}-${validatedData.endPort}`,
        openPorts: JSON.stringify(result.openPorts),
        closedPorts: result.closedCount,
        scanTime: result.scanTime
      }
    });

    res.json({
      success: true,
      data: {
        host: validatedData.host,
        openPorts: result.openPorts,
        closedPorts: result.closedCount,
        scanTime: result.scanTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    console.error('Port scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to perform port scan'
    });
  }
});

router.get('/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const scanHistory = await prisma.scanHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formattedHistory = scanHistory.map((scan: { id: any; targetHost: any; portRange: any; openPorts: string; closedPorts: any; scanTime: any; createdAt: { toISOString: () => any; }; }) => ({
      id: scan.id,
      host: scan.targetHost,
      portRange: scan.portRange,
      openPorts: JSON.parse(scan.openPorts),
      closedPorts: scan.closedPorts,
      scanTime: scan.scanTime,
      timestamp: scan.createdAt.toISOString()
    }));

    res.json({
      success: true,
      data: formattedHistory
    });
  } catch (error: any) {
    console.error('Get scan history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan history'
    });
  }
});

router.delete('/history/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const scan = await prisma.scanHistory.findFirst({
      where: { id, userId }
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan history not found'
      });
    }

    await prisma.scanHistory.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Scan history deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete scan history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete scan history'
    });
  }
});

export { router as scannerRouter };
