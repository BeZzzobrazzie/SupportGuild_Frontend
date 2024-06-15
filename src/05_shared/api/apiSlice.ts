import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  entityFromServerType,
  initialEntityType,
} from "src/04_entities/explorer/lib/types";

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
    removeEntity: builder.mutation({
      query: (id: number) => ({
        url: "/template-manager/explorer-entities",
        method: "DELETE",
        body: { id },
      }),
      // invalidatesTags: ["entity"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const pathResult = dispatch(
          apiSlice.util.updateQueryData("getEntities", undefined, (draft) => {
            const entityIndex = draft.findIndex((entity) => entity.id === id);
            if (entityIndex) {
              draft.splice(entityIndex, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          pathResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetEntitiesQuery,
  useAddEntityMutation,
  useRemoveEntityMutation,
} = apiSlice;
