// src/api/Home/editVisitorLogs.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.29.13:3005/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface UpdateVisitorRequest {
  visitor_name: string;
  email: string;
  mobile_no: string;
  city: string;
  reason: string;
}

export interface UpdateVisitorResponse {
  success: boolean;
  message: string;
  data: {
    log_id: string;
  };
  statusCode: number;
  accessToken: string;
}

class EditVisitorService {
  async updateVisitor(
    log_id: number, 
    visitorData: UpdateVisitorRequest, 
    token: string
  ): Promise<UpdateVisitorResponse> {
    try {
      const response = await apiClient.put(
        `/visitors/update-visitor?log_id=${log_id}`,
        visitorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating visitor:', error);
      
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        throw new Error(error.response.data?.message || `HTTP ${error.response.status}: Failed to update visitor`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        throw new Error('Network error: Could not connect to server');
      } else {
        throw new Error(error.message || 'Failed to update visitor');
      }
    }
  }
}

export const editVisitorService = new EditVisitorService();