import { z } from "zod";

const explorerItemIdSchema = z.number();
const explorerItemNameSchema = z.string();
const explorerItemCategorySchema = z.union([
  z.enum(["file", "folder"]),
  z.null(),
]);
const explorerItemParentIdSchema = z.union([z.number(), z.null()]);
export const explorerItemSchema = z.object({
  id: explorerItemIdSchema,
  category: explorerItemCategorySchema,
  name: explorerItemNameSchema,
  parentId: explorerItemParentIdSchema,
  children: z.optional(z.array(explorerItemIdSchema)),
});
const byIdSchema = z.record(z.string(), explorerItemSchema);
const idsSchema = z.array(explorerItemIdSchema);

export const dataFromServer = z.object({ byId: byIdSchema, ids: idsSchema });

export const idDeletedExplorerItemSchema = z.object({
  id: explorerItemIdSchema,
});
export const idDeletedExplorerItemsSchema = z.object({
  ids: z.array(explorerItemIdSchema),
});

export type explorerItemId = z.infer<typeof explorerItemIdSchema>;
export type explorerItemCategory = z.infer<typeof explorerItemCategorySchema>;
export type explorerItemName = z.infer<typeof explorerItemNameSchema>;
export type explorerItemParentId = z.infer<typeof explorerItemParentIdSchema>;
export type explorerItem = z.infer<typeof explorerItemSchema>;

export type explorerItems = z.infer<typeof dataFromServer>;
export type idDeletedExplorerItem = z.infer<typeof idDeletedExplorerItemSchema>;
export type idDeletedExplorerItems = z.infer<
  typeof idDeletedExplorerItemsSchema
>;


export type explorerSliceType = {
  openedItems: Record<explorerItemId, boolean>;
  activeCollectionId: explorerItemId | null;
  selectedItemsIds: explorerItemId[];
  copiedItemsIds: explorerItemId[];
};

export type initialExplorerItem = {
  name: explorerItemName;
  category: explorerItemCategory;
  parentId: explorerItemParentId;
};

export type dataForUpdate = {
  id: explorerItemId;
  name: explorerItemName;
};
export type moveExplorerItemsData = {
  parentId: explorerItemParentId;
  ids: explorerItemId[];
};
export type pasteExplorerItemsData = {
  parentId: explorerItemParentId;
  ids: explorerItemId[];
}

