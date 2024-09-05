import axios, { AxiosInstance } from "axios";
import { store } from "@/store/store";
import { setLogout } from "@/store/slices/authSlice";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosInstance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    // If there's a token, add it to the header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof config.headers["Content-Type"] === "undefined") {
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { status, data } = error.response || {};
    if (status === 400 && data.error === "Invalid token") {
      store.dispatch(setLogout());
      
      // Handle navigation in a React component or custom function
      if (typeof window !== "undefined") {
        const { push } = (await import("next/router")).useRouter();
        push("/login");
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
