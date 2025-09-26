import axios from "axios";

export const getAllComplaints = async (token: string, status: "pending" | "resolved" ) => {
  try {
    const res = await axios.get(
      `http://192.168.29.13:3005/api/v1/visitors/get-complaint-lists?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data; // only return the "data" array
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
};
