import {z} from "zod";

export const schemaFormFormula = z.object({
  pelangganId: z.string({
    required_error: "Pelanggan ID is required",
    invalid_type_error: "Pelanggan ID must be a string",
  }),
  faktorArus: z.string({
    required_error: "Faktor Arus is required",
    invalid_type_error: "Faktor Arus must be a string",
  }),
  faktorTegangan: z.string({
    required_error: "Faktor Tegangan is required",
    invalid_type_error: "Faktor Tegangan must be a string",
  }),
  faktorPower: z.string({
    required_error: "Faktor Power is required",
    invalid_type_error: "Faktor Power must be a string",
  }),
});