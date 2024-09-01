import axiosInstance from "@/lib/axios";

export async function getFormulas(): Promise<
  Model.Formula.FormulaData[]
> {
  const response = await axiosInstance.get("/formula");
  return response.data;
}

export async function postFormula(payload:any):Promise<Model.Formula.FormulaData> {
  const response = await axiosInstance.post("/formula", { ...payload });
  return response.data;
}

export async function putFormula(id:number,payload:any):Promise<Model.Formula.FormulaData> {
  const response = await axiosInstance.put(`/formula/${id}`, { ...payload });
  return response.data;
}

export async function deleteFormula(id:number):Promise<Model.Formula.FormulaData> {
  const response = await axiosInstance.delete(`/formula/${id}`);
  return response.data;
}