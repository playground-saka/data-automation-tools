import axiosInstance from "@/lib/axios";

export async function getCategories(isStatus:number | null = null): Promise<
  Model.Category.CategoryData[]
> {
  const response = await axiosInstance.get("/dim-kategori?is_status=" + isStatus);
  return response.data;
}

export async function postCategory(payload:any):Promise<Model.Category.CategoryData> {
  const response = await axiosInstance.post("/dim-kategori", {...payload});
  return response.data;
}

export async function putCategory(id:number,payload:any):Promise<Model.Category.CategoryData> {
  const response = await axiosInstance.put(`/dim-kategori/${id}`, {...payload});
  return response.data;
}

export async function deleteCategory(id:number):Promise<Model.Category.CategoryData> {
  const response = await axiosInstance.delete(`/dim-kategori/${id}`);
  return response.data;
}