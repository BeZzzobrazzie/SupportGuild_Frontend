import { rootReducer } from "src/05_shared/redux";
import { explorerItemId, explorerSliceType } from "../api/types";

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: explorerSliceType = {
  openedItems: {},
};

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  selectors: {
    selectIsFolderOpen: (state, id: explorerItemId) => state.openedItems[id]
  },
  reducers: {
    clickOnFolder: (state, action: PayloadAction<explorerItemId>) => {
      const currentState = state.openedItems[action.payload];
      if (currentState) {
        state.openedItems[action.payload] = !currentState;
      } else {
        state.openedItems[action.payload] = true;
      }
    },
    deleteFolder: (state, action: PayloadAction<explorerItemId>) => {
      const {[action.payload]: deleteVar, ...newState} = state.openedItems;
      state.openedItems = newState
    },
  },
  extraReducers: (builder) => {},
}).injectInto(rootReducer);

export const { clickOnFolder, deleteFolder } = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
