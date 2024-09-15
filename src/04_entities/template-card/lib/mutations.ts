import { useMutation } from "@tanstack/react-query";
import {
  addEmptyTemplateCard,
  pasteTemplateCard,
  removeTemplateCard,
  updateTemplateCard,
} from "../api/template-cards-api";
import {
  explorerItemId,
  explorerItemParentId,
} from "src/04_entities/explorer/api/types";
import { queryClient } from "src/05_shared/api";
import { TEMPLATE_CARDS_QUERY_KEY } from "src/05_shared/query-key";
import {
  dataForUpdateTemplateCard,
  templateCard,
  templateCardDataFromServer,
  templateCardId,
} from "../api/types";

export function useAddMutation() {
  return useMutation({
    mutationFn: async (data: { parentId: explorerItemParentId }) =>
      await addEmptyTemplateCard({
        ...data,
        content:
          '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
      }),
    onSuccess: (data) => {
      // queryClient.invalidateQueries({queryKey: ["explorerItems"]})
      queryClient.setQueryData(
        [TEMPLATE_CARDS_QUERY_KEY],
        (oldData: templateCardDataFromServer) => {
          return {
            ...oldData,
            byId: {
              ...oldData.byId,
              [data.id]: data,
            },
            ids: [...oldData.ids, data.id],
          };
        }
      );
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
    onSuccess: (data) => {
      queryClient.setQueryData(
        [TEMPLATE_CARDS_QUERY_KEY],
        (oldData: templateCardDataFromServer) => {
          return data;
        }
      );
    },
    mutationKey: ["pasteTemplateCard"],
  });
}
