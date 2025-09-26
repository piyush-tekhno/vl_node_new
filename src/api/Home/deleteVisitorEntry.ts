// src/api/Home/deleteVisitorEntry.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.29.13:3005/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface DeleteVisitorResponse {
  success: boolean;
  message: string;
  data: {
    log_id: string;
  };
  statusCode: number;
  accessToken: string;
}

class DeleteVisitorService {
  async deleteVisitor(log_id: number, token: string): Promise<DeleteVisitorResponse> {
    try {
      const response = await apiClient.delete(`/visitors/delete-visitor`, {
        params: { log_id },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting visitor:', error);
      
      // Better error logging to see what's happening
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        throw new Error(error.response.data?.message || `HTTP ${error.response.status}: Failed to delete visitor`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        throw new Error('Network error: Could not connect to server');
      } else {
        throw new Error(error.message || 'Failed to delete visitor');
      }
    }
  }
}

export const deleteVisitorService = new DeleteVisitorService();