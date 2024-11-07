import classes from "./style.module.css";
import { Navbar } from "src/02_widgets/navbar";
import { PageLayout } from "src/05_shared/ui/page-layout";
import { OperatorsTable } from "src/02_widgets/operators-table";
import { Button, Container } from "@mantine/core";
import { CommandPanelBase } from "src/05_shared/ui/command-panel-base";
import {
  IconFilter,
  IconInfoSquare,
  IconStar,
  IconStarFilled,
  IconZoom,
} from "@tabler/icons-react";
import { Info } from "./info/info";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OperatorsTableFavorites } from "src/02_widgets/operators-table";

export function OperatorsPage() {
  const { t, i18n } = useTranslation();
  const [infoStatus, setInfoStatus] = useState(getInfoStatus());
  const [favoritesView, setFavoritesView] = useState(getFavoritesView());
  const [favoriteOperators, setFavoriteOperators] = useState(
    getFavoriteOperators()
  );

  function getFavoriteOperators(): string[] {
    const storedFavorites = localStorage.getItem("favoriteOperators");
    try {
      const parsedFavorites = JSON.parse(storedFavorites || "[]");
      return Array.isArray(parsedFavorites) ? parsedFavorites : [];
    } catch {
      return [];
    }
  }
  useEffect(() => {
    localStorage.setItem(
      "favoriteOperators",
      JSON.stringify(favoriteOperators)
    );
  }, [favoriteOperators]);
  useEffect(() => {
    setFavoriteOperators(getFavoriteOperators());
  }, []);

  function getFavoritesView() {
    if (typeof window !== "undefined") {
      const favoritesView = localStorage.getItem("favoritesView");
      if (favoritesView) {
        return JSON.parse(favoritesView) as boolean;
      }
    }
    return false;
  }
  useEffect(() => {
    localStorage.setItem("favoritesView", JSON.stringify(favoritesView));
  }, [favoritesView]);
  useEffect(() => {
    setFavoritesView(getFavoritesView());
  }, []);

  function getInfoStatus() {
    if (typeof window !== "undefined") {
      const infoStatus = localStorage.getItem("infoStatus");
      if (infoStatus) {
        return JSON.parse(infoStatus) as boolean;
      }
    }
    return true;
  }
  useEffect(() => {
    localStorage.setItem("infoStatus", JSON.stringify(infoStatus));
  }, [infoStatus]);
  useEffect(() => {
    setInfoStatus(getInfoStatus());
  }, []);

  return (
    <PageLayout navbar={<Navbar />}>
      <Container>
        <div className={classes["page-wrap"]}>
          <CommandPanelBase>
            <Button.Group>
              <Button
                leftSection={favoritesView ? <IconStarFilled /> : <IconStar />}
                size="sm"
                variant={favoritesView ? "outline" : "default"}
                onClick={() =>
                  // setFavoritesView(() => {
                  //   localStorage.setItem(
                  //     "favoriteOperators",
                  //     JSON.stringify(!favoritesView)
                  //   );
                  //   return !favoritesView;
                  // })
                  setFavoritesView(!favoritesView)
                }
                // disabled
              >
                {t("operators.commandPanel.favorites")}
              </Button>

              <Button
                leftSection={<IconFilter />}
                size="sm"
                variant="default"
                // onClick={handleClickCopy}
                disabled
              >
                {t("operators.commandPanel.filter")}
              </Button>
              <Button
                leftSection={<IconInfoSquare />}
                size="sm"
                variant={infoStatus ? "outline" : "default"}
                onClick={() => setInfoStatus(!infoStatus)}
              >
                {t("operators.commandPanel.info")}
              </Button>
              <Button
                leftSection={<IconZoom />}
                size="sm"
                variant="default"
                // onClick={handleClickCopy}
                disabled
              >
                {t("operators.commandPanel.search")}
              </Button>
            </Button.Group>
          </CommandPanelBase>
          {infoStatus && <Info />}
          {favoritesView && (
            <OperatorsTableFavorites
              favoriteOperators={favoriteOperators}
              setFavoriteOperators={setFavoriteOperators}
            />
          )}
          <OperatorsTable
            favoriteOperators={favoriteOperators}
            setFavoriteOperators={setFavoriteOperators}
          />
        </div>
      </Container>
    </PageLayout>
  );
}
