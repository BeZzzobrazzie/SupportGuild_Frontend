import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { fetchCards, templateCardsSlice } from "../model";
import { explorerSlice } from "src/04_entities/explorer/model";
import { Card } from "./card";

export function ListCards() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCards());
  }, []);

  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const cards = useAppSelector((state) =>
    templateCardsSlice.selectors.selectCollectionCards(state, activeCollection)
  );

  return cards.map((item) => <Card key={item.id} id={item.id} />);
}
