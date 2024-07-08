import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  dataForUpdatingEntityType,
  entityFromServerType,
  explorerItem,
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
  updateExplorerEntity,
} from "src/05_shared/api";
import { createAppSelector } from "src/05_shared/lib/hooks";

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
  updateEntityStatus: "idle",
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
    selectExplorerItem: (state, id: explorerItemId) =>
      state.entities.explorerItems.byId[id],
    selectRootExplorerItems: createSelector(
      (state: explorerSliceType) => state.entities.explorerItems.byId,
      (state: explorerSliceType) => state.entities.explorerItems.ids,
      (explorerItems, ids) =>
        ids
          .map((id) => explorerItems[id])
          .filter((item): item is explorerItem => item?.parentId === null)
    ),
    selectChildren: createSelector(
      (state: explorerSliceType) => state.entities.explorerItems.byId,
      (state: explorerSliceType) => state.entities.explorerItems.ids,
      (_: explorerSliceType, parentId: explorerItemId) => parentId,
      (explorerItems, ids, parentId) =>
        ids
          .map((id) => explorerItems[id])
          .filter((item): item is explorerItem => item?.parentId === parentId)
    ),
    selectIsFetchEntitiesIdle: (state) => state.fetchEntitiesStatus === "idle",
    selectIsFetchEntitiesPending: (state) =>
      state.fetchEntitiesStatus === "pending",
    selectIsAddEntitiesPending: (state) => state.addEntityStatus === "pending",
    selectIsRemoveItemPending: (state) =>
      state.removeEntitiesStatus === "pending",
    selectIsUpdateItemPending: (state) =>
      state.updateEntityStatus === "pending",
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
    openFolder: (state, action: PayloadAction<explorerItemId>) => {
      const explorerItemsById =
        state.entities.explorerItems.byId[action.payload];
      if (!!explorerItemsById) explorerItemsById.isOpen = true;
      state.entities.explorerItems.byId[action.payload] = explorerItemsById;
    },
    closeFolder: (state, action: PayloadAction<explorerItemId>) => {
      const explorerItemsById =
        state.entities.explorerItems.byId[action.payload];
      if (!!explorerItemsById) explorerItemsById.isOpen = false;
      state.entities.explorerItems.byId[action.payload] = explorerItemsById;
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
          if (item.category === "folder") {
            const newItem = { isRemoval: false, isOpen: false, ...item };
            byId[item.id] = newItem;
            return byId;
          } else {
            const newItem = { isRemoval: false, ...item };
            byId[item.id] = newItem;
            return byId;
          }
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
        if (
          state.entities.explorerItems.byId[action.payload.id]?.category ===
          "folder"
        ) {
          state.entities.explorerItems.byId[action.payload.id] = {
            isRemoval: false,
            isOpen: false,
            ...action.payload,
          };
        } else {
          state.entities.explorerItems.byId[action.payload.id] = {
            isRemoval: false,
            ...action.payload,
          };
        }

        state.entities.explorerItems.ids.push(action.payload.id);
        state.addEntityStatus = "success";
      }
    );
    builder.addCase(addEntity.rejected, (state) => {
      state.addEntityStatus = "failed";
    });

    builder.addCase(removeEntity.pending, (state, action) => {
      const id = action.meta.arg;
      if (!!state.entities.explorerItems.byId[id]) {
        state.entities.explorerItems.byId[id].isRemoval = true;
      }

      state.removeEntitiesStatus = "pending";
    });
    builder.addCase(
      removeEntity.fulfilled,
      (state, action: PayloadAction<{ id: explorerItemId }>) => {
        const { id } = action.payload;

        let newById = state.entities.explorerItems.byId;
        let newIds = state.entities.explorerItems.ids;

        function deleteElementTree(parentId: explorerItemId) {
          let explorerItemsByIdToRemove: number[] = [];
          delete newById[parentId];
          newIds = newIds.filter((item) => item !== parentId);

          for (let key in newById) {
            if (!!newById[key]) {
              if (newById[key].parentId === parentId) {
                explorerItemsByIdToRemove.push(Number(key));
              }
            }
          }

          explorerItemsByIdToRemove.map((itemId) => {
            deleteElementTree(itemId);
          });
        }
        deleteElementTree(id);
        state.entities.explorerItems.byId = newById;
        state.entities.explorerItems.ids = newIds;

        state.removeEntitiesStatus = "success";
      }
    );
    builder.addCase(removeEntity.rejected, (state, action) => {
      const id = action.meta.arg;
      if (!!state.entities.explorerItems.byId[id]) {
        state.entities.explorerItems.byId[id].isRemoval = false;
      }
      state.removeEntitiesStatus = "failed";
    });

    builder.addCase(updateEntity.pending, (state, action) => {
      state.updateEntityStatus = "pending";
    });
    builder.addCase(
      updateEntity.fulfilled,
      (state, action: PayloadAction<entityFromServerType>) => {
        const explorerItem =
          state.entities.explorerItems.byId[action.payload.id];
        if (explorerItem) {
          explorerItem.name = action.payload.name;
        }
        state.entities.explorerItems.byId[action.payload.id] = explorerItem;

        state.removeEntitiesStatus = "success";
      }
    );
    builder.addCase(updateEntity.rejected, (state, action) => {
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
export const updateEntity = createAsyncThunk(
  "explorer/updateEntity",
  async (dataForUpdatingEntity: dataForUpdatingEntityType) => {
    const response = await updateExplorerEntity(dataForUpdatingEntity);
    return response;
  }
);

export const {
  addEntityCreator,
  removeEntityCreator,
  openFolder,
  closeFolder,
} = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
