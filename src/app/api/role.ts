import axiosInstance from "@/lib/axios";

export async function getRoles(): Promise<Model.DataTable.ResponseDt<Model.Role.RoleData[]>> {
  const response = await axiosInstance.get("/role");
  return response.data;
}

export async function getAllRole(): Promise<Model.Role.RoleData[]> {
  const response = await axiosInstance.get("/role-all");
  return response.data;
}

export async function postRole(payload:any): Promise<Model.Role.RoleData> {
  const response = await axiosInstance.post("/role", payload);
  return response.data;
}

export async function putRole(id:number,payload:any): Promise<Model.Role.RoleData> {
  const response = await axiosInstance.put(`/role/${id}`, payload);
  return response.data;
}

export async function deleteRole(id:number): Promise<Model.Role.RoleData> {
  const response = await axiosInstance.delete("/role/" + id);
  return response.data;
}

export async function putRolePermission(roleId: number,permissionIds: number[]): Promise<Model.Role.RoleData> {
  const response = await axiosInstance.put(`/role-permission/${roleId}`, {permissionIds:permissionIds});
  return response.data;
}
