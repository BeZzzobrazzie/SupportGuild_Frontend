import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { rootReducer } from "src/00_app/store";

import {
  explorerItemId,
  explorerItemParentId,
} from "src/05_shared/api/explorer/types";
import {
  addEmptyTemplateCard,
  getTemplateCards,
  removeTemplateCard,
} from "src/05_shared/api/template-cards/template-cards-api";
import {
  templateCardIdType,
  templateCardType,
} from "src/05_shared/api/template-cards/types";
import { byId, card, templateCardsSliceType } from "../lib/types";

const initialState: templateCardsSliceType = {
  entities: {
    byId: {},
    ids: [],
  },
  idEditingCard: null,
  fetchCardsStatus: "idle",
  addCardStatus: "idle",
  removeCardStatus: "idle",
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
          .filter((item): item is card => item?.parentId === parentId)
    ),
    selectIdEditingCard: (state) => state.idEditingCard,
  },
  reducers: {
    startEditing: (state, action: PayloadAction<templateCardIdType>) => {
      state.idEditingCard = action.payload;
    },
    resetEditing: (state) => {
      state.idEditingCard = null;
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
      (state, action: PayloadAction<{id: explorerItemId} | undefined>) => {
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
  },
}).injectInto(rootReducer);


export const { startEditing, resetEditing } = templateCardsSlice.actions;
