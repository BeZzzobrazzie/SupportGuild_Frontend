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
    showContextMenu: (state) => {
      state.isShowed = true;
    },
    hideContextMenu: (state) => {
      state.isShowed = false;
      state.x = 0;
      state.y = 0;
    },
    setCoords: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      state.x = x;
      state.y = y;
    },
  },
});

export const { showContextMenu, hideContextMenu, setCoords } =
  contextMenuSlice.actions;
export const reducer = contextMenuSlice.reducer;
