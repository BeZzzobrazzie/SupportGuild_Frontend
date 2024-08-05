import { z } from "zod";
import { explorerItemParentId } from "src/04_entities/explorer/api/types";

export const templateCardIdSchema = z.number();
const templateCardNameSchema = z.string().optional();
export const templateCardSchema = z.object({
  id: templateCardIdSchema,
  name: z.string().optional(),
  content: z.string(),
  parentId: z.number(),
});
export const templateCardsSchema = templateCardSchema.array();

export const removeTemplateCardIdSchema = z.object({
  id: templateCardIdSchema,
});

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

export type byId = Record<templateCardIdType, templateCardType | undefined>;
export type templateCardsSliceType = {
  entities: {
    byId: byId;
    ids: templateCardIdType[];
  };
  // idEditingCard: templateCardIdType | null;
  cardsForEditing: {
    currentId: templateCardIdType | null;
    nextId: templateCardIdType | null;
  };
  fetchCardsStatus: "idle" | "pending" | "success" | "failed";
  addCardStatus: "idle" | "pending" | "success" | "failed";
  removeCardStatus: "idle" | "pending" | "success" | "failed";
  updateCardStatus: "idle" | "pending" | "success" | "failed";
};
