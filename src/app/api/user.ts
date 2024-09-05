import axiosInstance from "@/lib/axios";

export async function getUsers(): Promise<
  Model.User.UserData[]
> {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function postUser(payload:any):Promise<Model.User.UserData> {
  const response = await axiosInstance.post("/register", {...payload});
  return response.data;
}

export async function putUser(id:number,payload:any):Promise<Model.User.UserData> {
  const response = await axiosInstance.put(`/user/${id}`, {...payload});
  return response.data;
}

export async function deleteUser(id:number):Promise<Model.User.UserData> {
  const response = await axiosInstance.delete(`/user/${id}`);
  return response.data;
}