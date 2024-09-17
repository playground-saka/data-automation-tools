import { z } from "zod";

export const schemaFormRole = z.object({
  roleName: z
    .string({
      required_error: "Role Name is required",
      invalid_type_error: "Role Name must be a string",
    })
    .nonempty({ message: "Role Name is required" }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .nullable(),
});