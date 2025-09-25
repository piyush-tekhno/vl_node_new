import axios from "axios";
import { useAuth } from "@/src/context/AuthContext";

export const addComplaint = async (
  complaintData: {
    dept_id: number;
    complainer_name: string;
    complainer_mobile: string;
    complainer_city: string;
    complaint_reason: string;
  },
  token: string
) => {
  try {
    const res = await axios.post(
      "http://192.168.29.13:3005/api/v1/visitors/register-complaints",
      complaintData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Complaint submitted successfully:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error submitting complaints", error);
    throw error;
  }
};
