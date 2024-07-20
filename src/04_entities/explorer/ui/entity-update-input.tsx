import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { explorerItemId } from "../../../05_shared/api/template-cards/types";
import { useState } from "react";
import { explorerSlice, updateEntity } from "../model";

export function EntityUpdateInput({
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
    explorerSlice.selectors.selectIsUpdateItemPending(state)
  );

  function handleBlur() {
    if (!isUpdateItemPending) {
      setIsUpdating(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await dispatch(updateEntity({ id, name: inputValue })).unwrap();
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
