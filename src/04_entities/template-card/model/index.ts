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
  templateCardIdType,
  templateCardType,
} from "src/04_entities/template-card/api/types";
import { byId, templateCardsSliceType } from "../api/types";
import {
  addEmptyTemplateCard,
  getTemplateCards,
  removeTemplateCard,
  updateTemplateCard,
} from "../api/template-cards-api";
import { rootReducer } from "src/05_shared/redux";

const initialState: templateCardsSliceType = {
  entities: {
    byId: {},
    ids: [],
  },
  // idEditingCard: null,
  cardsForEditing: {
    currentId: null,
    nextId: null,
  },
  fetchCardsStatus: "idle",
  addCardStatus: "idle",
  removeCardStatus: "idle",
  updateCardStatus: "idle",
};

export const fetchCards = createAsyncThunk(
  "templateCards/fetchCards",
  async () => {
    const response = await getTemplateCards();
    return response;
  }
);
export const addCard = createAsyncThunk(
  "templateCards/addCard",
  async (parentId: explorerItemParentId) => {
    const response = await addEmptyTemplateCard({ parentId });
    return response;
  }
);
export const removeCard = createAsyncThunk(
  "templateCards/removeCard",
  async (id: templateCardIdType) => {
    const response = await removeTemplateCard(id);
    return response;
  }
);
export const updateCard = createAsyncThunk(
  "templateCards/updateCard",
  async (dataForUpdatingCard: templateCardType) => {
    const response = await updateTemplateCard(dataForUpdatingCard);
    return response;
  }
);

export const templateCardsSlice = createSlice({
  name: "templateCards",
  initialState,
  selectors: {
    selectIds: (state) => state.entities.ids,
    selectCard: (state, id: templateCardIdType) => state.entities.byId[id],
    selectCollectionCards: createSelector(
      (state: templateCardsSliceType) => state.entities.byId,
      (state: templateCardsSliceType) => state.entities.ids,
      (_: templateCardsSliceType, parentId: explorerItemId | null) => parentId,
      (cards, ids, parentId) =>
        ids
          .map((id) => cards[id])
          .filter(
            (item): item is templateCardType => item?.parentId === parentId
          )
    ),
    selectIdEditingCard: (state) => state.cardsForEditing.currentId,
    selectIsUnsavedChanges: (state, id: templateCardIdType) =>
      state.cardsForEditing.currentId === id &&
      state.cardsForEditing.nextId !== null,
    // selectIdEditingCard: (state) => state.idEditingCard,
  },
  reducers: {
    startEditing: (state, action: PayloadAction<templateCardIdType>) => {
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCards.pending, (state) => {
      state.fetchCardsStatus = "pending";
    });
    builder.addCase(
      fetchCards.fulfilled,
      (state, action: PayloadAction<templateCardType[] | undefined>) => {
        if (action.payload !== undefined) {
          const items = action.payload;
          const byId = action.payload.reduce((byId: byId, item) => {
            byId[item.id] = item;
            return byId;
          }, {});
          state.entities.byId = byId;
          state.entities.ids = items.map((item) => item.id);
          state.fetchCardsStatus = "success";
        }
      }
    );
    builder.addCase(fetchCards.rejected, (state) => {
      state.fetchCardsStatus = "failed";
    });

    builder.addCase(addCard.pending, (state) => {
      state.addCardStatus = "pending";
    });
    builder.addCase(
      addCard.fulfilled,
      (state, action: PayloadAction<templateCardType | undefined>) => {
        if (action.payload !== undefined) {
          (state.entities.byId[action.payload.id] = action.payload),
            state.entities.ids.push(action.payload.id);
          state.addCardStatus = "success";
        }
      }
    );
    builder.addCase(addCard.rejected, (state) => {
      state.addCardStatus = "failed";
    });

    builder.addCase(removeCard.pending, (state, action) => {
      state.removeCardStatus = "pending";
    });
    builder.addCase(
      removeCard.fulfilled,
      (state, action: PayloadAction<{ id: explorerItemId } | undefined>) => {
        const id = action.payload?.id;

        if (id !== undefined) {
          let newById = state.entities.byId;
          delete newById[id];
          state.entities.byId = newById;
          state.entities.ids = state.entities.ids.filter((item) => item !== id);

          state.removeCardStatus = "success";
        }
      }
    );
    builder.addCase(removeCard.rejected, (state, action) => {
      state.removeCardStatus = "failed";
    });

    builder.addCase(updateCard.pending, (state, action) => {
      state.updateCardStatus = "pending";
    });
    builder.addCase(
      updateCard.fulfilled,
      (state, action: PayloadAction<templateCardType | undefined>) => {
        if (action.payload) {
          const templateCard = state.entities.byId[action.payload.id];
          if (templateCard) {
            templateCard.content = action.payload.content;
          }
          state.entities.byId[action.payload.id] = templateCard;

          state.cardsForEditing.currentId = state.cardsForEditing.nextId;
          state.cardsForEditing.nextId = null;
          // state.idEditingCard = null;
          state.updateCardStatus = "success";
        }
      }
    );
    builder.addCase(updateCard.rejected, (state, action) => {
      state.updateCardStatus = "failed";
    });
  },
}).injectInto(rootReducer);

export const { startEditing, resetEditing, continueEditing } =
  templateCardsSlice.actions;
