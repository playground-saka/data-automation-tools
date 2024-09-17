import axiosInstance from "@/lib/axios";

export async function getPermissions(roleId: number | null): Promise<Model.Permission.PermissionData[]> {
  const response = await axiosInstance.get(`/permission?roleId=${roleId}`);
  return response.data;
}