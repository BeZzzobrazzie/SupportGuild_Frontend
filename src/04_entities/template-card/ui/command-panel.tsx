import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { AddCard } from "./add-card";
import {
  resetSelected,
  selectedModeOff,
  selectedModeOn,
  templateCardsSlice,
} from "../model";
import { useRemoveMutation } from "../lib/mutations";
import { selectAllThunk } from "../model/select-all-thunk";

export function CommandPanel() {
  const dispatch = useAppDispatch();
  // const isSelectedMode = useAppSelector((state) =>
  //   templateCardsSlice.selectors.selectIsSelectedMode(state)
  // );
  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isReadMode = mode === "read";
  const isEditMode = mode === "edit";
  const isSelectedMode = mode === "select";
  const amountSelected = useAppSelector((state) =>
    templateCardsSlice.selectors.selectAmountSelected(state)
  );
  const selectedIds = useAppSelector((state) =>
    templateCardsSlice.selectors.selectSelectedIds(state)
  );

  const removeMutation = useRemoveMutation();

  function handleClickSelect() {
    dispatch(selectedModeOn());
  }
  function handleClickCancelSelection() {
    dispatch(selectedModeOff());
    dispatch(resetSelected());
  }
  function handleClickDelete() {
    removeMutation.mutate(selectedIds, {
      onSuccess: () => {
        dispatch(resetSelected());
        dispatch(selectedModeOff());
      },
    });
  }
  function handleClickSelectAll() {
    dispatch(selectAllThunk());
  }

  return (
    <>
      <div>
        {isSelectedMode ? (
          <>
            <span>{amountSelected} selected</span>
            <button onClick={handleClickCancelSelection}>Deselect</button>
            <button onClick={handleClickDelete}>Delete selected</button>
            <button onClick={handleClickSelectAll}>Select all</button>
          </>
        ) : (
          isReadMode && (
            <>
              <AddCard />
              <button onClick={handleClickSelect}>Select</button>
            </>
          )
        )}
      </div>
    </>
  );
}
