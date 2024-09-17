import { z } from "zod";

export const schemaFormCustomer = z.object({
  pelangganId: z.string({
    required_error: "Pelanggan ID is required",
    invalid_type_error: "Pelanggan ID must be a string",
  }),
  namaPelanggan: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  kategoriId: z.string({
    required_error: "Category ID is required",
    invalid_type_error: "Category ID must be a string",
  }),
  statusPelanggan: z.string({
    required_error: "Status is required",
    invalid_type_error: "Status must be a string",
  })
});