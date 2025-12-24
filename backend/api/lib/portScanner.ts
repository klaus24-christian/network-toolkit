
import net from 'net';

export interface ScanOptions {
  host: string;
  startPort: number;
  endPort: number;
  timeout?: number;
}

export interface PortResult {
  port: number;
  state: 'open' | 'closed';
  service?: string;
}

const COMMON_SERVICES: Record<number, string> = {
  20: 'FTP-DATA',
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  143: 'IMAP',
  443: 'HTTPS',
  445: 'SMB',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  6379: 'Redis',
  8080: 'HTTP-Proxy',
  27017: 'MongoDB',
};

const scanPort = (host: string, port: number, timeout: number = 2000): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    const onConnect = () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(true);
      }
    };

    const onError = () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    };

    const onTimeout = () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    };

    socket.setTimeout(timeout);
    socket.once('connect', onConnect);
    socket.once('error', onError);
    socket.once('timeout', onTimeout);

    socket.connect(port, host);
  });
};

export const scanPorts = async (options: ScanOptions): Promise<{
  openPorts: PortResult[];
  closedCount: number;
  scanTime: number;
}> => {
  const { host, startPort, endPort, timeout = 2000 } = options;
  const startTime = Date.now();
  const openPorts: PortResult[] = [];
  let closedCount = 0;

  if (startPort < 1 || startPort > 65535 || endPort < 1 || endPort > 65535) {
    throw new Error('Invalid port range. Ports must be between 1 and 65535');
  }

  if (startPort > endPort) {
    throw new Error('Start port must be less than or equal to end port');
  }

  const portCount = endPort - startPort + 1;
  if (portCount > 1000) {
    throw new Error('Port range too large. Maximum 1000 ports per scan');
  }

  const batchSize = 50;
  const ports = Array.from({ length: portCount }, (_, i) => startPort + i);

  for (let i = 0; i < ports.length; i += batchSize) {
    const batch = ports.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (port) => {
        const isOpen = await scanPort(host, port, timeout);
        return { port, isOpen };
      })
    );

    batchResults.forEach(({ port, isOpen }) => {
      if (isOpen) {
        openPorts.push({
          port,
          state: 'open',
          service: COMMON_SERVICES[port]
        });
      } else {
        closedCount++;
      }
    });
  }

  const scanTime = Date.now() - startTime;

  return {
    openPorts: openPorts.sort((a, b) => a.port - b.port),
    closedCount,
    scanTime
  };
};
