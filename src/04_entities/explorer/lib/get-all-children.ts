import { explorerItemId, explorerItems } from "../api/types";

export function getAllChildren(
  parentId: explorerItemId,
  explorerItems: explorerItems
) {
  const children = explorerItems.ids
    .map((id) => explorerItems.byId[id])
    .filter((item) => item.parentId === parentId);
  let allChildren = [...children];
  for (const child of children) {
    allChildren = [...allChildren, ...getAllChildren(child.id, explorerItems)];
  }
  return allChildren;
}
