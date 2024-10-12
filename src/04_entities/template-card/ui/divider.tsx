import { useDrop } from "react-dnd";
import { useMoveMutation } from "../api/mutations";
import { templateCard } from "../api/types";
import { TEMPLATE_CARD } from "../lib/dnd-const";

import cn from "classnames/bind";
import classes from "./divider.module.css";
const cx = cn.bind(classes);

interface DividerProps {
  card: templateCard;
  reverse?: boolean;
}
export function Divider({ card, reverse }: DividerProps) {
  const moveMutation = useMoveMutation();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: TEMPLATE_CARD,

      drop: (item: { movedCard: templateCard }) => {
        moveMutation.mutate({
          movedCardId: item.movedCard.id,
          targetCardId: reverse ? null : card.id,
        });
      },
      canDrop: (item: { movedCard: templateCard }, monitor) => {
        // console.log(item.movedCard);
        if (reverse && item.movedCard.id !== card.id) {
          return true;
        } else if (reverse) {
          return false;
        }
        if (
          item.movedCard.id === card.id ||
          item.movedCard.id === card.nextCardId
        ) {
          return false;
        }
        return true;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [card]
  );

  const dividerClass = cx("divider", {
    ["divider_drop"]: isOver,
  });

  return <div className={dividerClass} ref={drop}></div>;
}
