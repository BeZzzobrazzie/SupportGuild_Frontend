import { queryOptions } from "@tanstack/react-query";
import { baseFetch } from "src/05_shared/api";
import { operatorsSchema } from "./types";




export const getOperatorsData = () => {
  return queryOptions({
    queryKey: ["operatorsData"],
    queryFn: async () => {
      const data = await baseFetch("api/template-manager/list-of-operators");
      try {
        return operatorsSchema.parse(data);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    staleTime: 5 * 1000 * 60,
  });
};