import { z } from "zod";

export const schemaFormUser = z
  .object({
    
    username: z.string({
      required_error: "Username lengkap is required",
      invalid_type_error: "Username lengkap must be a string",
    }),
    fullName: z.string({
      required_error: "Nama lengkap is required",
      invalid_type_error: "Nama lengkap must be a string",
    }),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .nonempty({ message: "Email is required" })
      .email({
        message: "Email must be a valid email",
      }),
    password: z
      .string({
        required_error: "Kata sandi is required",
        invalid_type_error: "Kata sandi must be a string",
      })
      .nullable(),
  })
