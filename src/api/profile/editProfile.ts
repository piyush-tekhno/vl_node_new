import axios from "axios";

export interface EditProfileData {
  name: string;
  email: string;
  mobile_no: string;
  city: string;
}

export const editProfile = async (profileData: EditProfileData, token: string) => {
  try {
    const res = await axios.put(
      "http://20.235.242.228:2005/api/v1/auth/update-profile",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};