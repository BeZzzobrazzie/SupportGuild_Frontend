import { useMutation } from "@tanstack/react-query";
import { getOrganizationInfoData } from ".";
import { initialData } from "./types";

export function useGetOrgInfoMutation() {
  return useMutation({
    mutationFn: async (data: initialData) =>
      await getOrganizationInfoData({
        ...data,
      }),

    mutationKey: ["getOrgInfoMutation"],
  });
}
