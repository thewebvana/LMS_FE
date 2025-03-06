import axios from "axios";
import Cookies from "js-cookie";
import { useStore } from "zustand";
// import { userState } from "@/zustandStore/zUser";
// import { modalState } from "@/zustandStore/zModal";

const useAxios = () => {
  // const { selected_team } = useStore(userState, (state) => state);

  // const { zOpenModal, zCloseModal } = useStore(modalState, (state) => state);
  // const [formatDate, formatTime, formatCurrency] = useDatetimezone();

  const axiosInstance = axios.create({
    // baseURL: API_URL
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const X_CSRF_Token = Cookies.get("X_CSRF_Token");

      config.headers["Content-Type"] = "application/json";
      config.headers["X-CSRF-Token"] = X_CSRF_Token;
      config.withCredentials = true;

      const DefaultParams = {
        // selected_team: selected_team,
      };
      config.params = config.params ? { ...DefaultParams, ...config.params } : DefaultParams;

      if (config.method === "get") {
        config.data = {};
      }

      if (config.method === "post") {
        let toastId = "";
        if (!config?.params?.hide_toast) {
          toastId = loadingToast("Please wait, Loading...");
        }

        config.headers["toastId"] = toastId;

        const DefaultData = {};

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
          // updateToast(message, response?.data?.status, toastId);
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
          updateToast(errData, "error", toastId);
        }
      }
      return Promise.reject(error);
    }
  );

  return [axiosInstance];
};

export default useAxios;
