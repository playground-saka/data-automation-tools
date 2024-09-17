import axiosInstance from "@/lib/axios";

export async function getFormulas(
  per_page = 10,
  current_page = 1,
  search = ""
): Promise<Model.DataTable.ResponseDt<Model.Formula.FormulaData[]>> {
  const response = await axiosInstance.get(`/formula`, {
    params: {
      page: current_page,
      per_page: per_page,
      search: search
    }
  });
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