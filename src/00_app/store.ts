import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { contextMenuModel } from "src/04_entities/contextmenu";
import { explorerModel } from "src/04_entities/explorer";
import { apiSlice } from "src/05_shared/api/apiSlice";


export const rootReducer = combineSlices()


export const store = configureStore({
  reducer: rootReducer,

});



// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
export type RootState = any;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

