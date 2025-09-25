import axios from "axios";

export interface UpdateProfilePhotoResponse {
  success: boolean;
  message: string;
  data: any;
  statusCode: number;
  accessToken: string;
}

export const updateProfilePhoto = async (token: string, file: any) => {
  try {
    // Create FormData properly for React Native
    const formData = new FormData();
    
    // Handle different file structures (camera vs gallery)
    let fileData = {
      uri: file.uri,
      type: file.mimeType || file.type || 'image/jpeg',
      name: file.fileName || file.filename || `profile-${Date.now()}.jpg`
    };

    // If it's from gallery, ensure we have the correct properties
    if (!fileData.type && file.uri) {
      // Extract file extension from URI to determine type
      const extension = file.uri.split('.').pop()?.toLowerCase();
      fileData.type = `image/${extension === 'png' ? 'png' : 'jpeg'}`;
    }

    formData.append('profilePhoto', fileData as any);

    console.log("📤 Uploading file:", fileData);

    const res = await axios.patch(
      'http://192.168.29.13:3005/api/v1/auth/update-profile-photo',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );
    
    console.log("✅ Upload successful:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error updating profile photo:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};