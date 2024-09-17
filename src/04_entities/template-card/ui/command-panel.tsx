import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import {
  copySelected,
  resetSelected,
  selectedModeOff,
  selectedModeOn,
  templateCardsSlice,
} from "../model";
import {
  useAddMutation,
  usePasteMutation,
  useRemoveMutation,
} from "../lib/mutations";
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
  const addMutation = useAddMutation();

  function handleClickSelect() {
    dispatch(selectedModeOn());
  }
  function handleClickResetSelection() {
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
  function handleClickSelectOff() {
    dispatch(selectedModeOff());
    dispatch(resetSelected());
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
  function handleClick() {
    // dispatch(addCard(activeCollection));
    addMutation.mutate({ parentId: activeCollection });
  }

  return (
    <>
      <div>
        {isSelectedMode ? (
          <>
            <span>{amountSelected} selected</span>
            <button onClick={handleClickSelectOff}>Turn off select mode</button>
            <button onClick={handleClickResetSelection}>Deselect</button>
            <button onClick={handleClickDelete}>Delete selected</button>
            <button onClick={handleClickSelectAll}>Select all</button>
            <button onClick={handleClickCopy}>Copy selected</button>
          </>
        ) : (
          isReadMode && (
            <>
              <button onClick={handleClick}>Add new card</button>
              <button onClick={handleClickSelect}>Select</button>
              <button onClick={handleClickPaste}>Paste</button>
            </>
          )
        )}
      </div>
    </>
  );
}
