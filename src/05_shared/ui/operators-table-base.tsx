import { Table } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./operators-table-base.module.css"

interface OperatorsTableBase {
  content: JSX.Element[];
}
export function OperatorsTableBase({ content }: OperatorsTableBase) {
  const { t, i18n } = useTranslation();

  return (
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
      <Table.Tbody>{content}</Table.Tbody>
    </Table>
  );
}