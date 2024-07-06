
export type explorerItemCategoryType = "file" | "folder" | null;
export type explorerItemId = string;
export type explorerItemParentId = string | null;

// export type parentIdType = number | null;
// export type entityIdType = number;

// export type entityType = {
//   id: entityIdType;
//   category: entityCategoryType;
//   name: string;
//   parentId: parentIdType;
//   isOpen?: boolean;
// };


export type explorerItem = {
  id: explorerItemId;
  category: explorerItemCategoryType;
  name: string;
  parentId: explorerItemParentId;
  isOpen?: boolean;
  isRemoval: boolean;
}
export type explorerItemsById = Record<explorerItemId, explorerItem | undefined>;
type explorerItems = {
  byId: explorerItemsById;
  ids: explorerItemId[];
}
type entitiesType = {
  explorerItems: explorerItems;
}

export type explorerSliceType = {
  entities: entitiesType;
  fetchEntitiesStatus: 'idle' | 'pending' | 'success' | 'failed';
  addEntityStatus: 'idle' | 'pending' | 'success' | 'failed';
  removeEntitiesStatus: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null | undefined;
  entityCreation: {
    status: boolean;
    parentId: explorerItemParentId;
    category: explorerItemCategoryType;
  }
};



// export type explorerSliceTypeTwo = {
//   // entitiesIsOpen: {
//   //   id: number,
//   //   isOpen: boolean,
//   // }[],
//   entityCreation: {
//     status: boolean;
//     parentId: parentIdType;
//     category: entityCategoryType;
//   }
// }

export type initialEntityType = {
  name: string,
  category: explorerItemCategoryType,
  parentId: explorerItemParentId,
}

export type entityFromServerType = {
  id: explorerItemId,
  name: string,
  category: explorerItemCategoryType,
  parent: entityFromServerType | null,
  parentId: explorerItemParentId,
  createdAt: string,
  updatedAt: string,
}