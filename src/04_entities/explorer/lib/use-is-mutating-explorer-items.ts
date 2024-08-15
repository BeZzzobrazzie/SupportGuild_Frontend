import { useIsMutating } from "@tanstack/react-query";

export function useIsMutatingExplorerItems() {
  const isMutatingAddExplorerItem =
    useIsMutating({ mutationKey: ["addExplorerItem"] }) > 0;
  const isMutatingRemoveExplorerItem =
    useIsMutating({ mutationKey: ["removeExplorerItem"] }) > 0;
  const isMutatingRemoveSeveralExplorerItems =
    useIsMutating({ mutationKey: ["removeSeveralExplorerItems"] }) > 0;
  const isMutatingUpdateExplorerItem =
    useIsMutating({ mutationKey: ["updateExplorerItem"] }) > 0;

  return (
    isMutatingAddExplorerItem ||
    isMutatingRemoveExplorerItem ||
    isMutatingRemoveSeveralExplorerItems ||
    isMutatingUpdateExplorerItem
  );
}
