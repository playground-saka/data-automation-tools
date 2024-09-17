import axiosInstance from "@/lib/axios";

// export async function getUsers(): Promise<
//   Model.User.UserData[]
// > {
//   const response = await axiosInstance.get("/users");
//   return response.data;
// }

export async function getUsers(
  per_page = 10,
  current_page = 1,
  search = ""
): Promise<Model.DataTable.ResponseDt<Model.User.UserData[]>> {
  const response = await axiosInstance.get(`/users`, {
    params: {
      page: current_page,
      per_page: per_page,
      search: search
    }
  });
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