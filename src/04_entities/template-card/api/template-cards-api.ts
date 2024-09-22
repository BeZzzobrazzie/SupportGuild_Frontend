import { queryOptions } from "@tanstack/react-query";
import {
  dataForUpdateTemplateCard,
  moveTemplateCardData,
  pasteTemplateCardsData,
  templateCardDataFromServerSchema,
  templateCardId,
  templateCardInitial,
  templateCardSchema,
} from "./types";
import { TEMPLATE_CARDS_QUERY_KEY } from "src/05_shared/query-key";
import { baseFetch } from "src/05_shared/api";

// const baseURL = "";
// const templateCardsUrl = `${baseURL}api/template-manager/template-cards`;

export const getTemplateCards = () => {
  return queryOptions({
    queryKey: [TEMPLATE_CARDS_QUERY_KEY],
    queryFn: async () => {
      const data = await baseFetch("api/template-manager/template-cards");
      try {
        return templateCardDataFromServerSchema.parse(data);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    staleTime: 5 * 1000 * 60,
  });
};

export async function addEmptyTemplateCard(initialData: templateCardInitial) {
  const data = await baseFetch("api/template-manager/template-cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(initialData),
  });

  try {
    return templateCardSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function updateTemplateCard(
  initialData: dataForUpdateTemplateCard
) {
  const data = await baseFetch("api/template-manager/template-cards", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(initialData),
  });
  try {
    return templateCardSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function removeTemplateCard(ids: templateCardId[]) {
  const data = await baseFetch("api/template-manager/template-cards", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ids}),
  });
  try {
    return templateCardDataFromServerSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function pasteTemplateCard(
  dataForUpdate: pasteTemplateCardsData
) {
  const data = await baseFetch("api/template-manager/template-cards/paste", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(dataForUpdate),
  });
  try {
    return templateCardDataFromServerSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}


export async function moveTemplateCard(
  initialData: moveTemplateCardData
) {
  const data = await baseFetch("api/template-manager/template-cards/move", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(initialData),
  });
  try {
    return templateCardDataFromServerSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}


// export async function addTemplateCard(initialData: templateCardInitialType) {
//   const response = await fetch(templateCardsUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(initialData),
//   });
//   const data = await response.json();

//   try {
//     return templateCardSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//throw e;

//   }
// }

// export async function removeTemplateCard(id: templateCardIdType) {
//   const response = await fetch(templateCardsUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify({ id }),
//   });
//   const data = await response.json();
//   try {
//     return removeTemplateCardIdSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }

// export async function updateTemplateCard(
//   initialData: dataForUpdatingTemplateCardType
// ) {
//   const response = await fetch(templateCardsUrl, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(initialData),
//   });
//   const data = await response.json();
//   try {
//     return templateCardSchema.parse(data);
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// }
