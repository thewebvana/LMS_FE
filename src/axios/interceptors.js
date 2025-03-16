import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import Cookies from "js-cookie";
import { useStore } from "zustand";
import { toast } from "sonner";
// import { userState } from "@/zustandStore/zUser";
// import { modalState } from "@/zustandStore/zModal";
const apiUrl = import.meta.env.VITE_API_URL;

const useAxios = () => {

  const { user, token, isAuthenticated } = useAuthStore();
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    // withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      // const X_CSRF_Token = Cookies.get("X_CSRF_Token");

      config.headers["Content-Type"] = "application/json";
      // config.headers["X-CSRF-Token"] = X_CSRF_Token;
      // config.withCredentials = true;

      const DefaultParams = {
        role_id: user.role_id,
        user_id: user.id
      };


      if (config.method === "get") {
        config.params = config.params ? { ...DefaultParams, ...config.params } : DefaultParams;
        config.data = {};
      }

      if (config.method === "post") {

        let toastId = "";

        if (!config?.params?.hide_toast) {
          toastId = toast.loading("Please wait, Loading...");
          config.headers["toastId"] = toastId;
        }

        const DefaultData = {
          role_id: user.role_id,
          user_id: user.id
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

      if (response.config.method === "post") {
        const message = response?.data?.message;
        if (!response.config?.params?.hide_toast) {
          toast.dismiss(toastId);
          toast.success(message)
          // zCloseModal();
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

      if (error?.config?.method === "post") {

        const errData = error?.response?.data?.message;
        const toastId = error.config.headers.toastId;

        if (!error.config?.params?.hide_toast) {

          toast.dismiss();
          setTimeout(() => {
            toast.error(errData)
          }, 1000);
          console.log("errData", toastId)
        }
      }
      return Promise.reject(error);
    }
  );

  return [axiosInstance];
};

export default useAxios;
