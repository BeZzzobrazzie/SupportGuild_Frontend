import { useEffect } from "react";
import { explorerSlice } from "src/04_entities/explorer/model";
import { Card } from "./card";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "../api/template-cards-api";

export function ListCards() {
  const {
    isPending,
    isError,
    data: allCards,
    error,
  } = useSuspenseQuery(getTemplateCards());

  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );

  const cards = allCards.ids
    .map((id) => allCards.byId[id])
    .filter((card) => card.parentId === activeCollection);

  return cards.map((card) => <Card key={card.id} id={card.id} card={card} />);
}
