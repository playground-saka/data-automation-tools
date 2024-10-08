import axiosInstance from "@/lib/axios";

export async function getCustomers(
  per_page = 10,
  current_page = 1,
  search = ""
): Promise<Model.DataTable.ResponseDt<Model.Customer.CustomerData[]>> {
  const response = await axiosInstance.get(`/pelanggan`, {
    params: {
      page: current_page,
      per_page: per_page,
      search: search
    }
  });
  return response.data;
}

export async function getAllCustomers(): Promise<Model.Customer.CustomerAllData[]> {
  const response = await axiosInstance.get("/get-all-pelanggan");
  return response.data;
}

export async function postCustomer(payload:any): Promise<Model.Customer.CustomerData> {
  const response = await axiosInstance.post("/pelanggan", {...payload});
  return response.data;
}

export async function putCustomer(id:number,payload:any): Promise<Model.Customer.CustomerData> {
  const response = await axiosInstance.put(`/pelanggan/${id}`, {...payload});
  return response.data;
}
export async function deleteCustomer(id:number): Promise<Model.Customer.CustomerData> {
  const response = await axiosInstance.delete(`/pelanggan/${id}`);
  return response.data;
}

export async function detailCustomer(id:number): Promise<Model.Customer.CustomerData> {
  const response = await axiosInstance.get(`/pelanggan/${id}`);
  return response.data;
}