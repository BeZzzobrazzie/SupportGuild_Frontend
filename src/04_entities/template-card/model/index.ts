import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createAppSelector, rootReducer } from "src/05_shared/redux";
import { templateCardId, templateCardsSliceType } from "../api/types";

const initialState: templateCardsSliceType = {
  // idEditingCard: null,
  cardsForEditing: {
    currentId: null,
    nextId: null,
  },
  idsSelectedTemplates: {},
  idsCopiedTemplates: [],
  outputEditorChanged: false,
  mode: "read",
};

export const templateCardsSlice = createSlice({
  name: "templateCards",
  initialState,
  selectors: {
    selectIdEditingCard: (state) => state.cardsForEditing.currentId,
    selectIsUnsavedChanges: (state, id: templateCardId) =>
      state.cardsForEditing.currentId === id &&
      state.cardsForEditing.nextId !== null,
    selectMode: (state) => state.mode,
    selectIsSelected: (state, id: templateCardId) =>
      state.idsSelectedTemplates[id] === true,
    selectAmountSelected: (state) => {
      return Object.values(state.idsSelectedTemplates).filter(
        (value) => value === true
      ).length;
    },
    // selectSelectedIds: (state) => {
    //   return Object.keys(state.idsSelectedTemplates)
    //     .filter((key) => state.idsSelectedTemplates[Number(key)] === true)
    //     .map((key) => Number(key));
    // },
    selectIdsSelectedTemplates: (state) => state.idsSelectedTemplates,
    selectCopiedIds: (state) => state.idsCopiedTemplates,
    // selectOutputEditorContent: (state) => state.outputEditorContent,
    selectOutputEditorChanged: (state) => state.outputEditorChanged,
  },
  reducers: {
    startEditing: (state, action: PayloadAction<templateCardId>) => {
      if (state.cardsForEditing.currentId === null) {
        state.cardsForEditing.currentId = action.payload;
      } else {
        state.cardsForEditing.nextId = action.payload;
      }
      // state.idEditingCard = action.payload;
    },
    resetEditing: (state) => {
      state.cardsForEditing.currentId = state.cardsForEditing.nextId;
      state.cardsForEditing.nextId = null;

      // state.idEditingCard = null;
    },
    continueEditing: (state) => {
      state.cardsForEditing.nextId = null;
    },
    editModeOn: (state) => {
      state.mode = "edit";
    },
    editModeOff: (state) => {
      state.mode = "read";
    },
    selectedModeOn: (state) => {
      state.mode = "select";
    },
    selectedModeOff: (state) => {
      state.mode = "read";
    },
    addToSelected: (state, action: PayloadAction<templateCardId>) => {
      state.idsSelectedTemplates[action.payload] = true;
    },
    removeFromSelected: (state, action: PayloadAction<templateCardId>) => {
      state.idsSelectedTemplates[action.payload] = false;
    },
    resetSelected: (state) => {
      state.idsSelectedTemplates = { ...{} };
    },
    selectAll: (state, action: PayloadAction<templateCardId[]>) => {
      action.payload.forEach((id) => {
        state.idsSelectedTemplates[id] = true;
      });
    },
    copyOne: (state, action: PayloadAction<templateCardId>) => {
      state.idsCopiedTemplates = [action.payload];
    },
    copySelected: (state) => {
      state.idsCopiedTemplates = Object.keys(state.idsSelectedTemplates)
        .filter((key) => state.idsSelectedTemplates[Number(key)] === true)
        .map((key) => Number(key));
    },
  },
  extraReducers: (builder) => {},
}).injectInto(rootReducer);

export const selectSelectedIds = createAppSelector(
  [templateCardsSlice.selectors.selectIdsSelectedTemplates],
  (a) =>
    Object.keys(a)
      .filter((key) => a[Number(key)] === true)
      .map((key) => Number(key))
);

export const {
  startEditing,
  resetEditing,
  continueEditing,
  selectedModeOn,
  selectedModeOff,
  addToSelected,
  removeFromSelected,
  resetSelected,
  selectAll,
  editModeOn,
  editModeOff,
  copyOne,
  copySelected,
} = templateCardsSlice.actions;
