import useAxios from "@/axios/interceptors"; 
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;


export const getAllUsers = async (data) => {
  
  const axiosInstance = useAxios(); // Get Axios instance

  try {
    const response = await axiosInstance.get(`${apiUrl}/config/v1/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};
