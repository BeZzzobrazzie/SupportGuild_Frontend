import { useMutation } from "@tanstack/react-query";
import {
  explorerItem,
  dataForUpdate,
  explorerItems,
  idDeletedExplorerItems,
  explorerItemId,
  idDeletedExplorerItem,
  moveExplorerItemsData,
  pasteExplorerItemsData,
  explorerItemCategory,
  explorerItemParentId,
} from "../api/types";
import {
  moveExplorerItems,
  pasteExplorerItems,
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

// export function useDeleteItemMutation(
//   explorerItemId: explorerItemId,
//   category: explorerItemCategory
// ) {
//   const dispatch = useAppDispatch();
//   const isSelectedItem = useAppSelector((state) =>
//     explorerSlice.selectors.selectIsSelectedItem(state, explorerItemId)
//   );
//   return useMutation({
//     mutationFn: async (data: explorerItemId) => removeExplorerItem(data),
//     onSuccess: (data: idDeletedExplorerItem) => {
//       queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
//         const newById = oldData.byId;
//         let newIds = oldData.ids;

//         function deleteElementTree(parentId: explorerItemId) {
//           const explorerItemsByIdToRemove: number[] = [];
//           delete newById[parentId];
//           newIds = newIds.filter((item) => item !== parentId);

//           for (const key in newById) {
//             if (newById[key]) {
//               if (newById[key].parentId === parentId) {
//                 explorerItemsByIdToRemove.push(Number(key));
//               }
//             }
//           }

//           explorerItemsByIdToRemove.map((itemId) => {
//             deleteElementTree(itemId);
//           });
//         }
//         deleteElementTree(data.id);

//         // const { [data.id]: deleteVar, ...newById } = oldData.byId;
//         // const newIds = oldData.ids.filter((id) => id !== data.id);
//         console.log("..");
//         console.log(newById);
//         console.log(newIds);
//         console.log({
//           ...oldData,
//           byId: newById,
//           ids: newIds,
//         });
//         return {
//           ...oldData,
//           byId: newById,
//           ids: newIds,
//         };
//         // return data;
//       });
//       // if (category === "folder") {
//       //   dispatch(deleteFolder(explorerItemId));
//       // }
//       // if (isSelectedItem) {
//       //   dispatch(clearSelection());
//       // }
//     },
//     mutationKey: ["removeExplorerItem"],
//   });
// }

export function useDeleteItemsMutation(explorerItemId: explorerItemId) {
  const selectedItemsIds = useAppSelector((state) =>
    explorerSlice.selectors.selectSelectedItemsIds(state)
  );
  const isSelectedItem = useAppSelector((state) =>
    explorerSlice.selectors.selectIsSelectedItem(state, explorerItemId)
  );
  const requestData = isSelectedItem ? selectedItemsIds : [explorerItemId]

  return useMutation({
    mutationFn: async () => await removeSeveralExplorerItems(requestData),
    onSuccess: (data: idDeletedExplorerItems) => {
      queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
        const newById = oldData.byId;
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
      // data.ids.forEach((id) => dispatch(deleteFolder(id)));
      // dispatch(clearSelection());
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

export function usePasteMutation() {
  const copiedItemsIds = useAppSelector((state) =>
    explorerSlice.selectors.selectCopiedItemsIds(state)
  );
  return useMutation({
    mutationFn: async (parentId: explorerItemParentId) =>
      await pasteExplorerItems({parentId, ids: copiedItemsIds}),
    onSuccess: (data) => {
      queryClient.setQueryData(["explorerItems"], () => {
        return data;
      });
    },
    mutationKey: ["pasteExplorerItems"],
  });
}
