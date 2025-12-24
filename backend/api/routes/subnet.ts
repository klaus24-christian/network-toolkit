
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { calculateSubnet } from '../lib/subnetCalculator.js';

const router = Router();
const prisma = new PrismaClient();

const subnetInputSchema = z.object({
  ipAddress: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address format'),
  subnetMask: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid subnet mask format')
});

router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const validatedData = subnetInputSchema.parse(req.body);
    const result = calculateSubnet(validatedData);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    console.error('Subnet calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate subnet'
    });
  }
});

router.post('/save', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ipAddress, subnetMask, networkClass, ...result } = req.body;
    const userId = (req as any).user.userId;

    await prisma.savedSubnet.create({
      data: {
        userId,
        ipAddress,
        subnetMask,
        networkClass: networkClass || null,
        result: JSON.stringify(result)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subnet saved successfully'
    });
  } catch (error: any) {
    console.error('Save subnet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save subnet'
    });
  }
});

router.get('/saved', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const savedSubnets = await prisma.savedSubnet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formattedSubnets = savedSubnets.map((subnet: { id: any; ipAddress: any; subnetMask: any; networkClass: any; result: string; createdAt: { toISOString: () => any; }; }) => ({
      id: subnet.id,
      ipAddress: subnet.ipAddress,
      subnetMask: subnet.subnetMask,
      networkClass: subnet.networkClass,
      ...JSON.parse(subnet.result),
      createdAt: subnet.createdAt.toISOString()
    }));

    res.json({
      success: true,
      data: formattedSubnets
    });
  } catch (error: any) {
    console.error('Get saved subnets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch saved subnets'
    });
  }
});

router.delete('/saved/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const subnet = await prisma.savedSubnet.findFirst({
      where: { id, userId }
    });

    if (!subnet) {
      return res.status(404).json({
        success: false,
        error: 'Subnet not found'
      });
    }

    await prisma.savedSubnet.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Subnet deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete subnet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete subnet'
    });
  }
});

export { router as subnetRouter };
