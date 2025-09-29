import axios from "axios";

export const deleteDeptList = async (token: string, dept_id: number) => {
  try {
    const res = await axios.delete(
      `http://20.235.242.228:2005/api/v1/dept/delete-department`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          dept_id: dept_id
        }
      }
    );
    console.log("Delete department response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error deleting department:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};