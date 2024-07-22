import { z } from "zod";
import { explorerItemParentId } from "../explorer/types";

export const templateCardIdSchema = z.number();
export const removeTemplateCardIdSchema = z.object({
  id: templateCardIdSchema,
})
const templateCardNameSchema = z.string().optional();
export const templateCardSchema = z.object({
  id: templateCardIdSchema,
  name: z.string().optional(),
  content: z.string(),
  parentId: z.number(),
});
export const templateCardsSchema = templateCardSchema.array();

export type templateCardType = z.infer<typeof templateCardSchema>;

export type templateCardIdType = z.infer<typeof templateCardIdSchema>;
export type templateCardNameType = z.infer<typeof templateCardNameSchema>;
export type templateCardInitialType = {
  // name?: templateCardNameType;
  // content: string;
  parentId: explorerItemParentId;
};
export type dataForUpdatingTemplateCardType = {
  id: templateCardIdType;
  name?: templateCardNameType;
  content: string;
  parentId: explorerItemParentId;
};
