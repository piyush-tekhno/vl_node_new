import axios from "axios";

export const getProfileInfo = async () => {
    const res = await axios.get('http://192.168.29.13:3005/api/v1/auth/get-user-profile')
    return res.data.data;
}