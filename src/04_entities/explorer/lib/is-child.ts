import {
  explorerItems,
  explorerItemId,
  explorerItemParentId,
} from "../api/types";

export function isChild(
  explorerItems: explorerItems,
  parentId: explorerItemParentId,
  childId: explorerItemId
) {
  const children = explorerItems.ids
    .map((id) => explorerItems.byId[id])
    .filter((item) => item.parentId === parentId);
  if (children.map((child) => child.id).includes(childId)) {
    return true;
  }
  for (const child of children) {
    if (isChild(explorerItems, child.id, childId)) {
      return true;
    }
  }
  return false;
}
