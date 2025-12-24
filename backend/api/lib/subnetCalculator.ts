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

const ipToBinary = (ip: string): string => {
  return ip.split('.')
    .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
    .join('.');
};

const getCidrFromMask = (mask: string): number => {
  return mask.split('.')
    .map(octet => parseInt(octet).toString(2))
    .join('')
    .split('1')
    .length - 1;
};

const getNetworkAddress = (ip: string, mask: string): string => {
  const ipParts = ip.split('.').map(Number);
  const maskParts = mask.split('.').map(Number);
  
  return ipParts.map((part, i) => part & maskParts[i]).join('.');
};

const getBroadcastAddress = (network: string, mask: string): string => {
  const networkParts = network.split('.').map(Number);
  const maskParts = mask.split('.').map(Number);
  
  return networkParts.map((part, i) => part | (~maskParts[i] & 255)).join('.');
};

const getNetworkClass = (ip: string): string => {
  const firstOctet = parseInt(ip.split('.')[0]);
  
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)';
  
  return 'Unknown';
};

const getIpType = (ip: string): string => {
  const parts = ip.split('.').map(Number);
  const first = parts[0];
  const second = parts[1];
  
  if (first === 127) return 'Loopback';
  if (first === 10) return 'Private';
  if (first === 172 && second >= 16 && second <= 31) return 'Private';
  if (first === 192 && second === 168) return 'Private';
  if (first === 169 && second === 254) return 'Link-Local';
  
  return 'Public';
};

const getWildcardMask = (mask: string): string => {
  return mask.split('.')
    .map(octet => 255 - parseInt(octet))
    .join('.');
};

export const calculateSubnet = (input: SubnetInput): SubnetResult => {
  const { ipAddress, subnetMask } = input;
  
  const cidr = getCidrFromMask(subnetMask);
  const networkAddress = getNetworkAddress(ipAddress, subnetMask);
  const broadcastAddress = getBroadcastAddress(networkAddress, subnetMask);
  
  const networkParts = networkAddress.split('.').map(Number);
  const broadcastParts = broadcastAddress.split('.').map(Number);
  
  networkParts[3] += 1;
  broadcastParts[3] -= 1;
  
  const firstHost = networkParts.join('.');
  const lastHost = broadcastParts.join('.');
  
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = totalHosts - 2;
  
  return {
    ipAddress,
    subnetMask,
    cidr,
    networkAddress,
    broadcastAddress,
    firstHost,
    lastHost,
    totalHosts,
    usableHosts,
    wildcardMask: getWildcardMask(subnetMask),
    networkClass: getNetworkClass(ipAddress),
    ipType: getIpType(ipAddress),
    binarySubnetMask: ipToBinary(subnetMask)
  };
};