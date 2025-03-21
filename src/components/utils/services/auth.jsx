import useAxios from "@/axios/interceptors";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const registerUser = async (data) => {

  try {
    const response = await axios.post(`${apiUrl}/auth/v1/register`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const Api_login = async (data) => {

  try {
    const response = await axios.post(`${apiUrl}/auth/v1/login`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const getAllUsers = async (data) => {

  try {
    const response = await axios.get(`${apiUrl}/v1/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};
