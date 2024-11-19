import { queryOptions } from "@tanstack/react-query";
import { baseFetch } from "src/05_shared/api";
import { organizationInfoSchema, initialData } from "./types";

// export const getOrganizationInfoData = () => {
//   return queryOptions({
//     queryKey: ["organizationInfoData"],
//     queryFn: async () => {
//       const data = await baseFetch("api/template-manager/organization-info");
//       try {
//         return organizationInfoSchema.parse(data);
//       } catch (e) {
//         console.log(e);
//         throw e;
//       }
//     },

//     staleTime: 60 * 1000 * 60,
//   });
// };

export async function getOrganizationInfoData(initialData: initialData) {
  const data = await baseFetch("api/template-manager/organization-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(initialData),
  });

  try {
    console.log(data)
    return organizationInfoSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
