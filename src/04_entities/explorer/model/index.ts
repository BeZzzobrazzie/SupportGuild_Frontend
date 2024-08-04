// import {
//   PayloadAction,
//   createAsyncThunk,
//   createSelector,
//   createSlice,
// } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "src/05_shared/redux";
import { dataForUpdate, explorerItem, explorerItemFromServer, explorerItemId, explorerItemParentId, explorerSliceType, initialExplorerItem } from "../api/types";
import { addExplorerItem, getExplorerItems, removeExplorerItem, updateExplorerItem } from "../api/explorer-api";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

// import { createAppAsyncThunk, rootReducer } from "src/00_app/store";
// import { templateCardsSlice } from "src/04_entities/template-card/model";
// import {
//   addExplorerEntity,
//   getExplorerEntities,
//   removeExplorerEntity,
//   updateExplorerEntity,
// } from "src/04_entities/explorer/api/explorer-api";
// import {
//   dataForUpdatingEntityType,
//   entityFromServerType,
//   explorerItem,
//   explorerItemId,
//   explorerItemParentId,
//   explorerItemsById,
//   explorerSliceType,
//   initialEntityType,
// } from "src/04_entities/explorer/api/types";

const initialState: explorerSliceType = {
  entities: {
    byId: {},
    ids: [],
  },
  // activeCollection: null,
  activeCollection: {
    currentId: null,
    nextId: null,
  },
  fetchExplorerItemsStatus: "idle",
  addExplorerItemStatus: "idle",
  removeExplorerItemStatus: "idle",
  updateExplorerItemStatus: "idle",
  error: undefined,
};

export const fetchExplorerItemsTh = createAppAsyncThunk(
  "explorer/fetchExplorerItemsTh",
  async () => {
    const response = await getExplorerItems();
    return response;
  }
);
export const addExplorerItemTh = createAppAsyncThunk(
  "explorer/addExplorerItemTh",
  async (initialData: initialExplorerItem) => {
    const response = await addExplorerItem(initialData);
    return response;
  }
);
export const removeExplorerItemTh = createAppAsyncThunk(
  "explorer/removeExplorerItemTh",
  async (id: explorerItemId) => {
    const response = await removeExplorerItem(id);
    return response;
  }
);
export const updateExplorerItemTh = createAppAsyncThunk(
  "explorer/updateExplorerItemTh",
  async (dataForUpdate: dataForUpdate) => {
    const response = await updateExplorerItem(dataForUpdate);
    return response;
  }
);

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  selectors: {
    selectExplorerItems: (state) => state.entities.ids.map(id => state.entities.byId[id]),
    selectExplorerItem: (state, id: explorerItemId) =>
      state.entities.byId[id],
    selectChildren: createSelector(
      (state: explorerSliceType) => state.entities.byId,
      (state: explorerSliceType) => state.entities.ids,
      (_: explorerSliceType, parentId: explorerItemParentId) => parentId,
      (explorerItems, ids, parentId) =>
        ids
          .map((id) => explorerItems[id])
          .filter((item): item is explorerItem => item?.parentId === parentId)
    ),
    selectActiveCollection: (state) => state.activeCollection.currentId,
    // selectIsFetchEntitiesIdle: (state) => state.fetchEntitiesStatus === "idle",
    // selectIsFetchEntitiesPending: (state) =>
    //   state.fetchEntitiesStatus === "pending",
    // selectIsAddEntitiesPending: (state) => state.addEntityStatus === "pending",
    // selectIsRemoveItemPending: (state) =>
    //   state.removeEntitiesStatus === "pending",
    // selectIsUpdateItemPending: (state) =>
    //   state.updateEntityStatus === "pending",
    selectIsCollectionInQueue: (state, collectionId: explorerItemId) =>
      state.activeCollection.currentId === collectionId &&
      state.activeCollection.nextId !== null,
  },
  reducers: {
    openFolder: (state, action: PayloadAction<explorerItemId>) => {
      const explorerItemsById =
        state.entities.byId[action.payload];
      if (!!explorerItemsById) explorerItemsById.isOpen = true;
      state.entities.byId[action.payload] = explorerItemsById;
    },
    closeFolder: (state, action: PayloadAction<explorerItemId>) => {
      const explorerItemsById =
        state.entities.byId[action.payload];
      if (!!explorerItemsById) explorerItemsById.isOpen = false;
      state.entities.byId[action.payload] = explorerItemsById;
    },
    // selectedCollection: (state, action: PayloadAction<explorerItemId>) => {
    //   state.activeCollection = action.payload;
    // },
    changeCurrentCollection: (state, action: PayloadAction<explorerItemId>) => {
      state.activeCollection.currentId = action.payload;
    },
    changeNextCollection: (
      state,
      action: PayloadAction<explorerItemId | null>
    ) => {
      state.activeCollection.nextId = action.payload;
    },
    changeCurrentCollectionToNext: (state) => {
      state.activeCollection.currentId = state.activeCollection.nextId;
      state.activeCollection.nextId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExplorerItemsTh.pending, (state) => {
      state.fetchExplorerItemsStatus = "pending";
    });
    builder.addCase(
      fetchExplorerItemsTh.fulfilled,
      (state, action: PayloadAction<explorerItemFromServer[]>) => {
        const items = action.payload;
        const byId = action.payload.reduce((byId: explorerItemsById, item) => {
          if (item.category === "folder") {
            const newItem = {
              isUpdatePending: false,
              isRemoval: false,
              isOpen: false,
              ...item,
            };
            byId[item.id] = newItem;
            return byId;
          } else {
            const newItem = {
              isUpdatePending: false,
              isRemoval: false,
              ...item,
            };
            byId[item.id] = newItem;
            return byId;
          }
        }, {});
        state.entities.explorerItems.byId = byId;
        state.entities.explorerItems.ids = items.map((item) => item.id);
        state.fetchExplorerItemsStatus = "success";
      }
    );
    builder.addCase(fetchExplorerItemsTh.rejected, (state) => {
      state.fetchExplorerItemsStatus = "failed";
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
            isUpdatePending: false,
            isRemoval: false,
            isOpen: false,
            ...action.payload,
          };
        } else {
          state.entities.explorerItems.byId[action.payload.id] = {
            isUpdatePending: false,
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
      const id = action.meta.arg.id;

      if (!!state.entities.explorerItems.byId[id]) {
        state.entities.explorerItems.byId[id].isUpdatePending = true;
      }
      state.updateEntityStatus = "pending";
    });
    builder.addCase(
      updateEntity.fulfilled,
      (state, action: PayloadAction<entityFromServerType>) => {
        const explorerItem =
          state.entities.explorerItems.byId[action.payload.id];
        if (explorerItem) {
          explorerItem.name = action.payload.name;
          explorerItem.isUpdatePending = false;
        }
        state.entities.explorerItems.byId[action.payload.id] = explorerItem;

        state.updateEntityStatus = "success";
      }
    );
    builder.addCase(updateEntity.rejected, (state, action) => {
      const id = action.meta.arg.id;

      if (!!state.entities.explorerItems.byId[id]) {
        state.entities.explorerItems.byId[id].isUpdatePending = false;
      }
      state.updateEntityStatus = "failed";
    });
  },
}).injectInto(rootReducer);

export const {
  openFolder,
  closeFolder,
  changeCurrentCollectionToNext,
  changeNextCollection,
} = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
