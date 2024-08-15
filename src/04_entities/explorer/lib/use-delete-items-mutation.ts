import { queryClient } from "src/05_shared/api";
import { removeSeveralExplorerItems } from "../api/explorer-api";
import { explorerItems, idDeletedExplorerItems } from "../api/types";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { deleteFolder, explorerSlice } from "../model";

export function useDeleteItemsMutation() {
  const dispatch = useAppDispatch();
  const selectedItemsIds = useAppSelector((state) =>
    explorerSlice.selectors.selectSelectedItemsIds(state)
  );

  return useMutation({
    mutationFn: async () => await removeSeveralExplorerItems(selectedItemsIds),
    onSuccess: (data: idDeletedExplorerItems) => {
      queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
        let newById = oldData.byId;
        let newIds = oldData.ids;

        data.ids.forEach((id) => {
          delete newById[id];
          newIds = newIds.filter((item) => item !== id);
        });

        return {
          ...oldData,
          byId: newById,
          ids: newIds,
        };
      });
      data.ids.forEach((id) => dispatch(deleteFolder(id)));
    },
    mutationKey: ["removeSeveralExplorerItems"],
  });
}
