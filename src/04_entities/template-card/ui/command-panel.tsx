import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { AddCard } from "./add-card";
import {
  resetSelected,
  selectedModeOff,
  selectedModeOn,
  templateCardsSlice,
} from "../model";

export function CommandPanel() {
  const dispatch = useAppDispatch();
  const isSelectedMode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsSelectedMode(state)
  );
  const amountSelected = useAppSelector((state) =>
    templateCardsSlice.selectors.selectAmountSelected(state)
  );

  function handleClickSelect() {
    dispatch(selectedModeOn());
  }
  function handleClickCancelSelection() {
    dispatch(selectedModeOff());
    dispatch(resetSelected());
  }

  return (
    <>
      <div>
        {isSelectedMode ? (
          <>
            <span>{amountSelected} selected</span>
            <button onClick={handleClickCancelSelection}>
              Cancel selection
            </button>
          </>
        ) : (
          <>
            <AddCard />
            <button onClick={handleClickSelect}>Select</button>
          </>
        )}
      </div>
    </>
  );
}
