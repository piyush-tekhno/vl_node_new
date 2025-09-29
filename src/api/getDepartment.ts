import axios from "axios";

export const getDetpList = async (token : string) => {
  try {
    const res = await axios.get(
      "http://20.235.242.228:2005/api/v1/dept/get-all-departments", {
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
