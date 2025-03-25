import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import Cookies from "js-cookie";
import { useStore } from "zustand";
import { toast } from "sonner";
import useModalStore from "@/store/useModalStore";
// import { userState } from "@/zustandStore/zUser";
// import { modalState } from "@/zustandStore/zModal";
const apiUrl = import.meta.env.VITE_API_URL;

const useAxios = () => {

  const authState = useAuthStore.getState(); 
  const modalState = useModalStore.getState(); 

  const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const JWT_TOKEN = Cookies.get("token");

      config.headers["Content-Type"] = "application/json";
      config.headers["Authorization"] =  `Bearer ${JWT_TOKEN}`;
      config.withCredentials = true;

      const DefaultParams = {
        logged_in_role: authState?.user?.role,
        logged_in_user_id: authState?.user?.user_id,
        logged_in_email: authState?.user?.email,
        logged_in_full_name: authState?.user?.full_name,
        
      };


      if (config.method === "get" || config.method === "delete") {
        config.params = config.params ? { ...DefaultParams, ...config.params } : DefaultParams;
        config.data = {};
      }

      if (config.method === "post" || config.method === "put") {

        let toastId = "";

        if (!config?.params?.hide_toast) {
          toastId = toast.loading("Please wait, Loading...");
          config.headers["toastId"] = toastId;
        }

        const DefaultData = {
          logged_in_role: authState?.user?.role,
          logged_in_user_id: authState?.user?.user_id,
          logged_in_email: authState?.user?.email,
          logged_in_full_name: authState?.user?.full_name,
          
        };

        const contentType = config.data?.contentType;

        if (contentType === "multipart/form-data") {
          config.headers["Content-Type"] = "multipart/form-data";
          const formdata = config.data?.formData;
          Object.keys(DefaultData).forEach((key) => {
            formdata.set(key, DefaultData[key]);
          });
          config.data = formdata;
        } else {
          config.data = config.data ? { ...DefaultData, ...config.data } : DefaultData;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    async (response) => {
      const toastId = response.config.headers.toastId;

      if (response.config.method === "post" || response.config.method === "put") {
        const message = response?.data?.message;
        if (!response.config?.params?.hide_toast) {
          toast.dismiss();
          modalState.closeModal()
          setTimeout(() => {
            toast.success(message)
          }, 100);
        }
      }

      if (
        response.config?.url &&
        !response.config.url.startsWith("/api/appointment") &&
        !response.config.url.startsWith("/api/patients/customer_transactions_list")
      ) {
        const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g;
        const jsonString = JSON.stringify(response?.data?.data);
        // const convertedJsonString = jsonString?.replace(regex, formatDate);
        const convertedJsonString = "";
        const parsedJson = convertedJsonString ? JSON.parse(convertedJsonString) : convertedJsonString;

        if (typeof parsedJson === "object" && parsedJson !== null) {
          response.data.data = parsedJson;
        }
      }

      return response;
    },

    async (error) => {

      if (error?.config?.method === "post" || error?.config?.method === "put") {

        const errData = error?.response?.data?.message;
        const toastId = error.config.headers.toastId;

        if (!error.config?.params?.hide_toast) {
          toast.dismiss();
        }
      }
      setTimeout(() => {
        toast.error(error?.response?.data?.message || "something went wrong")
      }, 1000);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
