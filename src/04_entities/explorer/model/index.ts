import { rootReducer } from "src/05_shared/redux";
import { explorerItemId, explorerSliceType } from "../api/types";

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: explorerSliceType = {
  openedItems: {},
  activeCollectionId: null,
  selectedItemsIds: [],
};

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  selectors: {
    selectIsFolderOpen: (state, id: explorerItemId) => state.openedItems[id],
    selectIsActiveCollection: (state, id: explorerItemId) =>
      state.activeCollectionId === id,
    selectIsSelectedItem: (state, id: explorerItemId) => {
      if (state.selectedItemsIds) {
        return state.selectedItemsIds.includes(id);
      } else {
        return false;
      }
    },
    selectSelectedItemsIds: (state) => state.selectedItemsIds,
  },
  reducers: {
    clickOnCollection: (state, action: PayloadAction<explorerItemId>) => {
      state.activeCollectionId = action.payload;
    },
    clickOnFolder: (state, action: PayloadAction<explorerItemId>) => {
      const currentState = state.openedItems[action.payload];
      if (currentState) {
        state.openedItems[action.payload] = !currentState;
      } else {
        state.openedItems[action.payload] = true;
      }
    },
    deleteFolder: (state, action: PayloadAction<explorerItemId>) => {
      const { [action.payload]: deleteVar, ...newState } = state.openedItems;
      state.openedItems = newState;

      state.selectedItemsIds = state.selectedItemsIds.filter(id => id !== action.payload)
    },
    selectItem: (state, action: PayloadAction<explorerItemId>) => {
      state.selectedItemsIds = [action.payload];
    },
    toggleSelectItem: (state, action: PayloadAction<explorerItemId>) => {
      if (state.selectedItemsIds) {
        const index = state.selectedItemsIds.indexOf(action.payload);
        if (index !== -1) {
          state.selectedItemsIds.splice(index, 1);
        } else {
          state.selectedItemsIds.push(action.payload);
        }
      }
    },
  },
  extraReducers: (builder) => {},
}).injectInto(rootReducer);

export const {
  clickOnCollection,
  clickOnFolder,
  deleteFolder,
  selectItem,
  toggleSelectItem,
} = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
