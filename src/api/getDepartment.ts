import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const getDetpList = async (token : string) => {
  try {
    const res = await axios.get(
      "http://192.168.29.13:3005/api/v1/dept/get-all-departments", {
        headers : {
          Authorization : `Bearer ${token}`
        }
      }
    );
    console.log("Departments response:", res?.data?.data); // ✅ log before returning
    return res?.data?.data;
  } catch (error) {
    console.error("Error fetching department list:", error);
  }
};
