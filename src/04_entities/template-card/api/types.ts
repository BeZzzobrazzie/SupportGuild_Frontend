import { z, ZodType } from "zod";
import {
  explorerItemId,
  explorerItemParentId,
} from "src/04_entities/explorer/api/types";

export const templateCardIdSchema = z.number();
const templateCardNameSchema = z.string().optional();
export const templateCardSchema = z.object({
  id: templateCardIdSchema,
  name: z.string().optional(),
  content: z.string(),
  parentId: z.number(),
  prevCardId: z.union([templateCardIdSchema, z.null()]),
  nextCardId: z.union([templateCardIdSchema, z.null()]),
});
export const templateCardsSchema = templateCardSchema.array();

const byIdSchema = z.record(z.string(), templateCardSchema);
const idsSchema = z.array(templateCardIdSchema);

export const templateCardDataFromServerSchema = z.object({
  byId: byIdSchema,
  ids: idsSchema,
});

export const removeTemplateCardIdSchema = z.object({
  id: templateCardIdSchema,
});

export type templateCard = z.infer<typeof templateCardSchema>;

export type templateCardId = z.infer<typeof templateCardIdSchema>;
export type templateCardName = z.infer<typeof templateCardNameSchema>;
export type templateCardInitial = {
  // name?: templateCardNameType;
  content: string;
  parentId: explorerItemParentId;
};
export type templateCardDataFromServer = z.infer<
  typeof templateCardDataFromServerSchema
>;

export type dataForUpdateTemplateCard = {
  id: templateCardId;
  name?: templateCardName;
  content: string;
  parentId: explorerItemParentId;
};

export type pasteTemplateCardsData = {
  parentId: explorerItemId;
  ids: templateCardId[];
};

export type moveTemplateCardData = {
  movedCardId: templateCardId;
  targetCardId: templateCardId | null;
};

// export type byId = Record<templateCardId, templateCard | undefined>;
export type templateCardsSliceType = {
  // idEditingCard: templateCardIdType | null;
  cardsForEditing: {
    currentId: templateCardId | null;
    nextId: templateCardId | null;
  };
  idsSelectedTemplates: Record<templateCardId, boolean>;
  idsCopiedTemplates: templateCardId[];
  outputEditorChanged: boolean;
  // outputEditorContent: Descendant[];
  // selectedMode: boolean;
  mode: "read" | "edit" | "select";
};
