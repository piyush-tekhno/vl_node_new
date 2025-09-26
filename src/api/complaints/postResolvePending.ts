

export const resolveComplaint = async (token: string, complaintId: number): Promise<any> => {
  try {
    const response = await fetch(
      `http://192.168.29.13:3005/api/v1/visitors/update-complaint-status?complaint_id=${complaintId}&status=resolved`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error resolving complaint:', error);
    throw error;
  }
};