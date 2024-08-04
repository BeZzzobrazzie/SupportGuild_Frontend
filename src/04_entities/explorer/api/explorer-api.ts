import { baseURL } from "src/05_shared/api";
import {
  dataForUpdate,
  explorerItemFromServerSchema,
  explorerItemId,
  explorerItemIdSchema,
  explorerItemsFromServerSchema,
  initialExplorerItem,
} from "./types";

const explorerItemsURL = `${baseURL}api/template-manager/explorer-entities`;

export async function getExplorerItems() {
  const response = await fetch(explorerItemsURL);
  const data = await response.json();

  try {
    return explorerItemsFromServerSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function addExplorerItem(initialData: initialExplorerItem) {
  const response = await fetch(explorerItemsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(initialData),
  });
  const data = await response.json();

  try {
    return explorerItemFromServerSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function removeExplorerItem(id: explorerItemId) {
  const response = await fetch(explorerItemsURL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();

  try {
    return explorerItemIdSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function updateExplorerItem(dataForUpdate: dataForUpdate) {
  const response = await fetch(explorerItemsURL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(dataForUpdate),
  });
  const data = await response.json();

  try {
    return explorerItemFromServerSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
