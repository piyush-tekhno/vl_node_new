// src/api/addDepartment.ts
import axios from "axios";

export const addDepartment = async (token: string, dept: { dept_name: string; dept_head: string }) => {
  try {
    const res = await axios.post(
      "http://192.168.29.13:3005/api/v1/dept/add-department",
      dept,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Department added:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};
