import { useMutation } from "@tanstack/react-query";
import { moveExplorerItemsData } from "../api/types";
import { moveExplorerItems } from "../api/explorer-api";
import { queryClient } from "src/05_shared/api";

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
