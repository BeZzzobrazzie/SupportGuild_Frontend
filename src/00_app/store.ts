import { configureStore } from "@reduxjs/toolkit";
import { contextMenuModel } from "src/04_entities/contextmenu";
import { explorerModel } from "src/04_entities/explorer";
import { explorerApi } from "src/04_entities/explorer/model/explorerApi";

export const store = configureStore({
  reducer: {
    contextMenu: contextMenuModel.reducer,
    explorer: explorerModel.reducer,
    [explorerApi.reducerPath]: explorerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(explorerApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
