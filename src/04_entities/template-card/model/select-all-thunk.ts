import { explorerSlice } from "src/04_entities/explorer/model";
import { AppThunk } from "src/05_shared/redux";
import { getTemplateCards } from "../api/template-card-api";
import { queryClient } from "src/05_shared/api";
import { selectAll } from ".";

export const selectAllThunk =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const templateCards = await queryClient.ensureQueryData(getTemplateCards());
    const activeCollection = explorerSlice.selectors.selectActiveCollection(
      getState()
    );

    const activeCollectionCards = templateCards.ids
      .map((id) => templateCards.byId[id])
      .filter((card) => card.parentId === activeCollection);

    dispatch(selectAll(activeCollectionCards.map((card) => card.id)));
  };
