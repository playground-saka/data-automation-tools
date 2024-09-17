import { z } from "zod";

export const schemaFormcategory = z.object({
  namaKategori: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }).nonempty({message: "Name is required"}),
  statusKategori: z.string({
    required_error: "Status is required",
    invalid_type_error: "Status must be a string",
  }),
});