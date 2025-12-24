// Types locaux au lieu d'importer
interface IPValidationResult {
  valid: boolean;
  version?: 4 | 6;
  type?: string;
  message?: string;
}

/**
 * Validate IPv4 address
 */
export const validateIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

/**
 * Validate IPv6 address
 */
export const validateIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(ip);
};

/**
 * Get IP address type
 */
export const getIPType = (ip: string): string => {
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

/**
 * Main IP validation function
 */
export const validateIP = (ip: string): IPValidationResult => {
  if (!ip || ip.trim() === '') {
    return {
      valid: false,
      message: 'IP address cannot be empty'
    };
  }
  
  const trimmedIP = ip.trim();
  
  if (validateIPv4(trimmedIP)) {
    return {
      valid: true,
      version: 4,
      type: getIPType(trimmedIP),
      message: 'Valid IPv4 address'
    };
  }
  
  if (validateIPv6(trimmedIP)) {
    return {
      valid: true,
      version: 6,
      type: 'IPv6',
      message: 'Valid IPv6 address'
    };
  }
  
  return {
    valid: false,
    message: 'Invalid IP address format'
  };
};