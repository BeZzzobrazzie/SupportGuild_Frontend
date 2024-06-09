import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { entityType, explorerSliceType } from "../lib/types";

const initialState: explorerSliceType = {
  entities: [],
  status: 'idle',
  error: null,
};

export const fetchEntities = createAsyncThunk("explorer/fetchEntities", async () => {
  const response = await fetch("http://localhost:5000/api/template-manager/explorer-entities");
  const data = await response.json();
  return data;
})

// {[
//   {
//     id: 0,
//     type: "file",
//     name: "first",
//     parent: -1,
//   },
//   {
//     id: 1,
//     type: "folder",
//     name: "second",
//     parent: -1,
//     isOpen: false,
//   },
//   {
//     id: 2,
//     type: "folder",
//     name: "third",
//     parent: 1,
//     isOpen: false,
//   },
//   {
//     id: 3,
//     type: "file",
//     name: "forth",
//     parent: 2,
//   },
//   {
//     id: 4,
//     type: "file",
//     name: "fifth",
//     parent: -1,
//   },
// ]}

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    openFolder: (state, action: PayloadAction<number>) => {
      const folderId = action.payload;

      const targetFolder = state.entities.find((entity) => entity.id === folderId);
      if (targetFolder && targetFolder.type === "folder") {
        targetFolder.isOpen = true;
      }
    },
    closeFolder: (state, action: PayloadAction<number>) => {
      const folderId = action.payload;

      const targetFolder = state.entities.find((entity) => entity.id === folderId);
      if (targetFolder && targetFolder.type === "folder") {
        targetFolder.isOpen = false;
      }
    },
    deleteEntity: (state, action: PayloadAction<number>) => {
      const entityId = action.payload;
      const indexTargetEntity = state.entities.findIndex(
        (entity) => entity.id === entityId
      );
      state.entities.splice(indexTargetEntity, 1);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEntities.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.entities = state.entities.concat(action.payload)
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
});

export const { openFolder, closeFolder, deleteEntity } = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
