export type entityType = {
  id: number;
  type: "file" | "folder";
  name: string;
  parent: number;
  isOpen?: boolean;
};

export type explorerSliceType = {
  entities: entityType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
};
