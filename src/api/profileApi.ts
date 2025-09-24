import axios from "axios";

export const getProfileInfo = async (token: string) => {
  try {
    console.log("🔑 API Function - Token received:", token ? "Yes" : "No");

    if (!token) {
      throw new Error("No token available for API call");
    }

    const response = await axios.get(
      "http://192.168.29.13:3005/api/v1/auth/get-user-profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API Response:", response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "API call failed");
    }
  } catch (error: any) {
    console.log("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
};