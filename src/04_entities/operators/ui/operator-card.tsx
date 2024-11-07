import { Modal, Table } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { operatorData } from "../api/types";
import { notifications } from "@mantine/notifications";

interface OperatorCardProps {
  opened: boolean;
  open: () => void;
  close: () => void;
  operatorData: operatorData;
}
export function OperatorCard({
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
