// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {
//   entityFromServerType,
//   initialEntityType,
// } from "src/04_entities/explorer/lib/types";

// export const apiSlice = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:5000/api",
//   }),
//   tagTypes: ["entity"],
//   endpoints: (builder) => ({
//     getEntities: builder.query<entityFromServerType[], void>({
//       query: () => "/template-manager/explorer-entities",
//       providesTags: ["entity"],
//     }),
//     addEntity: builder.mutation<entityFromServerType, initialEntityType>({
//       query: (initialEntity) => ({
//         url: "/template-manager/explorer-entities",
//         method: "POST",
//         body: initialEntity,
//       }),
//       // invalidatesTags: ["entity"],
//       async onQueryStarted(initialEntity, { dispatch, queryFulfilled }) {
//         try {
//           const {data: createdEntity} = await queryFulfilled;
//           const pathResult = dispatch(
//             apiSlice.util.updateQueryData('getEntities', undefined, (draft) => {
//               draft.push(createdEntity)
//             })
//           )
//         } catch {}
//       }
//     }),
//     removeEntity: builder.mutation({
//       query: (id: number) => ({
//         url: "/template-manager/explorer-entities",
//         method: "DELETE",
//         body: { id },
//       }),
//       // invalidatesTags: ["entity"],
//       async onQueryStarted(id, { dispatch, queryFulfilled }) {
//         const pathResult = dispatch(
//           apiSlice.util.updateQueryData("getEntities", undefined, (draft) => {
//             let entitiesToRemove: entityFromServerType[] = [];
//             function createEntitiesToRemove(parent: entityFromServerType) {
//               entitiesToRemove = entitiesToRemove.concat(parent);
//               const children = draft.filter(
//                 (entity) => entity.parentId === parent.id
//               );
//               children.forEach((child) => createEntitiesToRemove(child));
//             }

//             const parent = draft.find((entity) => entity.id === id);
//             if (parent) {
//               createEntitiesToRemove(parent);
//             }
//             return draft.filter((elem) => !entitiesToRemove.includes(elem));
//           })
//         );
//         try {
//           await queryFulfilled;
//         } catch {
//           pathResult.undo();
//         }
//       },
//     }),
//   }),
// });

// // export const {
// //   useGetEntitiesQuery,
// //   useAddEntityMutation,
// //   useRemoveEntityMutation,
// // } = apiSlice;
