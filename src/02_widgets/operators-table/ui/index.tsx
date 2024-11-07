import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Modal,
  Table,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getOperatorsData } from "../../../04_entities/operators/api";
import {
  IconCopy,
  IconDotsVertical,
  IconFilter,
  IconInfoSquare,
  IconStar,
  IconStarFilled,
  IconZoom,
} from "@tabler/icons-react";
import classes from "./style.module.css";
import { operatorData } from "../../../04_entities/operators/api/types";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { CommandPanelBase } from "src/05_shared/ui/command-panel-base";
import { Info } from "../../../01_pages/operators-page/info/info";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { OperatorsTableBase } from "src/05_shared/ui";
import { OperatorCard } from "src/04_entities/operators";

interface OperatorsTableProps {
  favoriteOperators: string[];
  setFavoriteOperators: Dispatch<SetStateAction<string[]>>;
}
export function OperatorsTable({
  favoriteOperators,
  setFavoriteOperators,
}: OperatorsTableProps) {
  const { isPending, isError, data, error } =
    useSuspenseQuery(getOperatorsData());
  const { t, i18n } = useTranslation();

  const rows = data.map((operator) => {
    const isFavorite =
      operator.prefix && favoriteOperators.includes(operator.prefix)
        ? true
        : false;
    return (
      <OperatorRow
        operatorData={operator}
        key={operator.index}
        isFavorite={isFavorite}
        setFavoriteOperators={setFavoriteOperators}
      />
    );
  });

  return (
    <>
      <Divider size="md" label={"All operators"} labelPosition={"left"} />
      <OperatorsTableBase content={rows} />
    </>
  );
}

interface OperatorRowProps {
  operatorData: operatorData;
  setFavoriteOperators: Dispatch<SetStateAction<string[]>>;
  isFavorite: boolean;
}
function OperatorRow({
  operatorData,
  isFavorite,
  setFavoriteOperators,
}: OperatorRowProps) {
  const [opened, { open, close }] = useDisclosure(false);

  function handleClickStar() {
    setFavoriteOperators((prevFavorites) => {
      if (operatorData.prefix) {
        const isFavorite = prevFavorites.includes(operatorData.prefix);
        const updatedFavorites = isFavorite
          ? prevFavorites.filter((prefix) => prefix !== operatorData.prefix)
          : [...prevFavorites, operatorData.prefix];
        return updatedFavorites;
      }
      return prevFavorites;
    });
  }

  function handleClickCopy() {
    if (operatorData.email && navigator.clipboard) {
      const item = new ClipboardItem({
        "text/plain": operatorData.email,
        "text/html": operatorData.email,
      });
      navigator.clipboard.write([item]);
    }
  }

  return (
    <>
      <Table.Tr key={operatorData.name}>
        <Table.Td className={classes["cell-icon"]}>
          <div className={classes["btn-wrapper"]}>
            <ActionIcon variant="subtle" color="gray" onClick={handleClickStar}>
              {isFavorite ? <IconStarFilled /> : <IconStar />}
            </ActionIcon>
          </div>
        </Table.Td>
        <Table.Td className={classes["cell-prefix"]}>
          {operatorData.prefix}
        </Table.Td>
        <Table.Td className={classes["cell-name"]}>
          {operatorData.name}
        </Table.Td>
        <Table.Td className={classes["cell-email"]}>
          {operatorData.email}
        </Table.Td>
        <Table.Td className={classes["cell-icon"]}>
          <div className={classes["btn-wrapper"]}>
            <ActionIcon variant="subtle" color="gray" onClick={handleClickCopy}>
              <IconCopy />
            </ActionIcon>
          </div>
        </Table.Td>
        <Table.Td className={classes["cell-icon"]}>
          <div className={classes["btn-wrapper"]}>
            <ActionIcon variant="subtle" color="gray" onClick={open}>
              <IconDotsVertical />
            </ActionIcon>
          </div>
        </Table.Td>
      </Table.Tr>

      <OperatorCard
        opened={opened}
        open={open}
        close={close}
        operatorData={operatorData}
      />
    </>
  );
}

interface OperatorsTableFavoritesProps {
  favoriteOperators: string[];
  setFavoriteOperators: Dispatch<SetStateAction<string[]>>;
}
export function OperatorsTableFavorites({
  favoriteOperators,
  setFavoriteOperators,
}: OperatorsTableFavoritesProps) {
  const { isPending, isError, data, error } =
    useSuspenseQuery(getOperatorsData());

  const content = data
    .filter(
      (operator) =>
        operator.prefix && favoriteOperators.includes(operator.prefix)
    )
    .map((operator) => {
      return (
        <OperatorRow
          operatorData={operator}
          key={operator.index}
          isFavorite={true}
          setFavoriteOperators={setFavoriteOperators}
        />
      );
    });

  return (
    <>
      <Divider size="md" label={"Favorite operators"} labelPosition={"left"} />
      <OperatorsTableBase content={content} />
    </>
  );
}
