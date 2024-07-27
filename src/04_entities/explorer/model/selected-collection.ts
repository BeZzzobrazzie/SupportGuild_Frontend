import { AppThunk, RootState } from "src/00_app/store";
import { explorerSlice } from ".";
import { templateCardsSlice } from "src/04_entities/template-card/model";
import { explorerItemId } from "src/05_shared/api/explorer/types";
import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";

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
