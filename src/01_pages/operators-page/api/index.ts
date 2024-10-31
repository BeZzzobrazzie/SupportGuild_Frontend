import { queryOptions } from "@tanstack/react-query";
import { baseFetch } from "src/05_shared/api";




export const getOperatorsData = () => {
  return queryOptions({
    queryKey: ["operatorsData"],
    queryFn: async () => {
      const data = await baseFetch("api/template-manager/list-of-operators");
      // try {
      //   return dataFromServer.parse(data);
      // } catch (e) {
      //   console.log(e);
      //   throw e;
      // }
      return data
    },

    staleTime: 5 * 1000 * 60,
  });
};