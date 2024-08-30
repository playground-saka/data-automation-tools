import axiosInstance from "@/lib/axios";

export async function login(payload: any): Promise<Model.Auth.AuthData> {
  const response = await axiosInstance.post("/login", { ...payload });
  return response.data;
}
