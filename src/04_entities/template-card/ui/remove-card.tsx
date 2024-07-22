import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { addCard, removeCard } from "../model";
import { explorerSlice } from "src/04_entities/explorer/model";
import { templateCardIdType } from "src/05_shared/api/template-cards/types";

export function RemoveCard({ id }: { id: templateCardIdType }) {
  const dispatch = useAppDispatch();

  function handleClick() {
    dispatch(removeCard(id));
  }

  return <button onClick={handleClick}>Remove</button>;
}
