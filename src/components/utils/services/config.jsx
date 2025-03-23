import useAxios from "@/axios/interceptors"; 
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;


export const getAllUsers = async (data) => {
  
  const axiosInstance = useAxios(); // Get Axios instance
  console.log("Axios", axiosInstance)
  try {
    const response = await axiosInstance.get(`${apiUrl}/v1/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};
