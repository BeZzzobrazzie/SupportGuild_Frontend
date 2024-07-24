import { explorerItemParentId } from "src/05_shared/api/explorer/types";
import {
  templateCardIdType,
  templateCardNameType,
} from "src/05_shared/api/template-cards/types";

export type card = {
  id: templateCardIdType;
  parentId: explorerItemParentId;
  name?: templateCardNameType;
  content: string;
};
export type byId = Record<templateCardIdType, card | undefined>;
export type templateCardsSliceType = {
  entities: {
    byId: byId;
    ids: templateCardIdType[];
  };
  // idEditingCard: templateCardIdType | null;
  cardsForEditing: {
    currentId: templateCardIdType | null;
    nextId: templateCardIdType | null;
  };
  fetchCardsStatus: "idle" | "pending" | "success" | "failed";
  addCardStatus: "idle" | "pending" | "success" | "failed";
  removeCardStatus: "idle" | "pending" | "success" | "failed";
  updateCardStatus: "idle" | "pending" | "success" | "failed";
};
