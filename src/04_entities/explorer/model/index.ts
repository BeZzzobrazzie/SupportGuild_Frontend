import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  entityFromServerType,
  explorerItemCategoryType,
  explorerItemId,
  explorerItemParentId,
  explorerItemsById,
  explorerSliceType,
  initialEntityType,
} from "../lib/types";
import { apiSlice } from "src/05_shared/api/apiSlice";
import {
  addExplorerEntity,
  getExplorerEntities,
  removeExplorerEntity,
} from "src/05_shared/api";

const initialState: explorerSliceType = {
  entities: {
    explorerItems: {
      byId: {},
      ids: [],
    },
  },
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
    selectEntities: (state) => state.entities.explorerItems,
    selectIsFetchEntitiesIdle: (state) => state.fetchEntitiesStatus === "idle",
    selectIsFetchEntitiesPending: (state) =>
      state.fetchEntitiesStatus === "pending",
    selectIsAddEntitiesPending: (state) => state.addEntityStatus === "pending",
  },
  reducers: {
    addEntityCreator: (
      state,
      action: PayloadAction<{
        parentId: explorerItemParentId;
        category: explorerItemCategoryType;
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
    builder.addCase(
      fetchEntities.fulfilled,
      (state, action: PayloadAction<entityFromServerType[]>) => {
        const items = action.payload;
        const byId = action.payload.reduce((byId: explorerItemsById, item) => {
          byId[item.id] = item;
          return byId;
        }, {});
        state.entities.explorerItems.byId = byId;
        state.entities.explorerItems.ids = items.map((item) => item.id);
        state.fetchEntitiesStatus = "success";
      }
    );
    builder.addCase(fetchEntities.rejected, (state) => {
      state.fetchEntitiesStatus = "failed";
    });

    builder.addCase(addEntity.pending, (state) => {
      state.addEntityStatus = "pending";
    });
    builder.addCase(
      addEntity.fulfilled,
      (state, action: PayloadAction<entityFromServerType>) => {
        state.entities.explorerItems.byId[action.payload.id] = action.payload;
        state.entities.explorerItems.ids.push(action.payload.id);
        state.addEntityStatus = "success";
      }
    );
    builder.addCase(addEntity.rejected, (state) => {
      state.addEntityStatus = "failed";
    });

    builder.addCase(removeEntity.pending, (state) => {
      state.removeEntitiesStatus = "pending";
    });
    builder.addCase(
      removeEntity.fulfilled,
      (state, action: PayloadAction<explorerItemId>) => {
        delete state.entities.explorerItems.byId[action.payload];
        state.entities.explorerItems.ids =
          state.entities.explorerItems.ids.filter(
            (id) => id !== action.payload
          );
        state.removeEntitiesStatus = "success";
      }
    );
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
  async (id: explorerItemId) => {
    const response = await removeExplorerEntity(id);
    return response;
  }
);

export const { addEntityCreator, removeEntityCreator } = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
