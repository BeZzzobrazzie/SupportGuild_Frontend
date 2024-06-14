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

// const initialState: explorerSliceType = {
//   entities: [],
//   status: "idle",
//   error: null,
//   entityCreation: {
//     status: false,
//     parentId: null,
//     category: null,
//   },
// };

const initialState: explorerSliceTypeTwo = {
  // entitiesIsOpen: [],
  entityCreation: {
    status: false,
    parentId: null,
    category: null,
  },
};

// export const fetchEntities = createAsyncThunk(
//   "explorer/fetchEntities",
//   async () => {
//     const response = await fetch(
//       "http://localhost:5000/api/template-manager/explorer-entities"
//     );
//     const data = await response.json();
//     // console.log("fetch");
//     // console.log(data);
//     return data as entityFromServerType[];
//   }
// );

// export const addNewEntity = createAsyncThunk(
//   "explorer/addNewEntity",
//   async (initialEntity: initialEntityType) => {
//     const response = await fetch(
//       "http://localhost:5000/api/template-manager/explorer-entities",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json;charset=utf-8",
//         },
//         body: JSON.stringify(initialEntity),
//       }
//     );
//     const data = await response.json();
//     console.log(data);
//     return data as entityFromServerType;
//   }
// );

// export const deleteEntity = createAsyncThunk(
//   "explorer/deleteEntity",
//   async (id: number) => {
//     const response = await fetch(
//       "http://localhost:5000/api/template-manager/explorer-entities",
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json;charset=utf-8",
//         },
//         body: JSON.stringify({ id }),
//       }
//     );
//     const data = await response.json();
//     // console.log(data);
//     return data;
//   }
// );

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    // openFolder: (state, action: PayloadAction<number>) => {
    //   const folderId = action.payload;

    //   const targetFolder = state.entitiesIsOpen.find(
    //     (entity) => entity.id === folderId
    //   );
    //   if (targetFolder) {
    //     targetFolder.isOpen = true;
    //   } else {
    //     state.entitiesIsOpen.push({id: folderId, isOpen: true})
    //   }
    // },
    // closeFolder: (state, action: PayloadAction<number>) => {
    //   const folderId = action.payload;

    //   const targetFolder = state.entitiesIsOpen.find(
    //     (entity) => entity.id === folderId
    //   );
    //   if (targetFolder) {
    //     targetFolder.isOpen = false;
    //   } else {
    //     state.entitiesIsOpen.push({id: folderId, isOpen: true})
    //   }
    // },
    // deleteEntity: (state, action: PayloadAction<number>) => {
    //   const entityId = action.payload;
    //   const indexTargetEntity = state.entities.findIndex(
    //     (entity) => entity.id === entityId
    //   );
    //   state.entities.splice(indexTargetEntity, 1);
    // },
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
  // extraReducers(builder) {
  //   builder
  //     .addCase(fetchEntities.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(fetchEntities.fulfilled, (state, action) => {
  //       console.log("succeeded");
  //       console.log(action.payload);
  //       state.entities = action.payload;

  //       state.status = "succeeded";
  //     })
  //     .addCase(fetchEntities.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     });
  //   builder
  //     .addCase(addNewEntity.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(addNewEntity.fulfilled, (state, action) => {
  //       state.entities.push(action.payload);

  //       state.status = "succeeded";
  //     })
  //     .addCase(addNewEntity.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     });
  //   builder
  //     .addCase(deleteEntity.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(deleteEntity.fulfilled, (state, action) => {
  //       const entityId = action.payload;
  //       const entityIndex = state.entities.findIndex(
  //         (entity) => entity.id === entityId
  //       );
  //       state.entities.splice(entityIndex, 1);

  //       state.status = "succeeded";
  //     })
  //     .addCase(deleteEntity.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     });
  // },
});

export const {
  // openFolder,
  // closeFolder,
  // deleteEntity,
  addEntityCreator,
  removeEntityCreator,
} = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
