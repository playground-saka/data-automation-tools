import axios from "axios";
import { store } from "@/store/store";
import { useRouter } from "next/navigation";
import { setLogout } from "@/store/slices/authSlice";
import { Router } from "next/router";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL,
});


axiosInstance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    // Jika ada token, tambahkan ke header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof config.headers["Content-Type"] === "undefined"){
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
  (error) => {
    const { status, data } = error.response || {};
    if (status === 400 && data.error === "Invalid token") {
      store.dispatch(setLogout());
      Router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
