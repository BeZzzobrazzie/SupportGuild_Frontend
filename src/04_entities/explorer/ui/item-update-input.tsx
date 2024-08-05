import { useState } from "react";
import { explorerSlice, updateExplorerItemTh } from "../model";
import { explorerItemId } from "../api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

export function ExplorerItemUpdateInput({
  id,
  name,
  setIsUpdating,
}: {
  id: explorerItemId;
  name: string;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(name);
  const isUpdateItemPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsUpdateExplorerItemPending(state)
  );

  function handleBlur() {
    if (!isUpdateItemPending) {
      setIsUpdating(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await dispatch(updateExplorerItemTh({ id, name: inputValue })).unwrap();
      setIsUpdating(false);
    } catch (err) {
      console.error("Failed to update the entity: ", err);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          required
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={handleBlur}
        />
      </form>
    </>
  );
}
