import axiosInstance from "@/lib/axios";

export async function getCustomers(per_page=10,current_page=1): Promise<
  Model.DataTable.ResponseDt<Model.Customer.CustomerData[]>
> {
  const response = await axiosInstance.get(`/pelanggan?page=${current_page}&per_page=${per_page}`);
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