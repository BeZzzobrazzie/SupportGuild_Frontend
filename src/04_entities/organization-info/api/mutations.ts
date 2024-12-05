import { useMutation } from "@tanstack/react-query";
import { getOrganizationInfoData } from ".";
import { initialData, organizationInfoData } from "./types";
import { Dispatch, SetStateAction } from "react";

interface useGetOrgInfoMutationProps {
  setMutationData: Dispatch<SetStateAction<organizationInfoData[] | null>>;
}
export function useGetOrgInfoMutation({
  setMutationData,
}: useGetOrgInfoMutationProps) {
  return useMutation({
    mutationFn: async (data: initialData) =>
      await getOrganizationInfoData({
        ...data,
      }),

    mutationKey: ["getOrgInfoMutation"],
    onSuccess: (data) => {
      setMutationData(data);
    },
  });
}
