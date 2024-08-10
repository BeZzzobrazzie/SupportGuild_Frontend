import { baseFetch } from "src/05_shared/api";
import {
  dataForUpdate,
  dataFromServer,
  explorerItemId,
  idDeletedExplorerItemSchema,
  idDeletedExplorerItemsSchema,
  initialExplorerItem,
} from "./types";
import { queryOptions } from "@tanstack/react-query";

// const explorerItemsURL = `${baseURL}api/template-manager/explorer-entities`;

export const getExplorerItems = () => {
  console.log("res");
  return queryOptions({
    queryKey: ["explorerItems"],
    queryFn: async () => {
      const data = await baseFetch("api/template-manager/explorer-entities");
      try {
        return dataFromServer.parse(data);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    staleTime: 5 * 1000 * 60,
  });
};

// export async function getExplorerItems() {
//   const response = await fetch(explorerItemsURL);
//   const data = await response.json();

//   try {
//     return explorerItemsFromServerSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }

// export async function addExplorerItem(initialData: initialExplorerItem) {
//   const response = await fetch(explorerItemsURL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(initialData),
//   });
//   const data = await response.json();

//   try {
//     return explorerItemFromServerSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }

// export async function addExplorerItems(initialData: initialExplorerItems) {
//   const response = await fetch(explorerItemsURL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(initialData),
//   });
//   const data = await response.json();

//   try {
//     return explorerItemsFromServerSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }

// export async function removeExplorerItem(id: explorerItemId) {
//   const response = await fetch(explorerItemsURL, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify({ id }),
//   });
//   const data = await response.json();

//   try {
//     return idDeletedExplorerItemSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }

// export async function removeSeveralExplorerItems(ids: explorerItemId[]) {
//   const response = await fetch(`${baseURL}api/template-manager/explorer-entities/delete-several`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify({ ids }),
//   });
//   const data = await response.json();

//   try {
//     return idDeletedExplorerItemsSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }

// export async function updateExplorerItem(dataForUpdate: dataForUpdate) {
//   const response = await fetch(explorerItemsURL, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(dataForUpdate),
//   });
//   const data = await response.json();

//   try {
//     return explorerItemFromServerSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }
