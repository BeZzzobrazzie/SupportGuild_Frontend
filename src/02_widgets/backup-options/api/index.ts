import { baseFetch } from "src/05_shared/api";
import { backupRequestSchema, restoreRequestSchema } from "./types";

export async function backup() {
  const data = await baseFetch("api/template-manager/backup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({'one': 1}),
  });

  try {
    return backupRequestSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function restore() {
  const data = await baseFetch("api/template-manager/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({'one': 1}),
  });

  try {
    return restoreRequestSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
