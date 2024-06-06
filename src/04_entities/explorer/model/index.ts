import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { entityType } from "../lib/types";



const initialState: entityType[] = [
  {
    id: 0,
    type: "file",
    name: "first",
    parent: -1,
  },
  {
    id: 1,
    type: "folder",
    name: "second",
    parent: -1,
  },
  {
    id: 2,
    type: "folder",
    name: "third",
    parent: 1,
  },
  {
    id: 3,
    type: "file",
    name: "forth",
    parent: 2,
  },
];

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    // showContextMenu: (state, action: PayloadAction<{x: number, y: number}>) => {
    //   const {x, y} = action.payload;
    //   state.isShowed = true;
    //   state.x = x;
    //   state.y = y;
    // },
    // hideContextMenu: (state) => {
    //   state.isShowed = false;
    //   state.x = 0;
    //   state.y = 0;
    // },
  },
});

export const { } = explorerSlice.actions;
export const reducer = explorerSlice.reducer;
