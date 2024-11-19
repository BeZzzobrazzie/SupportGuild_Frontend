import { Table } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./org-table-base.module.css"

interface OrgTableBase {
  content: JSX.Element[];
}
export function OrgTableBase({ content }: OrgTableBase) {
  const { t, i18n } = useTranslation();

  return (
    <Table highlightOnHover className={classes["table"]}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={classes["cell"]}>КПП</Table.Th>
          <Table.Th className={classes["cell"]}>Название
          </Table.Th>
          <Table.Th className={classes["cell"]}>Идентификатор
          </Table.Th>
          {/* <Table.Th className={classes["cell"]}>
          </Table.Th>
          <Table.Th className={classes["cell"]}></Table.Th>
          <Table.Th className={classes["cell"]}></Table.Th> */}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{content}</Table.Tbody>
    </Table>
  );
}