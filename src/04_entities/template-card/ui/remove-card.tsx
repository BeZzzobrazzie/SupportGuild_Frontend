import { useAppDispatch } from "src/05_shared/redux";
import { removeCard } from "../model";

import { templateCardIdType } from "src/04_entities/template-card/api/types";

export function RemoveCard({ id }: { id: templateCardIdType }) {
  const dispatch = useAppDispatch();

  function handleClick() {
    dispatch(removeCard(id));
  }

  return <button onClick={handleClick}>Remove</button>;
}
