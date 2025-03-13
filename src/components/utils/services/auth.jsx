import useAxios from "@/axios/interceptors";

const apiUrl = import.meta.env.VITE_API_URL;

export const registerUser = async (data) => {
  const Axios = useAxios()[0]; // Get Axios instance

  try {
    const response = await Axios.post(`${apiUrl}/auth/v1/register`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const getAllUsers = async (data) => {
  const Axios = useAxios()[0]; // Get Axios instance

  try {
    const response = await Axios.get(`${apiUrl}/v1/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};
