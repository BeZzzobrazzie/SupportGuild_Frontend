import { configureStore } from '@reduxjs/toolkit'
import { contextMenuModel } from 'src/04_entities/contextmenu'

export const store = configureStore({
  reducer: {
    contextMenu: contextMenuModel.reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch