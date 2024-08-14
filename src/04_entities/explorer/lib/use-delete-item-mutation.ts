import { queryClient } from "src/05_shared/api";
import { removeExplorerItem } from "../api/explorer-api";
import { explorerItem, explorerItemId, explorerItems, idDeletedExplorerItem } from "../api/types";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "src/05_shared/redux";
import { deleteFolder } from "../model";



export function useDeleteItemMutation(explorerItem: explorerItem) {
  const dispatch = useAppDispatch()
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
      })
          if (explorerItem.category === "folder") {
        dispatch(deleteFolder(data.id));
      }
    },
    mutationKey: ["removeExplorerItem"],
  });

}




// export const deleteItemMutationUpdateCache = (data: idDeletedExplorerItem) => {
//   // queryClient.invalidateQueries({queryKey: ["explorerItems"]})
//   queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
//     let newById = oldData.byId;
//     let newIds = oldData.ids;

//     function deleteElementTree(parentId: explorerItemId) {
//       let explorerItemsByIdToRemove: number[] = [];
//       delete newById[parentId];
//       newIds = newIds.filter((item) => item !== parentId);

//       for (let key in newById) {
//         if (!!newById[key]) {
//           if (newById[key].parentId === parentId) {
//             explorerItemsByIdToRemove.push(Number(key));
//           }
//         }
//       }

//       explorerItemsByIdToRemove.map((itemId) => {
//         deleteElementTree(itemId);
//       });
//     }
//     deleteElementTree(data.id);

//     // const { [data.id]: deleteVar, ...newById } = oldData.byId;
//     // const newIds = oldData.ids.filter((id) => id !== data.id);
//     return {
//       ...oldData,
//       byId: newById,
//       ids: newIds,
//     };
//   })}