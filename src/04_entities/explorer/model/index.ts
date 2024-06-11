import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  entityCategoryType,
  entityType,
  explorerSliceType,
  initialEntityType,
  parentIdType,
} from "../lib/types";

const initialState: explorerSliceType = {
  entities: [],
  status: "idle",
  error: null,
  entityCreation: {
    status: false,
    parentId: null,
    category: null,
  },
};

export const fetchEntities = createAsyncThunk(
  "explorer/fetchEntities",
  async () => {
    const response = await fetch(
      "http://localhost:5000/api/template-manager/explorer-entities"
    );
    const data = await response.json();
    console.log("fetch");
    console.log(data);
    return data;
  }
);

export const addNewEntity = createAsyncThunk(
  "explorer/addNewEntity",
  async (initialEntity: initialEntityType) => {
    const response = await fetch(
      "http://localhost:5000/api/template-manager/explorer-entities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(initialEntity),
      }
    );
    return await response.json();
  }
);

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

      const targetFolder = state.entities.find(
        (entity) => entity.id === folderId
      );
      if (targetFolder && targetFolder.category === "folder") {
        targetFolder.isOpen = true;
      }
    },
    closeFolder: (state, action: PayloadAction<number>) => {
      const folderId = action.payload;

      const targetFolder = state.entities.find(
        (entity) => entity.id === folderId
      );
      if (targetFolder && targetFolder.category === "folder") {
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
  extraReducers(builder) {
    builder
      .addCase(fetchEntities.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        console.log("succeeded");
        console.log(action.payload);
        state.entities = action.payload;
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewEntity.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      });
  },
});

export const {
  openFolder,
  closeFolder,
  deleteEntity,
  addEntityCreator,
  removeEntityCreator,
} = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
