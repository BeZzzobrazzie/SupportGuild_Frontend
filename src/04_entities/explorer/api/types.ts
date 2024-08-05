import { z } from "zod";

export const explorerItemIdSchema = z.number();
const explorerItemNameSchema = z.string();
const explorerItemCategorySchema = z.union([
  z.enum(["file", "folder"]),
  z.null(),
]);
const explorerItemParentIdSchema = z.union([z.number(), z.null()]);
export const explorerItemFromServerSchema = z.object({
  id: explorerItemIdSchema,
  category: explorerItemCategorySchema,
  name: explorerItemNameSchema,
  parentId: explorerItemParentIdSchema,
});
export const explorerItemsFromServerSchema = z.array(
  explorerItemFromServerSchema
);
const explorerItemSchema = explorerItemFromServerSchema.extend({
  isOpen: z.boolean(),
  isRemoval: z.boolean(),
  isUpdatePending: z.boolean(),
});

export type explorerItemFromServer = z.infer<typeof explorerItemFromServerSchema>;

export type explorerItemId = z.infer<typeof explorerItemIdSchema>;
export type explorerItemCategory = z.infer<typeof explorerItemCategorySchema>;
export type explorerItemName = z.infer<typeof explorerItemNameSchema>;
export type explorerItemParentId = z.infer<typeof explorerItemParentIdSchema>;
export type explorerItem = z.infer<typeof explorerItemSchema>;

export type byId = Record<explorerItemId, explorerItem | undefined>;
type entities = {
  byId: byId;
  ids: explorerItemId[];
};

export type explorerSliceType = {
  entities: entities;
  // activeCollection: explorerItemId | null;
  activeCollection: {
    currentId: explorerItemId | null;
    nextId: explorerItemId | null;
  };
  fetchExplorerItemsStatus: "idle" | "pending" | "success" | "failed";
  addExplorerItemStatus: "idle" | "pending" | "success" | "failed";
  removeExplorerItemStatus: "idle" | "pending" | "success" | "failed";
  updateExplorerItemStatus: "idle" | "pending" | "success" | "failed";
  error: string | null | undefined;
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

// export type entityFromServerType = {
//   id: explorerItemId;
//   name: string;
//   category: explorerItemCategoryType;
//   parent: entityFromServerType | null;
//   parentId: explorerItemParentId;
//   createdAt: string;
//   updatedAt: string;
// };
