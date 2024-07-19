import { combineSlices, configureStore } from "@reduxjs/toolkit";



export const rootReducer = combineSlices()


export const store = configureStore({
  reducer: rootReducer,

});



// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
export type RootState = any;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

