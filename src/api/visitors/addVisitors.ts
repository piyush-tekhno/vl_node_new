import axios from "axios";
export const addVisitor = async (
  visitorData: {
    dept_id: number;
    visitor_name: string;
    email: string;
    mobile_no: string;
    city: string;
    reason: string;
    visit_date: string;
    visitorPhoto?: any;
  },
  token: string
) => {
  try {
    const formData = new FormData();
    
    formData.append('dept_id', visitorData.dept_id.toString());
    formData.append('visitor_name', visitorData.visitor_name);
    formData.append('email', visitorData.email);
    formData.append('mobile_no', visitorData.mobile_no);
    formData.append('city', visitorData.city);
    formData.append('reason', visitorData.reason);
    formData.append('visit_date', visitorData.visit_date);
    
    if (visitorData.visitorPhoto) {
      // For React Native file object
      formData.append('visitorPhoto', {
        uri: visitorData.visitorPhoto.uri,
        type: visitorData.visitorPhoto.type || 'image/jpeg',
        name: visitorData.visitorPhoto.name || 'photo.jpg',
      } as any);
    }

    const res = await axios.post(
      "http://192.168.29.13:3005/api/v1/visitors/add-visitors",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return res.data;
  } catch (error) {
    console.error("Error adding visitor", error);
    throw error;
  }
};