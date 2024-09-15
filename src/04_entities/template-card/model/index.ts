import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  explorerItemId,
  explorerItemParentId,
} from "src/04_entities/explorer/api/types";

import {
  addEmptyTemplateCard,
  getTemplateCards,
} from "../api/template-cards-api";
import { rootReducer } from "src/05_shared/redux";
import { templateCardId, templateCardsSliceType } from "../api/types";
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

const initialState: templateCardsSliceType = {
  // idEditingCard: null,
  cardsForEditing: {
    currentId: null,
    nextId: null,
  },
  idsSelectedTemplates: {},
  idsCopiedTemplates: [],
  outputEditorChanged: false,
  // outputEditorContent: [
  //   {
  //     type: "paragraph",
  //     children: [{ text: "" }],
  //   },
  // ],
  mode: "read",
  // selectedMode: false,
};

export const templateCardsSlice = createSlice({
  name: "templateCards",
  initialState,
  selectors: {
    selectIdEditingCard: (state) => state.cardsForEditing.currentId,
    selectIsUnsavedChanges: (state, id: templateCardId) =>
      state.cardsForEditing.currentId === id &&
      state.cardsForEditing.nextId !== null,
    // selectIdEditingCard: (state) => state.idEditingCard,
    // selectIsSelectedMode: (state) => state.selectedMode,
    selectMode: (state) => state.mode,
    selectIsSelected: (state, id: templateCardId) =>
      state.idsSelectedTemplates[id] === true,
    selectAmountSelected: (state) => {
      return Object.values(state.idsSelectedTemplates).filter(
        (value) => value === true
      ).length;
    },
    selectSelectedIds: (state) => {
      return Object.keys(state.idsSelectedTemplates)
        .filter((key) => state.idsSelectedTemplates[Number(key)] === true)
        .map((key) => Number(key));
    },
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
    addToOutputEditor: (state, action: PayloadAction<Descendant[]>) => {
      // state.outputEditorContent = action.payload;
      state.outputEditorChanged = true;
    },
    saveOutputEditorChange: (state) => {
      state.outputEditorChanged = false;
    }
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchCards.pending, (state) => {
    //   state.fetchCardsStatus = "pending";
    // });
    // builder.addCase(
    //   fetchCards.fulfilled,
    //   (state, action: PayloadAction<templateCardType[] | undefined>) => {
    //     if (action.payload !== undefined) {
    //       const items = action.payload;
    //       const byId = action.payload.reduce((byId: byId, item) => {
    //         byId[item.id] = item;
    //         return byId;
    //       }, {});
    //       state.entities.byId = byId;
    //       state.entities.ids = items.map((item) => item.id);
    //       state.fetchCardsStatus = "success";
    //     }
    //   }
    // );
    // builder.addCase(fetchCards.rejected, (state) => {
    //   state.fetchCardsStatus = "failed";
    // });
    // builder.addCase(addCard.pending, (state) => {
    //   state.addCardStatus = "pending";
    // });
    // builder.addCase(
    //   addCard.fulfilled,
    //   (state, action: PayloadAction<templateCardType | undefined>) => {
    //     if (action.payload !== undefined) {
    //       (state.entities.byId[action.payload.id] = action.payload),
    //         state.entities.ids.push(action.payload.id);
    //       state.addCardStatus = "success";
    //     }
    //   }
    // );
    // builder.addCase(addCard.rejected, (state) => {
    //   state.addCardStatus = "failed";
    // });
    // builder.addCase(removeCard.pending, (state, action) => {
    //   state.removeCardStatus = "pending";
    // });
    // builder.addCase(
    //   removeCard.fulfilled,
    //   (state, action: PayloadAction<{ id: explorerItemId } | undefined>) => {
    //     const id = action.payload?.id;
    //     if (id !== undefined) {
    //       let newById = state.entities.byId;
    //       delete newById[id];
    //       state.entities.byId = newById;
    //       state.entities.ids = state.entities.ids.filter((item) => item !== id);
    //       state.removeCardStatus = "success";
    //     }
    //   }
    // );
    // builder.addCase(removeCard.rejected, (state, action) => {
    //   state.removeCardStatus = "failed";
    // });
    // builder.addCase(updateCard.pending, (state, action) => {
    //   state.updateCardStatus = "pending";
    // });
    // builder.addCase(
    //   updateCard.fulfilled,
    //   (state, action: PayloadAction<templateCardType | undefined>) => {
    //     if (action.payload) {
    //       const templateCard = state.entities.byId[action.payload.id];
    //       if (templateCard) {
    //         templateCard.content = action.payload.content;
    //       }
    //       state.entities.byId[action.payload.id] = templateCard;
    //       state.cardsForEditing.currentId = state.cardsForEditing.nextId;
    //       state.cardsForEditing.nextId = null;
    //       // state.idEditingCard = null;
    //       state.updateCardStatus = "success";
    //     }
    //   }
    // );
    // builder.addCase(updateCard.rejected, (state, action) => {
    //   state.updateCardStatus = "failed";
    // });
  },
}).injectInto(rootReducer);

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
  addToOutputEditor,
  saveOutputEditorChange
} = templateCardsSlice.actions;
