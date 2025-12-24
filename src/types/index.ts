
// ============================================
// USER TYPES
// ============================================
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// SUBNET CALCULATOR TYPES
// ============================================
export interface SubnetInput {
  ipAddress: string;
  subnetMask: string;
}

export interface SubnetResult {
  ipAddress: string;
  subnetMask: string;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  wildcardMask: string;
  networkClass: string;
  ipType: string;
  binarySubnetMask: string;
}

// ============================================
// IP TOOLS TYPES
// ============================================
export interface IPValidationResult {
  valid: boolean;
  version?: 4 | 6;
  type?: string;
  message?: string;
}

export interface IPLookupResult {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  org?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
}

export interface PingResult {
  host: string;
  alive: boolean;
  time?: number;
  error?: string;
}

// ============================================
// PORT SCANNER TYPES
// ============================================
export interface PortScanInput {
  host: string;
  startPort: number;
  endPort: number;
  timeout?: number;
}

export interface OpenPort {
  port: number;
  state: 'open' | 'closed' | 'filtered';
  service?: string;
}

export interface PortScanResult {
  host: string;
  openPorts: OpenPort[];
  closedPorts: number;
  scanTime: number;
  timestamp: string;
}

export interface ScanProgress {
  current: number;
  total: number;
  percentage: number;
  scanning: boolean;
}

// ============================================
// NETWORK DIAGRAM TYPES
// ============================================
export interface NetworkNode {
  id: string;
  label: string;
  type: 'router' | 'switch' | 'server' | 'client' | 'firewall' | 'cloud';
  ipAddress?: string;
  x: number;
  y: number;
}

export interface NetworkLink {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface NetworkDiagram {
  id?: string;
  name: string;
  description?: string;
  nodes: NetworkNode[];
  links: NetworkLink[];
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// THEME TYPES
// ============================================
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
