
import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const validateIPSchema = z.object({
  ip: z.string().min(1, 'IP address is required')
});

const validateIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

const validateIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$/;
  return ipv6Regex.test(ip);
};

const getIPType = (ip: string): string => {
  if (!validateIPv4(ip)) return 'Unknown';
  
  const parts = ip.split('.').map(Number);
  const first = parts[0];
  const second = parts[1];
  
  if (first === 127) return 'Loopback';
  if (first === 10) return 'Private (Class A)';
  if (first === 172 && second >= 16 && second <= 31) return 'Private (Class B)';
  if (first === 192 && second === 168) return 'Private (Class C)';
  if (first === 169 && second === 254) return 'Link-Local (APIPA)';
  if (first >= 224 && first <= 239) return 'Multicast (Class D)';
  if (first >= 240) return 'Reserved (Class E)';
  
  return 'Public';
};

router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { ip } = validateIPSchema.parse(req.body);
    
    if (!ip || ip.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'IP address cannot be empty'
      });
    }
    
    const trimmedIP = ip.trim();
    
    if (validateIPv4(trimmedIP)) {
      return res.json({
        success: true,
        data: {
          valid: true,
          version: 4,
          type: getIPType(trimmedIP),
          message: 'Valid IPv4 address'
        }
      });
    }
    
    if (validateIPv6(trimmedIP)) {
      return res.json({
        success: true,
        data: {
          valid: true,
          version: 6,
          type: 'IPv6',
          message: 'Valid IPv6 address'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        valid: false,
        message: 'Invalid IP address format'
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    console.error('IP validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate IP address'
    });
  }
});

router.post('/lookup', async (req: Request, res: Response) => {
  try {
    const { ip } = validateIPSchema.parse(req.body);
    
    if (!validateIPv4(ip) && !validateIPv6(ip)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid IP address'
      });
    }

    const mockData = {
      ip,
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      isp: 'Example ISP',
      org: 'Example Organization',
      timezone: 'America/Los_Angeles',
      lat: 37.7749,
      lon: -122.4194
    };

    res.json({
      success: true,
      data: mockData
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    console.error('IP lookup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to lookup IP address'
    });
  }
});

router.post('/ping', async (req: Request, res: Response) => {
  try {
    const { host } = z.object({ host: z.string() }).parse(req.body);
    
    const mockPingTime = Math.floor(Math.random() * 50) + 10;
    const mockSuccess = Math.random() > 0.1;

    res.json({
      success: true,
      data: {
        host,
        alive: mockSuccess,
        time: mockSuccess ? mockPingTime : undefined,
        error: mockSuccess ? undefined : 'Host unreachable'
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    console.error('Ping error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to ping host'
    });
  }
});

export { router as ipToolsRouter };
