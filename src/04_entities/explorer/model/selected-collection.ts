import { explorerSlice } from ".";
import { templateCardsSlice } from "src/04_entities/template-card/model";
import { explorerItemId } from "src/04_entities/explorer/api/types";
import { AppThunk } from "src/05_shared/redux";

export const selectedCollectionThunk =
  (explorerItemId: explorerItemId): AppThunk =>
  async (dispatch, getState) => {
    const isTemplateEditing =
      templateCardsSlice.selectors.selectIdEditingCard(getState()) !== null;
    if (isTemplateEditing) {
      dispatch(explorerSlice.actions.changeNextCollection(explorerItemId));
    } else {
      dispatch(explorerSlice.actions.changeCurrentCollection(explorerItemId));
    }
  };
