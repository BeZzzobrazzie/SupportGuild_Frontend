import { useDrag } from "react-dnd";
import { ItemTypes } from "src/05_shared/dnd";

export function useDragItems(draggableItems: number[]) {
  return useDrag(
    () => ({
      type: ItemTypes.EXPLORER_ITEM,
      item: { ids: draggableItems },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [draggableItems]
  );
}
