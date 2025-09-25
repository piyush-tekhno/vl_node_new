import axios from "axios";

export const editDeptList = async (token: string, dept_id: number, departmentData: { dept_name: string; dept_head: string }) => {
  try {
    const res = await axios.put(
      `http://192.168.29.13:3005/api/v1/dept/update-department?dept_id=${dept_id}`,
      departmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Update department response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error updating department:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};