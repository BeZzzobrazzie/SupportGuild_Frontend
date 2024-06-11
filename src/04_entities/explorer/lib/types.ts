
export type entityCategoryType = "file" | "folder" | null;
export type parentIdType = number | null;

export type entityType = {
  id: number;
  category: entityCategoryType;
  name: string;
  parentId: parentIdType;
  isOpen?: boolean;
};

export type explorerSliceType = {
  entities: entityType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
  entityCreation: {
    status: boolean;
    parentId: parentIdType;
    category: entityCategoryType;
  }
};

export type initialEntityType = {
  name: string,
  category: entityCategoryType,
  parent: parentIdType,
}