import { apiService } from './api';
import type { PortScanInput, PortScanResult, ApiResponse } from '../types';

export const scannerService = {
  /**
   * Start port scan
   */
  async scan(input: PortScanInput): Promise<PortScanResult> {
    const response = await apiService.post<ApiResponse<PortScanResult>>(
      '/scanner/scan',
      input
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Port scan failed');
    }
    
    return response.data;
  },

  /**
   * Get scan history
   */
  async getHistory(): Promise<PortScanResult[]> {
    const response = await apiService.get<ApiResponse<PortScanResult[]>>(
      '/scanner/history'
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch scan history');
    }
    
    return response.data;
  },

  /**
   * Delete scan from history
   */
  async deleteHistory(id: string): Promise<void> {
    const response = await apiService.delete<ApiResponse>(
      `/scanner/history/${id}`
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete scan history');
    }
  }
};