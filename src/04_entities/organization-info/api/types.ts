import { z } from "zod";



const organizationInfoObjSchema = z.object({
  inn: z.string(),
  kpp: z.string().optional(),
  name: z.string().optional(),
  operator: z.string().optional(),
  id: z.string().optional(),
  email: z.string().optional(),
  "status of organization in service": z.string().optional(),
  "status of relationship with counterparty": z.string().optional(),
  "date of liquidation of counterparty": z.string().optional(),
  result: z.string().optional(),
})

export const organizationInfoSchema = z.array(organizationInfoObjSchema)
export type organizationInfoData = z.infer<typeof organizationInfoObjSchema>;



export type initialData = {
  inn: string
}