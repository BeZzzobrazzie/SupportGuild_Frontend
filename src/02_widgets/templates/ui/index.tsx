import { CommandPanel, ListCards } from "src/04_entities/template-card";
import classes from "./style.module.css";
import { explorerSlice } from "src/04_entities/explorer/model";
import { useAppSelector } from "src/05_shared/redux";
import { CardEditorProvider } from "src/04_entities/template-card/lib/card-editor-provider";
import { templateCard } from "src/04_entities/template-card/api/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "src/04_entities/template-card/api/template-card-api";
import { useEffect, useMemo, useState } from "react";

export function Templates() {
  const {
    isPending,
    isError,
    data: allCards,
    error,
  } = useSuspenseQuery(getTemplateCards());
  const [filteredCards, setFilteredCards] = useState<templateCard[]>([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const searchTerm = useAppSelector((state) => state.templateCards.searchTerm);
  const searchArea = useAppSelector((state) => state.templateCards.searchArea);
  const mode = useAppSelector((state) => state.templateCards.mode);
  const isSearchMode = mode === "search";

  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const isActiveCollection = activeCollection !== null;

  const cards: templateCard[] = useMemo(() => {
    if (!allCards || !allCards.ids || allCards.ids.length === 0) {
      return [];
    }

    if (isSearchMode && searchArea === "all") {
      return allCards.ids.map((id) => allCards.byId[id]);
    } else {
      const filteredCards = allCards.ids
        .map((id) => allCards.byId[id])
        .filter((card) => card.parentId === activeCollection);

      if (filteredCards.length === 0) {
        return [];
      }

      const firstCard = filteredCards.find((card) => card.prevCardId === null);

      if (!firstCard) {
        return filteredCards;
      }

      const orderedCards: templateCard[] = [];
      let currentCard: templateCard | undefined = firstCard;

      while (currentCard) {
        orderedCards.push(currentCard);
        currentCard =
          currentCard.nextCardId !== null
            ? allCards.byId[currentCard.nextCardId]
            : undefined;
      }

      return orderedCards;
    }
  }, [allCards, activeCollection, isSearchMode, searchArea]);

  useEffect(() => {
    const filterCards = (searchTerm: string) => {
      const filteredCards = cards.filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCards(filteredCards);
    };

    filterCards(searchTerm);
  }, [cards, searchTerm]);

  return (
    <div className={classes["templates"]}>
      <CardEditorProvider>
        {isActiveCollection && <CommandPanel />}
        <ListCards cards={filteredCards} />
      </CardEditorProvider>
    </div>
  );
}
