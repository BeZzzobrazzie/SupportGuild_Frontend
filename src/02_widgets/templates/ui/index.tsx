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
    const cards: templateCard[] = [];

    if ((isSearchMode && searchArea === "all") || activeCollection === null) {
      allCards.ids.forEach((id) => {
        const card = allCards.byId[id];
        cards.push(card);
      });
      return cards;
    } else {
      let firstCard = allCards.ids
        .map((id) => allCards.byId[id])
        .find(
          (card) =>
            card.parentId === activeCollection && card.prevCardId === null
        );

      while (firstCard) {
        cards.push(firstCard);
        if (firstCard.nextCardId !== null) {
          firstCard = allCards.byId[firstCard.nextCardId];
        } else {
          firstCard = undefined;
        }
      }

      return cards;
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
