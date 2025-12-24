
import { apiService } from './api';

interface SubnetInput {
  ipAddress: string;
  subnetMask: string;
}

interface SubnetResult {
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

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const subnetService = {
  async calculate(input: SubnetInput): Promise<SubnetResult> {
    const response = await apiService.post<ApiResponse<SubnetResult>>(
      '/subnet/calculate',
      input
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Subnet calculation failed');
    }
    
    return response.data;
  },

  async getSaved(): Promise<SubnetResult[]> {
    const response = await apiService.get<ApiResponse<SubnetResult[]>>(
      '/subnet/saved'
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch saved subnets');
    }
    
    return response.data;
  },

  async save(data: SubnetResult): Promise<void> {
    const response = await apiService.post<ApiResponse>(
      '/subnet/save',
      data
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to save subnet');
    }
  },

  async delete(id: string): Promise<void> {
    const response = await apiService.delete<ApiResponse>(
      `/subnet/saved/${id}`
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete subnet');
    }
  }
};
