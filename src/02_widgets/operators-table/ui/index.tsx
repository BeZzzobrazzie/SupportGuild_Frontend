import { ActionIcon, Button, Container, Modal, Table } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getOperatorsData } from "../api";
import {
  IconCopy,
  IconDotsVertical,
  IconFilter,
  IconInfoSquare,
  IconStar,
  IconZoom,
} from "@tabler/icons-react";
import classes from "./style.module.css";
import { operatorData } from "../api/types";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { CommandPanelBase } from "src/05_shared/ui/command-panel-base";
import { Info } from "../../../01_pages/operators-page/info/info";
import { useState } from "react";

export function OperatorsTable() {
  const { isPending, isError, data, error } =
    useSuspenseQuery(getOperatorsData());
  const { t, i18n } = useTranslation();

  const rows = data.map((element) => (
    <OperatorRow operatorData={element} key={element.index} />
  ));

  return (
    // <div className={classes["table__container"]}>
    <>
      <Table highlightOnHover className={classes["table"]}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={classes["cell-icon"]}></Table.Th>
            <Table.Th className={classes["cell-prefix"]}>
              {t("operators.table.prefix")}
              {/* <div className={classes["cell-prefix"]}>Prefix</div> */}
            </Table.Th>
            <Table.Th className={classes["cell-name"]}>
              {t("operators.table.name")}
            </Table.Th>
            <Table.Th className={classes["cell-email"]}>
              {t("operators.table.email")}
            </Table.Th>
            <Table.Th className={classes["cell-icon"]}></Table.Th>
            <Table.Th className={classes["cell-icon"]}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
    // {/* </div> */}
  );
}

interface OperatorRowProps {
  operatorData: operatorData;
}

function OperatorRow({ operatorData }: OperatorRowProps) {
  const [opened, { open, close }] = useDisclosure(false);

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
            <ActionIcon variant="subtle" color="gray">
              <IconStar />
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

        {/* <Table.Td>{element.index}</Table.Td> */}
        {/* <Table.Td>{element.inn}</Table.Td>
    <Table.Td>{element.kpp}</Table.Td> */}
        {/* <Table.Td>{element.status}</Table.Td> */}
        {/* <Table.Td>{element["validity period"]}</Table.Td> */}
        {/* <Table.Td>{element["phone number"]}</Table.Td> */}
        {/* <Table.Td>{element.address}</Table.Td> */}
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

interface OperatorCardProps {
  opened: boolean;
  open: () => void;
  close: () => void;
  operatorData: operatorData;
}
function OperatorCard({
  opened,
  open,
  close,
  operatorData,
}: OperatorCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <>
            {operatorData.prefix} | {operatorData.name}
          </>
        }
      >
        {/* <div>Порядковый номер: {operatorData.index}</div>
        <div>Наименование: {operatorData.name}</div>
        <div>ИНН: {operatorData.inn}</div>
        <div>КПП: {operatorData.kpp}</div>
        <div>Статус: {operatorData.status}</div>
        <div>Срок действия: {operatorData["validity period"]}</div>
        <div>Префикс: {operatorData.prefix}</div>
        <div>Email: {operatorData.email}</div>
        <div>Телефон: {operatorData["phone number"]}</div>
        <div>Сайт: {operatorData.address}</div> */}

        <Table highlightOnHover withRowBorders={false}>
          <Table.Tbody>
            <OperatorCardRow
              nameProperty={t("operators.index")}
              valueProperty={operatorData.index}
            />
            <OperatorCardRow
              nameProperty={t("operators.name")}
              valueProperty={operatorData.name}
            />
            <OperatorCardRow
              nameProperty={t("operators.inn")}
              valueProperty={operatorData.inn}
            />
            <OperatorCardRow
              nameProperty={t("operators.kpp")}
              valueProperty={operatorData.kpp}
            />
            <OperatorCardRow
              nameProperty={t("operators.status")}
              valueProperty={operatorData.status}
            />
            <OperatorCardRow
              nameProperty={t("operators.validity-period")}
              valueProperty={operatorData["validity period"]}
            />
            <OperatorCardRow
              nameProperty={t("operators.prefix")}
              valueProperty={operatorData.prefix}
            />
            <OperatorCardRow
              nameProperty={t("operators.email")}
              valueProperty={operatorData.email}
            />
            <OperatorCardRow
              nameProperty={t("operators.phone-number")}
              valueProperty={operatorData["phone number"]}
            />
            <OperatorCardRow
              nameProperty={t("operators.address")}
              valueProperty={operatorData.address}
            />
          </Table.Tbody>
        </Table>
      </Modal>
    </>
  );
}

interface OperatorCardRowProps {
  nameProperty: string;
  valueProperty?: string | number;
}
function OperatorCardRow({
  nameProperty,
  valueProperty,
}: OperatorCardRowProps) {
  const { t, i18n } = useTranslation();

  function handleClick() {
    if (navigator.clipboard) {
      const item = new ClipboardItem({
        "text/plain": String(valueProperty),
      });
      navigator.clipboard.write([item]);
      notifications.show({
        title: t("operators.copied"),
        message: `${nameProperty} ${t("operators.copied-message")}`,
      });
    }
  }

  return (
    <>
      <Table.Tr onClick={handleClick}>
        <Table.Td>{nameProperty}:</Table.Td>
        <Table.Td>{valueProperty}</Table.Td>
      </Table.Tr>
    </>
  );
}
