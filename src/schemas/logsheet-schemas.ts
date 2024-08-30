import {z} from "zod";

export const schemaFormLogSheet = z.object({
  date: z.string({
      required_error: "Tanggal is required",
      invalid_type_error: "Pelanggan ID must be a string",
    }).regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
      message: "Invalid date format. Expected YYYY-MM.",
    }),
  pelangganId: z.string({
    required_error: "Pelanggab is required",
    invalid_type_error: "Pelanggan ID must be a string",
  }),
});