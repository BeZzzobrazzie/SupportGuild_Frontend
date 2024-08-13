import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { addCard } from "../model";
import { explorerSlice } from "src/04_entities/explorer/model";

export function AddCard() {
  const dispatch = useAppDispatch();

  // const activeCollection = useAppSelector((state) =>
  //   explorerSlice.selectors.selectActiveCollection(state)
  // );

  function handleClick() {
    // dispatch(addCard(activeCollection));
  }

  return <button onClick={handleClick}>Add new card</button>;
}
