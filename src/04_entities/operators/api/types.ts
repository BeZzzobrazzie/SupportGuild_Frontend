import { z } from "zod";



const operatorSchema = z.object({
  index: z.number(),
  name: z.string(),
  inn: z.union([z.string(), z.number()]),
  kpp: z.union([z.string(), z.number()]).optional(),
  status: z.string(),
  'validity period': z.number().optional(),
  prefix: z.string().optional(),
  email: z.string().optional(),
  'phone number': z.string().optional(),
  address: z.string().optional()
})

export const operatorsSchema = z.array(operatorSchema)
export type operatorData = z.infer<typeof operatorSchema>;
