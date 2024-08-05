import { baseURL } from "../../../05_shared/api";
import {
  dataForUpdatingTemplateCardType,
  removeTemplateCardIdSchema,
  templateCardIdType,
  templateCardInitialType,
  templateCardSchema,
  templateCardsSchema,
} from "./types";

const templateCardsUrl = `${baseURL}api/template-manager/template-cards`;

export async function getTemplateCards() {
  const response = await fetch(templateCardsUrl);
  const data = await response.json();

  try {
    return templateCardsSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function addEmptyTemplateCard(
  initialData: templateCardInitialType
) {
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
    return removeTemplateCardIdSchema.parse(data);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function updateTemplateCard(
  initialData: dataForUpdatingTemplateCardType
) {
  const response = await fetch(templateCardsUrl, {
    method: "PATCH",
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
    throw e;
  }
}
