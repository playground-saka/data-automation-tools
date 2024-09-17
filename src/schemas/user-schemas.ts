import { z } from "zod";

export const schemaFormUser = (isEditMode: boolean) => {
  z.object({
    username: z.string({
      required_error: "Username lengkap is required",
      invalid_type_error: "Username lengkap must be a string",
    }),
    isActive: z.string().nullable(),
    roleId: z.string({
      required_error: "Role ID is required",
      invalid_type_error: "Role ID must be a string",
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
    password: isEditMode
      ? z
          .string()
          .nullable()
          .optional()
      : z
          .string({
            required_error: "Kata sandi is required",
            invalid_type_error: "Kata sandi must be a string",
          })
          .refine((val) => val === null || val.length >= 8, {
            message: "Kata sandi harus memiliki panjang minimal 8 karakter",
            path: ["password"],
          }),
  });
}; 
