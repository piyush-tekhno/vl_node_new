import axios from 'axios';

interface UpdateComplaintData {
  complainer_name: string;
  complainer_mobile: string;
  complainer_city: string;
  complaint_reason: string;
}

export const updateComplaint = async (
  token: string, 
  complaintId: number, 
  complaintData: UpdateComplaintData
): Promise<any> => {
  try {
    const response = await axios.put(
      `http://192.168.29.13:3005/api/v1/visitors/update-complaint`,
      complaintData,
      {
        params: {
          complaint_id: complaintId
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating complaint:', error);
    
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
      throw new Error(`HTTP error! status: ${error.response.status}, message: ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Request error:', error.request);
      throw new Error('Network error: Could not reach the server');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};