import { useEffect } from "react";
import { explorerSlice } from "src/04_entities/explorer/model";
import { Card, Divider } from "./card";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "../api/template-card-api";

import classes from "./list-cards.module.css";
import { templateCard } from "../api/types";

export function ListCards() {
  const {
    isPending,
    isError,
    data: allCards,
    error,
  } = useSuspenseQuery(getTemplateCards());

  // console.log(allCards);

  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );

  const cards: templateCard[] = [];

  let firstCard = allCards.ids
    .map((id) => allCards.byId[id])
    .find(
      (card) => card.parentId === activeCollection && card.prevCardId === null
    );

  while (firstCard) {
    cards.push(firstCard);
    if (firstCard.nextCardId !== null) {
      firstCard = allCards.byId[firstCard.nextCardId];
    } else {
      firstCard = undefined;
    }
  }

  return (
    <div className={classes["list-cards"]}>
      {activeCollection ? (
        cards.map((card) => <Card key={card.id} id={card.id} card={card} />)
      ) : (
        <div>Select or create collection</div>
      )}
    </div>
  );
}
