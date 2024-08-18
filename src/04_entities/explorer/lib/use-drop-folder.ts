import { useDrop } from "react-dnd";
import { ItemTypes } from "src/05_shared/dnd";
import {
  explorerItem,
  explorerItemId,
  explorerItems,
  moveExplorerItemsData,
} from "../api/types";
import { isChild } from "./is-child";
import { UseMutationResult } from "@tanstack/react-query";

export function useDropFolder(
  explorerItem: explorerItem,
  explorerItems: explorerItems,
  moveMutation: UseMutationResult<
    explorerItems,
    Error,
    moveExplorerItemsData,
    unknown
  >
) {
  return useDrop(
    () => ({
      accept: ItemTypes.EXPLORER_ITEM,
      canDrop: (item, monitor) => {
        if (
          monitor.isOver({ shallow: true }) &&
          !item.ids.includes(explorerItem.id) &&
          !item.ids.some((id) => isChild(explorerItems, id, explorerItem.id))
        ) {
          return true;
        } else {
          return false;
        }
      },
      drop: (item: { ids: explorerItemId[] }) => {
        console.log("dnd" + explorerItem.id);
        console.log(item);
        moveMutation.mutate({
          parentId: explorerItem.id,
          ids: item.ids,
        });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [explorerItem]
  );
}
