import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShowed: false,
};

export const contextMenuSlice = createSlice({
  name: "contextMenu",
  initialState,
  reducers: {
    showContextMenu: (state) => {
      state.isShowed = true;
    },
    hideContextMenu: (state) => {
      state.isShowed = false;
    },
  },
});

export const { showContextMenu, hideContextMenu } = contextMenuSlice.actions;
export const reducer = contextMenuSlice.reducer;
