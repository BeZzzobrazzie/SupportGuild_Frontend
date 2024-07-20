import { explorerItemParentId } from "src/05_shared/api/explorer/types";
import {
  templateCardIdType,
  templateCardNameType,
} from "src/05_shared/api/template-cards/types";

type id = number;

export type card = {
  id: templateCardIdType;
  parentId: explorerItemParentId;
  name: templateCardNameType;
  content: string;
};
export type byId = Record<id, card | undefined>;
export type templateCardsSliceType = {
  entities: {
    byId: byId;
    ids: id[];
  };
  fetchCardsStatus: "idle" | "pending" | "success" | "failed";
};

export const initialState: templateCardsSliceType = {
  entities: {
    byId: {},
    ids: [],
  },
  fetchCardsStatus: "idle",
};
