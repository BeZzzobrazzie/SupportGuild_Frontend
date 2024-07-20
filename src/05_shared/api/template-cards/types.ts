import { z } from "zod";
import { explorerItemParentId } from "../explorer/types";

export const templateCardIdSchema = z.number();
export const templateCardSchema = z.object({
  id: templateCardIdSchema,
  name: z.string(),
  content: z.string(),
  parentId: z.number(),
});
export const templateCardsSchema = templateCardSchema.array();

export type templateCardType = z.infer<typeof templateCardSchema>;

export type templateCardIdType = number;
export type templateCardNameType = string;
export type templateCardInitialType = {
  name: templateCardNameType;
  content: string;
  parentId: explorerItemParentId;
};
export type dataForUpdatingTemplateCardType = {
  id: templateCardIdType;
  name: templateCardNameType;
  content: string;
  parentId: explorerItemParentId;
};
