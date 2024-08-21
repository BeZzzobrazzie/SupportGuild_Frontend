import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { explorerSlice } from "src/04_entities/explorer/model";
import { useAddMutation } from "../lib/mutations";

export function AddCard() {
  const dispatch = useAppDispatch();

  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );

  const addMutation = useAddMutation();

  function handleClick() {
    // dispatch(addCard(activeCollection));
    addMutation.mutate({ parentId: activeCollection });
  }

  return <button onClick={handleClick}>Add new card</button>;
}
