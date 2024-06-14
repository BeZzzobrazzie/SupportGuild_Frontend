import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { entityFromServerType, initialEntityType } from "src/04_entities/explorer/lib/types";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
  }),
  tagTypes: ["entity"],
  endpoints: (builder) => ({
    getEntities: builder.query<entityFromServerType[], void>({
      query: () => "/template-manager/explorer-entities",
      providesTags: ["entity"],
    }),
    addEntity: builder.mutation<initialEntityType, Partial<initialEntityType>>({
      query: (initialEntity) => ({
        url: "/template-manager/explorer-entities",
        method: "POST",
        body: initialEntity,
      }),
      invalidatesTags: ["entity"],
    }),
  }),
});



export const { useGetEntitiesQuery, useAddEntityMutation } = apiSlice