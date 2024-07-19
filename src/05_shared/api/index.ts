// import axios from "axios";

import {
  dataForUpdatingEntityType,
  explorerItemId,
  initialEntityType,
  templateCardIdType,
  templateCardInitialType,
} from "src/05_shared/api/types";
import { z } from "zod";

// const host = axios.create({
//   baseURL: "http://localhost:5000",
// });

// const explorerEntitiesURL = "api/template-manager/explorer-entities";

// export const getExplorerUnits = async () => {
//   const response = await host.get(explorerEntitiesURL, {});
//   return response.data;
// }

// export const createExplorerUnit = async (path: string, name: string, isDirectory: boolean, parent: number | null) => {
//   const response = await host.post(explorerEntitiesURL, {path, name, isDirectory, parent});
//   return response;
// }

// export const deleteExplorerUnit = async (id: number) => {
//   const response = await host.delete(explorerEntitiesURL, {data: {id}});
//   return response;
// };

// export const patchExplorerUnit = async (id: number, key: string, value:any) => {
//   const response = await host.patch(explorerEntitiesURL, {id, [key]: value});
//   return response;
// }

//------------------------

const baseURL = "http://localhost:5000/";
const explorerEntitiesURL = `${baseURL}api/template-manager/explorer-entities`;
const templateCardsUrl = `${baseURL}api/template-manager/template-cards`;

export async function getExplorerEntities() {
  const response = await fetch(explorerEntitiesURL);
  const data = await response.json();
  return data;
}

export async function addExplorerEntity(initialEntity: initialEntityType) {
  const response = await fetch(explorerEntitiesURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(initialEntity),
  });
  const data = await response.json();
  return data;
}

export async function removeExplorerEntity(id: explorerItemId) {
  const response = await fetch(explorerEntitiesURL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  return data;
}

export async function updateExplorerEntity(
  dataForUpdatingEntity: dataForUpdatingEntityType
) {
  const response = await fetch(explorerEntitiesURL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(dataForUpdatingEntity),
  });
  const data = await response.json();
  return data;
}

const templateCardId = z.number();
const templateCardSchema = z.object({
  id: templateCardId,
  name: z.string(),
  content: z.string(),
  parentId: z.number().nullable(),
})
const templateCardsSchema = templateCardSchema.array();

export async function getTemplateCards() {
  const response = await fetch(templateCardsUrl);
  const data = await response.json();
  // console.log(data);

  try {
    return templateCardsSchema.parse(data);
  } catch (e) {
    console.log(e);
  }
}

export async function addTemplateCard(initialData: templateCardInitialType) {
  const response = await fetch(templateCardsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(initialData),
  });
  const data = await response.json();

  try {
    return templateCardSchema.parse(data);
  } catch (e) {
    console.log(e);
  }
}

export async function removeTemplateCard(id: templateCardIdType) {
  const response = await fetch(templateCardsUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  try {
    return templateCardId.parse(data);
  } catch (e) {
    console.log(e);
  }}

// export async function updateExplorerEntity(dataForUpdatingEntity: dataForUpdatingEntityType) {
//   const response = await fetch(explorerEntitiesURL, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(dataForUpdatingEntity),
//   });
//   const data = await response.json();
//   return data;
// }
