import { CommandPanel, ListCards } from "src/04_entities/template-card";
import classes from "./style.module.css";
import { explorerSlice } from "src/04_entities/explorer/model";
import { useAppSelector } from "src/05_shared/redux";
import { CardEditorProvider } from "src/04_entities/template-card/lib/card-editor-provider";
import { templateCard } from "src/04_entities/template-card/api/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "src/04_entities/template-card/api/template-card-api";
import { useState, useMemo, useEffect, useCallback } from "react";
import { templateCardsSlice } from "src/04_entities/template-card/model";

export function Templates() {
  const {
    isPending,
    isError,
    data: allCards,
    error,
  } = useSuspenseQuery(getTemplateCards());

  const searchTerm = useAppSelector((state) => templateCardsSlice.selectors.selectSearchTerm(state));
  const searchArea = useAppSelector((state) => templateCardsSlice.selectors.selectSearchArea(state));
  const mode = useAppSelector((state) => templateCardsSlice.selectors.selectMode(state));
  const isSearchMode = mode === "search";

  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const isActiveCollection = activeCollection !== null;

  // Состояние для ленивой загрузки
  const [visibleCards, setVisibleCards] = useState<templateCard[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const CARDS_PER_PAGE = 20; // Количество карточек для подгрузки за раз

  // Мемоизация для оптимизации вычисления списка карточек
  const filteredCards = useMemo(() => {
    if (!allCards || !allCards.ids || allCards.ids.length === 0) {
      return [];
    }

    if (isSearchMode && searchArea === "all") {
      return allCards.ids
        .map((id) => allCards.byId[id])
        .filter(
          (card) =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } else {
      const collectionCards = allCards.ids
        .map((id) => allCards.byId[id])
        .filter((card) => card.parentId === activeCollection);

      if (collectionCards.length === 0) {
        return [];
      }

      const firstCard = collectionCards.find(
        (card) => card.prevCardId === null
      );

      if (!firstCard) {
        return collectionCards;
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

      return orderedCards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [allCards, searchTerm, isSearchMode, searchArea, activeCollection]);

  // Ленивая загрузка: функция для подгрузки следующей порции карточек
  const loadMoreCards = useCallback(() => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * CARDS_PER_PAGE;
    const newVisibleCards = filteredCards.slice(
      startIndex,
      startIndex + CARDS_PER_PAGE
    );

    setVisibleCards((prevCards) => [...prevCards, ...newVisibleCards]);
    setPage(nextPage);
    setIsLoadingMore(false);
  }, [page, filteredCards]);

  // Инициализация первой страницы карточек при изменении фильтра
  useEffect(() => {
    setPage(1);
    const initialCards = filteredCards.slice(0, CARDS_PER_PAGE);
    setVisibleCards(initialCards);
  }, [filteredCards]);

  // Обработчик для подгрузки карточек при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !isLoadingMore &&
        visibleCards.length < filteredCards.length
      ) {
        loadMoreCards();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadingMore, visibleCards, filteredCards, loadMoreCards]);

  return (
    <div className={classes["templates"]}>
      <CardEditorProvider>
        {isActiveCollection && <CommandPanel />}
        <ListCards cards={visibleCards} />
        {isLoadingMore && <div>Загрузка...</div>}
      </CardEditorProvider>
    </div>
  );
}

// import { CommandPanel, ListCards } from "src/04_entities/template-card";
// import classes from "./style.module.css";
// import { explorerSlice } from "src/04_entities/explorer/model";
// import { useAppSelector } from "src/05_shared/redux";
// import { CardEditorProvider } from "src/04_entities/template-card/lib/card-editor-provider";
// import { templateCard } from "src/04_entities/template-card/api/types";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { getTemplateCards } from "src/04_entities/template-card/api/template-card-api";
// import { useEffect, useMemo, useState } from "react";

// export function Templates() {
//   const {
//     isPending,
//     isError,
//     data: allCards,
//     error,
//   } = useSuspenseQuery(getTemplateCards());

//   const searchTerm = useAppSelector((state) => state.templateCards.searchTerm);
//   const searchArea = useAppSelector((state) => state.templateCards.searchArea);
//   const mode = useAppSelector((state) => state.templateCards.mode);
//   const isSearchMode = mode === "search";

//   const activeCollection = useAppSelector((state) =>
//     explorerSlice.selectors.selectActiveCollection(state)
//   );
//   const isActiveCollection = activeCollection !== null;

//   const filteredCards = useMemo(() => {
//     if (!allCards || !allCards.ids || allCards.ids.length === 0) {
//       return [];
//     }

//     if (isSearchMode && searchArea === "all") {
//       return allCards.ids
//         .map((id) => allCards.byId[id])
//         .filter((card) =>
//           card.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     } else {
//       const collectionCards = allCards.ids
//         .map((id) => allCards.byId[id])
//         .filter((card) => card.parentId === activeCollection);

//       if (collectionCards.length === 0) {
//         return [];
//       }

//       const firstCard = collectionCards.find(
//         (card) => card.prevCardId === null
//       );

//       if (!firstCard) {
//         return collectionCards;
//       }

//       const orderedCards: templateCard[] = [];
//       let currentCard: templateCard | undefined = firstCard;

//       while (currentCard) {
//         orderedCards.push(currentCard);
//         currentCard =
//           currentCard.nextCardId !== null
//             ? allCards.byId[currentCard.nextCardId]
//             : undefined;
//       }

//       return orderedCards.filter((card) =>
//         card.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//   }, [allCards, searchTerm, isSearchMode, searchArea, activeCollection]);

//   return (
//     <div className={classes["templates"]}>
//       <CardEditorProvider>
//         {isActiveCollection && <CommandPanel />}
//         <ListCards cards={filteredCards} />
//       </CardEditorProvider>
//     </div>
//   );
// }
