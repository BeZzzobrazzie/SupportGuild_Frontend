import { useEffect } from "react";
import { explorerSlice } from "src/04_entities/explorer/model";
import { Card, Divider } from "./card";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "../api/template-cards-api";

import classes from "./list-cards.module.css";
import { templateCard } from "../api/types";

export function ListCards() {
  const {
    isPending,
    isError,
    data: allCards,
    error,
  } = useSuspenseQuery(getTemplateCards());

  console.log(allCards)

  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );

  // const cards = allCards.ids
  //   .map((id) => allCards.byId[id])
  //   .filter((card) => card.parentId === activeCollection);

  const cards: templateCard[] = [];

  // Находим первую карточку в списке (у которой prevCardId === null)
  let firstCard = allCards.ids
    .map((id) => allCards.byId[id])
    .find(
      (card) => card.parentId === activeCollection && card.prevCardId === null
    );

  // Проходим по всему связанному списку, начиная с первой карточки
  while (firstCard) {
    // console.log('while')
    // console.log(firstCard)
    cards.push(firstCard); // Добавляем текущую карточку в массив
    if (firstCard.nextCardId !== null) {
      // console.log('if')
      firstCard = allCards.byId[firstCard.nextCardId]; // Переходим к следующей карточке
    } else {
      firstCard = undefined; // Конец списка
    }
  }

  return (
    <div className={classes["list-cards"]}>
      {cards.map((card) => (
        <Card key={card.id} id={card.id} card={card} />
      ))}
    </div>
  );
}
