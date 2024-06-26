import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  entityCategoryType,
  entityFromServerType,
  entityIdType,
  entityType,
  explorerSliceType,
  explorerSliceTypeTwo,
  initialEntityType,
  parentIdType,
} from "../lib/types";
import { apiSlice } from "src/05_shared/api/apiSlice";
import {
  addExplorerEntity,
  getExplorerEntities,
  removeExplorerEntity,
} from "src/05_shared/api";

const initialState: explorerSliceType = {
  entities: [],
  fetchEntitiesStatus: "idle",
  addEntityStatus: "idle",
  removeEntitiesStatus: "idle",
  error: undefined,
  entityCreation: {
    status: false,
    parentId: null,
    category: null,
  },
};

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  selectors: {
    selectEntities: (state) => state.entities,
    selectIsFetchEntitiesIdle: (state) => state.fetchEntitiesStatus === "idle",
    selectIsFetchEntitiesPending: (state) => state.fetchEntitiesStatus === "pending",
    selectIsAddEntitiesPending: (state) => state.addEntityStatus === "pending",

  },
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
  extraReducers: (builder) => {
    builder.addCase(fetchEntities.pending, (state) => {
      state.fetchEntitiesStatus = "pending";
    });
    builder.addCase(fetchEntities.fulfilled, (state, action) => {
      state.fetchEntitiesStatus = "success";
      state.entities = action.payload;
    });
    builder.addCase(fetchEntities.rejected, (state) => {
      state.fetchEntitiesStatus = "failed";
    });

    builder.addCase(addEntity.pending, (state) => {
      state.addEntityStatus = "pending";
    });
    builder.addCase(addEntity.fulfilled, (state, action) => {
      state.entities.push(action.payload);
      state.addEntityStatus = "success";
    });
    builder.addCase(addEntity.rejected, (state) => {
      state.addEntityStatus = "failed";
    });

    builder.addCase(removeEntity.pending, (state) => {
      state.removeEntitiesStatus = "pending";
    });
    builder.addCase(removeEntity.fulfilled, (state, action) => {
      state.entities = state.entities.filter(
        (entity) => entity.id !== action.payload
      );
      state.removeEntitiesStatus = "success";
    });
    builder.addCase(removeEntity.rejected, (state) => {
      state.removeEntitiesStatus = "failed";
    });
  },
});

export const fetchEntities = createAsyncThunk(
  "explorer/fetchEntities",
  async () => {
    const response = await getExplorerEntities();
    return response;
  }
);
export const addEntity = createAsyncThunk(
  "explorer/addEntity",
  async (initialEntity: initialEntityType) => {
    const response = await addExplorerEntity(initialEntity);
    return response;
  }
);
export const removeEntity = createAsyncThunk(
  "explorer/removeEntity",
  async (id: entityIdType) => {
    const response = await removeExplorerEntity(id);
    return response;
  }
);

export const { addEntityCreator, removeEntityCreator } = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
