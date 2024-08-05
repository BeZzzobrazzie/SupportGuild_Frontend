import { createAppAsyncThunk, rootReducer } from "src/05_shared/redux";
import {
  byId,
  dataForUpdate,
  explorerItem,
  explorerItemFromServer,
  explorerItemId,
  explorerItemParentId,
  explorerSliceType,
  initialExplorerItem,
} from "../api/types";
import {
  addExplorerItem,
  getExplorerItems,
  removeExplorerItem,
  updateExplorerItem,
} from "../api/explorer-api";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    selectExplorerItems: (state) =>
      state.entities.ids.map((id) => state.entities.byId[id]),
    selectExplorerItem: (state, id: explorerItemId) => state.entities.byId[id],
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
      const explorerItemsById = state.entities.byId[action.payload];
      if (!!explorerItemsById) explorerItemsById.isOpen = true;
      state.entities.byId[action.payload] = explorerItemsById;
    },
    closeFolder: (state, action: PayloadAction<explorerItemId>) => {
      const explorerItemsById = state.entities.byId[action.payload];
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
        const byId = action.payload.reduce((byId: byId, item) => {
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
        state.entities.byId = byId;
        state.entities.ids = items.map((item) => item.id);
        state.fetchExplorerItemsStatus = "success";
      }
    );
    builder.addCase(fetchExplorerItemsTh.rejected, (state) => {
      state.fetchExplorerItemsStatus = "failed";
    });

    builder.addCase(addExplorerItemTh.pending, (state) => {
      state.addExplorerItemStatus = "pending";
    });
    builder.addCase(
      addExplorerItemTh.fulfilled,
      (state, action: PayloadAction<explorerItemFromServer>) => {
        if (state.entities.byId[action.payload.id]?.category === "folder") {
          state.entities.byId[action.payload.id] = {
            isUpdatePending: false,
            isRemoval: false,
            isOpen: false,
            ...action.payload,
          };
        } else {
          state.entities.byId[action.payload.id] = {
            isUpdatePending: false,
            isRemoval: false,
            ...action.payload,
          };
        }

        state.entities.ids.push(action.payload.id);
        state.addExplorerItemStatus = "success";
      }
    );
    builder.addCase(addExplorerItemTh.rejected, (state) => {
      state.addExplorerItemStatus = "failed";
    });

    builder.addCase(removeExplorerItemTh.pending, (state, action) => {
      const id = action.meta.arg;
      if (!!state.entities.byId[id]) {
        state.entities.byId[id].isRemoval = true;
      }

      state.removeExplorerItemStatus = "pending";
    });
    builder.addCase(
      removeExplorerItemTh.fulfilled,
      (state, action: PayloadAction<{ id: explorerItemId }>) => {
        const { id } = action.payload;

        let newById = state.entities.byId;
        let newIds = state.entities.ids;

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
        state.entities.byId = newById;
        state.entities.ids = newIds;

        state.removeExplorerItemStatus = "success";
      }
    );
    builder.addCase(removeExplorerItemTh.rejected, (state, action) => {
      const id = action.meta.arg;
      if (!!state.entities.byId[id]) {
        state.entities.byId[id].isRemoval = false;
      }
      state.removeExplorerItemStatus = "failed";
    });

    builder.addCase(updateExplorerItemTh.pending, (state, action) => {
      const id = action.meta.arg.id;

      if (!!state.entities.byId[id]) {
        state.entities.byId[id].isUpdatePending = true;
      }
      state.updateExplorerItemStatus = "pending";
    });
    builder.addCase(
      updateExplorerItemTh.fulfilled,
      (state, action: PayloadAction<explorerItemFromServer>) => {
        const explorerItem = state.entities.byId[action.payload.id];
        if (explorerItem) {
          explorerItem.name = action.payload.name;
          explorerItem.isUpdatePending = false;
        }
        state.entities.byId[action.payload.id] = explorerItem;

        state.updateExplorerItemStatus = "success";
      }
    );
    builder.addCase(updateExplorerItemTh.rejected, (state, action) => {
      const id = action.meta.arg.id;

      if (!!state.entities.byId[id]) {
        state.entities.byId[id].isUpdatePending = false;
      }
      state.updateExplorerItemStatus = "failed";
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
