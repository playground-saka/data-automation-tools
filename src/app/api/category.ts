import axiosInstance from "@/lib/axios";

export async function getCategories(): Promise<
  Model.Category.CategoryData[]
> {
  const response = await axiosInstance.get("/dim-kategori");
  return response.data;
}

export async function postCategory(payload:any):Promise<Model.Category.CategoryData> {
  const response = await axiosInstance.post("/dim-kategori", {...payload});
  return response.data;
}