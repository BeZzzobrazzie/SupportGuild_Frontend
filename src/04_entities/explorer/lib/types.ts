

export type entityType = {
  id: number,
  type: "file" | "folder",
  name: string,
  parent: number,
  isOpen?: boolean,
}