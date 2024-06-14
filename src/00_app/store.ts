import { configureStore } from "@reduxjs/toolkit";
import { contextMenuModel } from "src/04_entities/contextmenu";
import { explorerModel } from "src/04_entities/explorer";
import { apiSlice } from "src/05_shared/api/apiSlice";

export const store = configureStore({
  reducer: {
    contextMenu: contextMenuModel.reducer,
    explorer: explorerModel.reducer,
    // [explorerApi.reducerPath]: explorerApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
