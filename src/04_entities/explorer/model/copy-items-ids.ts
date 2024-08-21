import { queryClient } from "src/05_shared/api";
import { AppThunk, useAppSelector } from "src/05_shared/redux";
import { explorerItemId } from "../api/types";
import { copyItemsIds, explorerSlice } from ".";
import { getAllChildren } from "../lib/get-all-children";
import { getExplorerItems } from "../api/explorer-api";

export const copyItemsIdsThunk =
  (explorerItemId: explorerItemId): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const explorerItems = await queryClient.ensureQueryData(getExplorerItems());
    // const isSelectedItem = useAppSelector((state) =>
    //   explorerSlice.selectors.selectIsSelectedItem(state, explorerItemId)
    // );
    // const selectedItemsIds = useAppSelector((state) =>
    //   explorerSlice.selectors.selectSelectedItemsIds(state)
    // );
    const isSelectedItem = explorerSlice.selectors.selectIsSelectedItem(
      getState(),
      explorerItemId
    );

    const selectedItemsIds = explorerSlice.selectors.selectSelectedItemsIds(
      getState()
    );
    if (isSelectedItem) {
      const set = new Set<explorerItemId>();
      for (const id of selectedItemsIds) {
        const arr = [
          ...getAllChildren(id, explorerItems).map((child) => child.id),
          id,
        ];
        arr.forEach((item) => set.add(item));
      }
      dispatch(copyItemsIds([...set]));
    } else {
      dispatch(
        copyItemsIds([
          ...getAllChildren(explorerItemId, explorerItems).map(
            (child) => child.id
          ),
          explorerItemId,
        ])
      );
    }
  };
