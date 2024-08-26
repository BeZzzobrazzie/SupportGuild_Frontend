import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { AddCard } from "./add-card";
import {
  copySelected,
  resetSelected,
  selectedModeOff,
  selectedModeOn,
  templateCardsSlice,
} from "../model";
import { usePasteMutation, useRemoveMutation } from "../lib/mutations";
import { selectAllThunk } from "../model/select-all-thunk";
import { explorerSlice } from "src/04_entities/explorer/model";

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
  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const copiedIds = useAppSelector((state) =>
    templateCardsSlice.selectors.selectCopiedIds(state)
  );

  const removeMutation = useRemoveMutation();
  const pasteMutation = usePasteMutation();

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
  function handleClickCopy() {
    dispatch(copySelected());
    dispatch(resetSelected());
    dispatch(selectedModeOff());
  }

  function handleClickPaste() {
    if (activeCollection !== null) {
      pasteMutation.mutate({ parentId: activeCollection, ids: copiedIds });
    }
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
            <button onClick={handleClickCopy}>Copy selected</button>
          </>
        ) : (
          isReadMode && (
            <>
              <AddCard />
              <button onClick={handleClickSelect}>Select</button>
              <button onClick={handleClickPaste}>Paste</button>
            </>
          )
        )}
      </div>
    </>
  );
}
