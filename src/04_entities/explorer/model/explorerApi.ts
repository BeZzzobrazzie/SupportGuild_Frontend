import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { entityFromServerType, initialEntityType } from "../lib/types";
import { apiSlice } from "src/05_shared/api/apiSlice";

const explorerApi = createApi({
  reducerPath: "entities",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/template-manager/explorer-entities",
  }),
  tagTypes: ["entity"],
  endpoints: (builder) => ({
    getEntities: builder.query<entityFromServerType[], void>({
      query: () => "",
      providesTags: ["entity"],
    }),
    addEntity: builder.mutation<initialEntityType, Partial<initialEntityType>>({
      query: (initialEntity) => ({
        url: "",
        method: "POST",
        body: initialEntity,
      }),
      invalidatesTags: ["entity"],
    }),
    removeEntity: builder.mutation({
      query: (id: number) => ({
        url: "",
        method: "Delete",
        body: {id},
      }),
      invalidatesTags: ["entity"],
      


    }),
  }),
});

// export const {
//   useGetEntitiesQuery,
//   useAddEntityMutation,
//   useRemoveEntityMutation,
// } = explorerApi
