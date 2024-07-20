import { baseURL } from "..";
import {
  dataForUpdatingEntityType,
  explorerItemId,
  initialEntityType,
} from "./types";

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
