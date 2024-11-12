import { useEffect, useRef, useState } from "react";
import { explorerSlice } from "src/04_entities/explorer/model";
import { Card } from "./card";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTemplateCards } from "../api/template-card-api";

import classes from "./list-cards.module.css";
import { templateCard } from "../api/types";
import { useTranslation } from "react-i18next";
import { ScrollToTopButton } from "src/03_features/scrollToTop";

interface ListCardsProps {
  cards: templateCard[];
}
export function ListCards({ cards }: ListCardsProps) {
  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className={classes["list-cards"]}>
        {activeCollection ? (
          cards.map((card) => <Card key={card.id} id={card.id} card={card} />)
        ) : (
          <div>{t("insteadOfTemplates")}</div>
        )}
      </div>
    </>
  );
}
