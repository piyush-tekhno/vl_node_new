
export const deleteComplaint = async (token: string, complaintId: number): Promise<any> => {
  try {
    const response = await fetch(
      `http://20.235.242.228:2005/api/v1/visitors/delete-complaint?complaint_id=${complaintId}`,
      {
        method: 'DELETE',
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
    console.error('Error deleting complaint:', error);
    throw error;
  }
};