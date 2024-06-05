import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShowed: false,
  x: 0,
  y: 0,
};

export const contextMenuSlice = createSlice({
  name: "contextMenu",
  initialState,
  reducers: {
    showContextMenu: (state, action: PayloadAction<{x: number, y: number}>) => {
      const {x, y} = action.payload;
      state.isShowed = true;
      state.x = x;
      state.y = y;
    },
    hideContextMenu: (state) => {
      state.isShowed = false;
      state.x = 0;
      state.y = 0;
    },
  },
});

export const { showContextMenu, hideContextMenu } = contextMenuSlice.actions;
export const reducer = contextMenuSlice.reducer;
