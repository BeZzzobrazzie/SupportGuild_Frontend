import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { entityFromServerType, initialEntityType } from "../lib/types";

export const explorerApi = createApi({
  reducerPath: "entities",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/template-manager/explorer-entities",
  }),
  endpoints: (builder) => ({
    getEntities: builder.query<entityFromServerType[], void>({
      query: () => "",
    }),
    addEntity: builder.mutation<initialEntityType, Partial<initialEntityType>>({
      query: (initialEntity) => ({
        url: "",
        method: "POST",
        body: initialEntity,
      }),
    }),
    removeEntity: builder.mutation({
      query: (id: number) => ({
        url: "",
        method: "Delete",
        body: id,
      }),
    }),
  }),
});

export const {
  useGetEntitiesQuery,
  useAddEntityMutation,
  useRemoveEntityMutation,
} = explorerApi
