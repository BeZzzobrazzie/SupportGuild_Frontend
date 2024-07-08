// import axios from "axios";

import {
  dataForUpdatingEntityType,
  explorerItemId,
  initialEntityType,
} from "src/04_entities/explorer/lib/types";

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

export async function updateExplorerEntity(dataForUpdatingEntity: dataForUpdatingEntityType) {
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
