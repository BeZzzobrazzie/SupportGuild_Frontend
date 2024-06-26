
export type entityCategoryType = "file" | "folder" | null;
export type parentIdType = number | null;
export type entityIdType = number;

export type entityType = {
  id: entityIdType;
  category: entityCategoryType;
  name: string;
  parentId: parentIdType;
  isOpen?: boolean;
};

export type explorerSliceType = {
  entities: entityType[];
  fetchEntitiesStatus: 'idle' | 'pending' | 'success' | 'failed';
  addEntityStatus: 'idle' | 'pending' | 'success' | 'failed';
  removeEntitiesStatus: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null | undefined;
  entityCreation: {
    status: boolean;
    parentId: parentIdType;
    category: entityCategoryType;
  }
};

export type explorerSliceTypeTwo = {
  // entitiesIsOpen: {
  //   id: number,
  //   isOpen: boolean,
  // }[],
  entityCreation: {
    status: boolean;
    parentId: parentIdType;
    category: entityCategoryType;
  }
}

export type initialEntityType = {
  name: string,
  category: entityCategoryType,
  parentId: parentIdType,
}

export type entityFromServerType = {
  id: entityIdType,
  name: string,
  category: entityCategoryType,
  parent: entityFromServerType | null,
  parentId: parentIdType,
  createdAt: string,
  updatedAt: string,
}