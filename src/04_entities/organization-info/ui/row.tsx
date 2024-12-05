import { Table } from "@mantine/core";
import classes from "./row.module.css";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

interface RowProps {
  kpp?: string;
  name?: string;
  id?: string;
  status?: string;
}
export function Row({ data }: { data: RowProps }) {
  return (
    <Table.Tr>
      <Cell content={data.kpp} />
      <Cell content={data.id} />
      <Cell content={data.name} />
      <Cell content={data.status} />
    </Table.Tr>
  );
}

interface Cell {
  content?: string;
}
function Cell({ content }: Cell) {
  const { t, i18n } = useTranslation();

  function handleClickCopy({ value }: { value: string | undefined }) {
    if (value && navigator.clipboard) {
      const item = new ClipboardItem({
        "text/plain": value,
        "text/html": value,
      });
      navigator.clipboard.write([item]);
      notifications.show({
        // title: "Copied",
        message: t("organizationInfo.notification.copied"),
      });
    }
  }
  return (
    <Table.Td
      className={classes["cell"]}
      onClick={() => handleClickCopy({ value: content })}
    >
      {content}
    </Table.Td>
  );
}
