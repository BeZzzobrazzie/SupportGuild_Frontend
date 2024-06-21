import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  entityCategoryType,
  entityFromServerType,
  entityType,
  explorerSliceType,
  explorerSliceTypeTwo,
  initialEntityType,
  parentIdType,
} from "../lib/types";

const initialState: explorerSliceTypeTwo = {
  // entitiesIsOpen: [],
  entityCreation: {
    status: false,
    parentId: null,
    category: null,
  },
};

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    addEntityCreator: (
      state,
      action: PayloadAction<{
        parentId: parentIdType;
        category: entityCategoryType;
      }>
    ) => {
      const { parentId, category } = action.payload;
      state.entityCreation.status = true;
      state.entityCreation.parentId = parentId;
      state.entityCreation.category = category;
    },
    removeEntityCreator: (state) => {
      state.entityCreation.status = false;
      state.entityCreation.parentId = null;
      state.entityCreation.category = null;
    },
  },
});

type collapsedFolderType = {
  id: number,
  isOpen: boolean,
}

export const collapsedFolderSlice = createSlice({
  name: "collapsedFolder",
  initialState: []
})

export const { addEntityCreator, removeEntityCreator } = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
