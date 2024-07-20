import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { rootReducer } from "src/00_app/store";

import { explorerItemId } from "src/05_shared/api/explorer/types";
import { getTemplateCards } from "src/05_shared/api/template-cards/template-cards-api";
import {
  templateCardIdType,
  templateCardType,
} from "src/05_shared/api/template-cards/types";
import { byId, card, initialState, templateCardsSliceType } from "../lib/types";

export const fetchCards = createAsyncThunk(
  "templateCards/fetchCards",
  async () => {
    const response = await getTemplateCards();
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
  },
  reducers: {},
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
  },
}).injectInto(rootReducer);
