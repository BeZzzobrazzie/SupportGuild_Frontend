import { useMutation } from "@tanstack/react-query";
import {
  addEmptyTemplateCard,
  moveTemplateCard,
  pasteTemplateCard,
  removeTemplateCard,
  updateTemplateCard,
} from "./template-card-api";
import {
  explorerItemId,
  explorerItemParentId,
} from "src/04_entities/explorer/api/types";
import { queryClient } from "src/05_shared/api";
import { TEMPLATE_CARDS_QUERY_KEY } from "src/04_entities/template-card/api/template-card-api";
import {
  dataForUpdateTemplateCard,
  moveTemplateCardData,
  templateCard,
  templateCardDataFromServer,
  templateCardId,
} from "./types";

export function useAddMutation() {
  return useMutation({
    mutationFn: async (data: { parentId: explorerItemParentId }) =>
      await addEmptyTemplateCard({
        ...data,
        content:
          '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
      }),
    // onSuccess: (data) => {
    //   // queryClient.invalidateQueries({queryKey: ["explorerItems"]})
    //   queryClient.setQueryData(
    //     [TEMPLATE_CARDS_QUERY_KEY],
    //     (oldData: templateCardDataFromServer) => {
    //       return {
    //         ...oldData,
    //         byId: {
    //           ...oldData.byId,
    //           [data.id]: data,
    //         },
    //         ids: [...oldData.ids, data.id],
    //       };
    //     }
    //   );
    // },
    // onSuccess: (data) => {
    //   queryClient.setQueryData(
    //     [TEMPLATE_CARDS_QUERY_KEY],
    //     (oldData: templateCardDataFromServer) => {
    //       return data;
    //     }
    //   );
    // },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [TEMPLATE_CARDS_QUERY_KEY] })
    },
    mutationKey: ["addTemplateCard"],
  });
}

export function useUpdateMutation() {
  return useMutation({
    mutationFn: async (data: dataForUpdateTemplateCard) =>
      await updateTemplateCard(data),
    onSuccess: (data) => {
      queryClient.setQueryData(
        [TEMPLATE_CARDS_QUERY_KEY],
        (oldData: templateCardDataFromServer) => {
          return {
            ...oldData,
            byId: {
              ...oldData.byId,
              [data.id]: data,
            },
          };
        }
      );
    },
    mutationKey: ["updateTemplateCard"],
  });
}

export function useRemoveMutation() {
  return useMutation({
    mutationFn: async (ids: templateCardId[]) => await removeTemplateCard(ids),
    onSuccess: (data) => {
      queryClient.setQueryData(
        [TEMPLATE_CARDS_QUERY_KEY],
        (oldData: templateCardDataFromServer) => {
          return data;
        }
      );
    },
    mutationKey: ["removeTemplateCard"],
  });
}

export function usePasteMutation() {
  return useMutation({
    mutationFn: async (data: {
      parentId: explorerItemId;
      ids: templateCardId[];
    }) => await pasteTemplateCard(data),
    // onSuccess: (data) => {
    //   queryClient.setQueryData(
    //     [TEMPLATE_CARDS_QUERY_KEY],
    //     (oldData: templateCardDataFromServer) => {
    //       return data;
    //     }
    //   );
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATE_CARDS_QUERY_KEY] })
    },
    mutationKey: ["pasteTemplateCard"],
  });
}


export function useMoveMutation() {
  return useMutation({
    mutationFn: async (data: moveTemplateCardData) =>
      await moveTemplateCard(data),
    // onMutate: async (newData) => {
    //   await queryClient.cancelQueries({ queryKey: [TEMPLATE_CARDS_QUERY_KEY] });

    //   const previousData = queryClient.getQueryData([TEMPLATE_CARDS_QUERY_KEY]);

    //   queryClient.setQueryData(
    //     [TEMPLATE_CARDS_QUERY_KEY],
    //     (oldData: templateCardDataFromServer) => {
    //       const movedCard = oldData.byId[newData.movedCardId];
    //       const movedCardPrev = movedCard.prevCardId
    //         ? oldData.byId[movedCard.prevCardId]
    //         : null;
    //       const movedCardNext = movedCard.prevCardId
    //         ? oldData.byId[movedCard.prevCardId]
    //         : null;

    //       const targetCard = oldData.byId[newData.targetCardId];
    //       // const targetCardPrev = targetCard.prevCardId ? oldData.byId[targetCard.prevCardId] : null;
    //       const targetCardNext = targetCard.prevCardId
    //         ? oldData.byId[targetCard.prevCardId]
    //         : null;

    //       if (movedCardPrev) {
    //         movedCardPrev.nextCardId = movedCardNext ? movedCardNext.id : null;
    //       }
    //       if (movedCardNext) {
    //         movedCardNext.prevCardId = movedCardPrev ? movedCardPrev.id : null;
    //       }

    //       if (targetCard) {
    //         targetCard.nextCardId = movedCard.id;
    //       }
    //       if (targetCardNext) {
    //         targetCardNext.prevCardId = movedCard.id;
    //       }

    //       movedCard.prevCardId = targetCard.id;
    //       movedCard.nextCardId = targetCardNext ? targetCardNext.id : null;

    //       return {
    //         ...oldData,
    //         byId: {
    //           ...oldData.byId,
    //           [newData.movedCardId]: movedCard,
    //           ...(movedCardPrev && { [movedCardPrev.id]: movedCardPrev }),
    //           ...(movedCardNext && { [movedCardNext.id]: movedCardNext }),
    //           [targetCard.id]: targetCard,
    //           ...(targetCardNext && { [targetCardNext.id]: targetCardNext }),
    //         },
    //       };
    //     }
    //   );

    //   return { previousData };
    // },
    // onError: (err, newData, context) => {
    //   queryClient.setQueryData(
    //     [TEMPLATE_CARDS_QUERY_KEY],
    //     context?.previousData
    //   );
    // },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: [TEMPLATE_CARDS_QUERY_KEY] });
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATE_CARDS_QUERY_KEY] })
    },
  });
}