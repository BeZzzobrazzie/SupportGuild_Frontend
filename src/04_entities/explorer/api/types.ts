import { z } from "zod";

const explorerItemIdSchema = z.number();
const explorerItemCategorySchema = z.union([
  z.enum(["file", "folder"]),
  z.null(),
]);
const explorerItemParentIdSchema = z.union([z.number(), z.null()]);
const explorerItemFromServerSchema = z.object({
  id: explorerItemIdSchema,
  category: explorerItemCategorySchema,
  name: z.string(),
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

export type explorerItemId = z.infer<typeof explorerItemIdSchema>;
export type explorerItemCategory = z.infer<typeof explorerItemCategorySchema>;
export type explorerItemParentId = z.infer<typeof explorerItemParentIdSchema>;
export type explorerItem = z.infer<typeof explorerItemSchema>;

type byId = Record<explorerItemId, explorerItem | undefined>;
type entities = {
  byId: byId;
  ids: explorerItemId[];
};

export type explorerSlice = {
  entities: entities;
  // activeCollection: explorerItemId | null;
  activeCollection: {
    currentId: explorerItemId | null;
    nextId: explorerItemId | null;
  };
  fetchEntitiesStatus: "idle" | "pending" | "success" | "failed";
  addEntityStatus: "idle" | "pending" | "success" | "failed";
  removeEntitiesStatus: "idle" | "pending" | "success" | "failed";
  updateEntityStatus: "idle" | "pending" | "success" | "failed";
  error: string | null | undefined;
};

// export type initialEntityType = {
//   name: string;
//   category: explorerItemCategoryType;
//   parentId: explorerItemParentId;
// };

// export type dataForUpdatingEntityType = {
//   id: explorerItemId;
//   name: explorerItemName;
// };

// export type entityFromServerType = {
//   id: explorerItemId;
//   name: string;
//   category: explorerItemCategoryType;
//   parent: entityFromServerType | null;
//   parentId: explorerItemParentId;
//   createdAt: string;
//   updatedAt: string;
// };
