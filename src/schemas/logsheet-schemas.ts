import {z} from "zod";

export const schemaFormLogSheet = z.object({
  bulanId: z.string({
    required_error: "Month is required",
    invalid_type_error: "Month ID must be a number",
  }),
});