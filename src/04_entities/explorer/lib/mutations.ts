import { useMutation } from "@tanstack/react-query";
import {
  explorerItem,
  dataForUpdate,
  explorerItems,
  idDeletedExplorerItems,
  explorerItemId,
  idDeletedExplorerItem,
  moveExplorerItemsData,
} from "../api/types";
import {
  moveExplorerItems,
  removeExplorerItem,
  removeSeveralExplorerItems,
  updateExplorerItem,
} from "../api/explorer-api";
import { queryClient } from "src/05_shared/api";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { clearSelection, deleteFolder, explorerSlice } from "../model";

export function useUpdateMutation(
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
) {
  return useMutation({
    mutationFn: async (data: dataForUpdate) => await updateExplorerItem(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
        return {
          ...oldData,
          byId: {
            ...oldData.byId,
            [data.id]: data,
          },
        };
      });
      setIsUpdating(false);
    },
    mutationKey: ["updateExplorerItem"],
  });
}

export function useDeleteItemMutation(explorerItem: explorerItem) {
  const dispatch = useAppDispatch();
  const isSelectedItem = useAppSelector((state) =>
    explorerSlice.selectors.selectIsSelectedItem(state, explorerItem.id)
  );
  return useMutation({
    mutationFn: async (data: explorerItemId) => await removeExplorerItem(data),
    onSuccess: (data: idDeletedExplorerItem) => {
      queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
        let newById = oldData.byId;
        let newIds = oldData.ids;

        function deleteElementTree(parentId: explorerItemId) {
          let explorerItemsByIdToRemove: number[] = [];
          delete newById[parentId];
          newIds = newIds.filter((item) => item !== parentId);

          for (let key in newById) {
            if (!!newById[key]) {
              if (newById[key].parentId === parentId) {
                explorerItemsByIdToRemove.push(Number(key));
              }
            }
          }

          explorerItemsByIdToRemove.map((itemId) => {
            deleteElementTree(itemId);
          });
        }
        deleteElementTree(data.id);

        // const { [data.id]: deleteVar, ...newById } = oldData.byId;
        // const newIds = oldData.ids.filter((id) => id !== data.id);
        return {
          ...oldData,
          byId: newById,
          ids: newIds,
        };
      });
      if (explorerItem.category === "folder") {
        dispatch(deleteFolder(data.id));
      }
      if (isSelectedItem) {
        dispatch(clearSelection());
      }
    },
    mutationKey: ["removeExplorerItem"],
  });
}

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
      dispatch(clearSelection());
    },
    mutationKey: ["removeSeveralExplorerItems"],
  });
}

export function useMoveMutation() {
  return useMutation({
    mutationFn: async (data: moveExplorerItemsData) =>
      await moveExplorerItems(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["explorerItems"], () => {
        return data;
      });
    },
    mutationKey: ["moveExplorerItems"],
  });
}
