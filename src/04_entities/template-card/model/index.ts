import { createSlice } from "@reduxjs/toolkit";

type id = number;

type card = {
  id: id;
  parentId: number;
  content: string;
};
type byId = Record<id, card | undefined>;
type initialState = {
  entities: {
    byId: byId;
    ids: id[];
  };
};

const initialState: initialState = {
  entities: {
    byId: {},
    ids: [],
  },
};

export const templateCardsSlice = createSlice({
  name: "templateCards",
  initialState,
  reducers: {},
});
