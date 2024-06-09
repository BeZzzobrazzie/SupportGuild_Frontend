import axios from "axios";


const host = axios.create({
  baseURL: "http://localhost:5000",
});

const explorerEntitiesURL = "api/template-manager/explorer-entities";

export const getExplorerUnits = async () => {
  const response = await host.get(explorerEntitiesURL, {});
  return response.data;
}

export const createExplorerUnit = async (path: string, name: string, isDirectory: boolean, parent: number | null) => {
  const response = await host.post(explorerEntitiesURL, {path, name, isDirectory, parent});
  return response;
}

export const deleteExplorerUnit = async (id: number) => {
  const response = await host.delete(explorerEntitiesURL, {data: {id}});
  return response;
};

export const patchExplorerUnit = async (id: number, key: string, value:any) => {
  const response = await host.patch(explorerEntitiesURL, {id, [key]: value});
  return response;
}


//------------------------

// const baseURL = "http://localhost:5000/";
// const explorerEntitiesURL = `${baseURL}api/template-manager/explorer-entities`;

// export async function getExplorerEntities() {
//   const response = await fetch(explorerEntitiesURL);
//   const data = await response.json();
//   return data;
// }
