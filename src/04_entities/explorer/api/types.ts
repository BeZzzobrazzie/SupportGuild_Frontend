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
  children: z.array(explorerItemIdSchema),
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

// export type byId = z.infer<typeof byIdSchema>;
// type entities = {
//   byId: byId;
//   ids: explorerItemId[];
// };

// export type explorerSliceType = {
//   entities: entities;
//   // activeCollection: explorerItemId | null;
//   activeCollection: {
//     currentId: explorerItemId | null;
//     nextId: explorerItemId | null;
//   };
//   selectedItemIds: explorerItemId[] | null;
//   fetchExplorerItemsStatus: "idle" | "pending" | "success" | "failed";
//   addExplorerItemStatus: "idle" | "pending" | "success" | "failed";
//   removeExplorerItemStatus: "idle" | "pending" | "success" | "failed";
//   removeExplorerItemsStatus: "idle" | "pending" | "success" | "failed";
//   updateExplorerItemStatus: "idle" | "pending" | "success" | "failed";
//   error: string | null | undefined;
// };

export type explorerSliceType = {
  openedItems: Record<explorerItemId, boolean>;
  activeCollectionId: explorerItemId | null;
  selectedItemIds: explorerItemId[];
};

export type initialExplorerItem = {
  name: explorerItemName;
  category: explorerItemCategory;
  parentId: explorerItemParentId;
};
// export type initialExplorerItems = explorerItemFromServer[];

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
